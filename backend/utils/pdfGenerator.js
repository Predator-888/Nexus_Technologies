const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate an Offer Letter PDF
 */
const generateOfferLetter = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const filePath = path.join(__dirname, `../assets/Offer_Letter_${userData.name.replace(/\s+/g, '_')}.pdf`);
            const writeStream = fs.createWriteStream(filePath);
            
            doc.pipe(writeStream);

            // Add Background
            const bgPath = path.join(__dirname, '../assets/offer_letter_bg.png');
            if (fs.existsSync(bgPath)) {
                doc.image(bgPath, 0, 0, { width: 595.28, height: 841.89 }); // A4 dimensions
            }

            // Typography & Positioning
            doc.font('Helvetica-Bold')
               .fontSize(24)
               .fillColor('#1a202c') // Dark Navy
               .text('INTERNSHIP OFFER LETTER', 0, 150, { align: 'center' });

            doc.font('Helvetica')
               .fontSize(12)
               .fillColor('#4a5568')
               .text(`Date: ${new Date().toLocaleDateString()}`, 50, 220);

            doc.moveDown(2);
            doc.font('Helvetica-Bold').text(`Dear ${userData.name},`);
            
            doc.moveDown(1);
            doc.font('Helvetica').text(
                `We are thrilled to offer you the position of Intern in the ${userData.domain} domain at CodSoft. ` +
                `We were highly impressed with your background from ${userData.university} and believe that your skills ` +
                `align perfectly with our goals.`
            );

            doc.moveDown(1);
            doc.text(`This internship will provide you with an opportunity to gain hands-on experience, develop your professional skills, and contribute to meaningful projects.`);

            doc.moveDown(2);
            doc.font('Helvetica-Bold').text('Terms and Conditions:');
            doc.font('Helvetica').text('- This is a virtual, unpaid internship program.');
            doc.text('- You are expected to complete the assigned tasks within the given deadlines.');
            doc.text('- Upon successful completion, you will receive a verified Certificate of Internship.');

            doc.moveDown(3);
            doc.text('We look forward to having you on board!');
            
            doc.moveDown(2);
            doc.font('Helvetica-Bold').text('Sincerely,');
            doc.text('CodSoft Team');

            doc.end();

            writeStream.on('finish', () => resolve(filePath));
            writeStream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Generate a Certificate PDF
 */
const generateCertificate = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            // Certificate is typically Landscape
            const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
            const filePath = path.join(__dirname, `../assets/Certificate_${userData.name.replace(/\s+/g, '_')}.pdf`);
            const writeStream = fs.createWriteStream(filePath);
            
            doc.pipe(writeStream);

            // Add Background
            const bgPath = path.join(__dirname, '../assets/certificate_bg.png');
            if (fs.existsSync(bgPath)) {
                doc.image(bgPath, 0, 0, { width: 841.89, height: 595.28 }); // A4 Landscape dimensions
            }

            // Typography & Positioning
            doc.font('Helvetica-Bold')
               .fontSize(40)
               .fillColor('#1a202c') // Dark Navy
               .text('CERTIFICATE OF INTERNSHIP', 0, 140, { align: 'center' });

            doc.moveDown(1);
            doc.font('Helvetica')
               .fontSize(16)
               .fillColor('#718096')
               .text('This is proudly presented to', { align: 'center' });

            doc.moveDown(1);
            doc.font('Helvetica-Bold')
               .fontSize(36)
               .fillColor('#2b6cb0') // Blue accent
               .text(userData.name, { align: 'center' });

            doc.moveDown(1);
            doc.font('Helvetica')
               .fontSize(16)
               .fillColor('#4a5568')
               .text(`for successfully completing the Virtual Internship Program in`, { align: 'center' });

            doc.moveDown(0.5);
            doc.font('Helvetica-Bold')
               .fontSize(20)
               .fillColor('#1a202c')
               .text(`${userData.domain}`, { align: 'center' });

            doc.moveDown(2);
            doc.font('Helvetica')
               .fontSize(12)
               .text(`Date of Issue: ${new Date().toLocaleDateString()}`, 100, 480);
               
            doc.text('CodSoft Director', 600, 480);

            doc.end();

            writeStream.on('finish', () => resolve(filePath));
            writeStream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateOfferLetter,
    generateCertificate
};
