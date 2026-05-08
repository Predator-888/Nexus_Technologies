const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const Intern = require('./models/Intern');
const { generateOfferLetter, generateCertificate } = require('./utils/pdfGenerator');
const { sendDocumentsEmail } = require('./utils/emailSender');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Webhook endpoint needs raw body
app.post('/api/webhook/razorpay', express.raw({type: 'application/json'}), async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    try {
        const expectedSignature = crypto.createHmac('sha256', secret)
            .update(req.body)
            .digest('hex');

        if (expectedSignature === signature) {
            const payload = JSON.parse(req.body);
            const event = payload.event;
            
            if (event === 'payment.captured') {
                const payment = payload.payload.payment.entity;
                const orderId = payment.order_id;
                
                // We could mark as success here if not already done by frontend
                await Intern.findOneAndUpdate(
                    { razorpayOrderId: orderId },
                    { paymentStatus: 'SUCCESS', razorpayPaymentId: payment.id }
                );
                console.log(`Webhook: Payment captured for order ${orderId}`);
            }
            res.json({status: 'ok'});
        } else {
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Webhook error');
    }
});

app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Serve assets statically for download links
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nexus Technologies API is running' });
});

// 1. Create Order Endpoint
app.post('/api/payment/create-order', async (req, res) => {
    const { userData } = req.body;
    
    try {
        const options = {
            amount: 6900, // 69 RS in paise
            currency: 'INR',
            receipt: `receipt_${Math.random().toString(36).substring(7)}`
        };
        
        const order = await razorpay.orders.create(options);
        
        // Save pending intern to database
        const intern = new Intern({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            university: userData.university,
            domain: userData.domain,
            paymentStatus: 'PENDING',
            razorpayOrderId: order.id
        });
        await intern.save();
        
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            internId: intern._id
        });
    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

// 2. Verify Payment and Generate/Email Docs
app.post('/api/payment/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userData } = req.body;

    try {
        // Verify Signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            console.log("Payment verified successfully for:", userData.email);

            // Generate PDFs
            const offerLetterPath = await generateOfferLetter(userData);
            const certificatePath = await generateCertificate(userData);

            // Send Email
            await sendDocumentsEmail(userData, offerLetterPath, certificatePath);

            // Return relative URLs for frontend download
            const offerFileName = path.basename(offerLetterPath);
            const certFileName = path.basename(certificatePath);
            const offerLetterUrl = `http://localhost:${PORT}/assets/${offerFileName}`;
            const certificateUrl = `http://localhost:${PORT}/assets/${certFileName}`;

            // Update database record
            await Intern.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { 
                    paymentStatus: 'SUCCESS', 
                    razorpayPaymentId: razorpay_payment_id,
                    offerLetterUrl,
                    certificateUrl
                }
            );

            res.json({
                success: true,
                message: "Payment verified, documents generated and emailed successfully.",
                offerLetterUrl,
                certificateUrl
            });
        } else {
            // Update database as failed
            await Intern.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { paymentStatus: 'FAILED' }
            );
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "Internal server error during verification" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
