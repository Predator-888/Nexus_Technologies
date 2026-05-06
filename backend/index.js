const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');
const { generateOfferLetter, generateCertificate } = require('./utils/pdfGenerator');
const { sendDocumentsEmail } = require('./utils/emailSender');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Serve assets statically for download links
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CodSoft API is running' });
});

// 1. Create Order Endpoint
app.post('/api/payment/create-order', async (req, res) => {
    try {
        const options = {
            amount: 6900, // 69 RS in paise
            currency: 'INR',
            receipt: `receipt_${Math.random().toString(36).substring(7)}`
        };
        
        const order = await razorpay.orders.create(options);
        
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
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

            res.json({
                success: true,
                message: "Payment verified, documents generated and emailed successfully.",
                offerLetterUrl: `http://localhost:${PORT}/assets/${offerFileName}`,
                certificateUrl: `http://localhost:${PORT}/assets/${certFileName}`
            });
        } else {
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
