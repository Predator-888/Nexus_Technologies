const nodemailer = require('nodemailer');

const sendDocumentsEmail = async (userData, offerLetterPath, certificatePath) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Setup email data
        const mailOptions = {
            from: `"CodSoft" <${process.env.EMAIL_USER}>`,
            to: userData.email,
            subject: 'Your CodSoft Internship Documents',
            text: `Dear ${userData.name},\n\nCongratulations on selecting the ${userData.domain} domain! Please find your Offer Letter and Certificate attached.\n\nBest regards,\nCodSoft Team`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Welcome to CodSoft!</h2>
                    <p>Dear <strong>${userData.name}</strong>,</p>
                    <p>Congratulations on enrolling in the <strong>${userData.domain}</strong> internship program.</p>
                    <p>We have successfully processed your registration. Please find your official <strong>Offer Letter</strong> and <strong>Certificate of Internship</strong> attached to this email.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>The CodSoft Team</strong></p>
                </div>
            `,
            attachments: [
                {
                    filename: 'CodSoft_Offer_Letter.pdf',
                    path: offerLetterPath
                },
                {
                    filename: 'CodSoft_Certificate.pdf',
                    path: certificatePath
                }
            ]
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendDocumentsEmail
};
