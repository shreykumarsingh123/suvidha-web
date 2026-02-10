import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

export interface ReceiptData {
    orderId: string;
    transactionId: string;
    amount: number;
    paymentMethod: string;
    paymentTime: Date;
    customerName: string;
    customerPhone: string;
    billDetails?: {
        serviceType: string;
        consumerNumber: string;
        billMonth: string;
    };
}

/**
 * Generate PDF receipt for payment
 */
export const generateReceipt = async (
    receiptData: ReceiptData
): Promise<string | null> => {
    try {
        const receiptsDir = path.join(__dirname, '../../receipts');

        // Create receipts directory if it doesn't exist
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }

        const fileName = `receipt_${receiptData.orderId}.pdf`;
        const filePath = path.join(receiptsDir, fileName);

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc.fontSize(24)
                .font('Helvetica-Bold')
                .text('SUVIDHA KIOSK', { align: 'center' })
                .fontSize(12)
                .font('Helvetica')
                .text('Smart City Mission - Payment Receipt', { align: 'center' })
                .moveDown(2);

            // Receipt Details
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .text('PAYMENT RECEIPT', { align: 'center', underline: true })
                .moveDown();

            // Transaction Info
            const leftColumn = 50;
            const rightColumn = 300;
            let yPosition = doc.y;

            doc.font('Helvetica-Bold').text('Order ID:', leftColumn, yPosition);
            doc.font('Helvetica').text(receiptData.orderId, rightColumn, yPosition);
            yPosition += 20;

            doc.font('Helvetica-Bold').text('Transaction ID:', leftColumn, yPosition);
            doc.font('Helvetica').text(receiptData.transactionId, rightColumn, yPosition);
            yPosition += 20;

            doc.font('Helvetica-Bold').text('Payment Date:', leftColumn, yPosition);
            doc.font('Helvetica').text(
                receiptData.paymentTime.toLocaleString('en-IN'),
                rightColumn,
                yPosition
            );
            yPosition += 20;

            doc.font('Helvetica-Bold').text('Payment Method:', leftColumn, yPosition);
            doc.font('Helvetica').text(receiptData.paymentMethod, rightColumn, yPosition);
            yPosition += 20;

            doc.font('Helvetica-Bold').text('Amount Paid:', leftColumn, yPosition);
            doc.font('Helvetica-Bold')
                .fontSize(14)
                .text(`₹${receiptData.amount.toFixed(2)}`, rightColumn, yPosition);
            yPosition += 30;

            // Customer Details
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .text('Customer Details:', leftColumn, yPosition);
            yPosition += 20;

            doc.font('Helvetica').text('Name:', leftColumn + 20, yPosition);
            doc.text(receiptData.customerName, rightColumn, yPosition);
            yPosition += 20;

            doc.text('Phone:', leftColumn + 20, yPosition);
            doc.text(receiptData.customerPhone, rightColumn, yPosition);
            yPosition += 30;

            // Bill Details (if available)
            if (receiptData.billDetails) {
                doc.font('Helvetica-Bold').text('Bill Details:', leftColumn, yPosition);
                yPosition += 20;

                doc.font('Helvetica').text('Service Type:', leftColumn + 20, yPosition);
                doc.text(receiptData.billDetails.serviceType, rightColumn, yPosition);
                yPosition += 20;

                doc.text('Consumer Number:', leftColumn + 20, yPosition);
                doc.text(receiptData.billDetails.consumerNumber, rightColumn, yPosition);
                yPosition += 20;

                doc.text('Bill Month:', leftColumn + 20, yPosition);
                doc.text(receiptData.billDetails.billMonth, rightColumn, yPosition);
                yPosition += 30;
            }

            // QR Code placeholder (simplified - in production, use qrcode library)
            doc.fontSize(8)
                .font('Helvetica')
                .text(
                    `Verify at: https://suvidha.gov.in/verify/${receiptData.orderId}`,
                    leftColumn,
                    yPosition,
                    { align: 'center' }
                );

            // Footer
            doc.moveDown(3)
                .fontSize(8)
                .font('Helvetica-Oblique')
                .text(
                    'This is a computer-generated receipt and does not require a signature.',
                    { align: 'center' }
                )
                .text('For queries, contact: support@suvidha.gov.in', { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                logger.info(`Receipt generated: ${fileName}`);
                resolve(filePath);
            });

            stream.on('error', (error) => {
                logger.error('Error generating receipt:', error);
                reject(error);
            });
        });
    } catch (error) {
        logger.error('Error in generateReceipt:', error);
        return null;
    }
};
