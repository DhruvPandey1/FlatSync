const {parse}=require('json2csv');
const PDFDocument = require('pdfkit');
const { getMonthlyRecordsService, exportReportService, getPaidPayemntService, getPendingPaymentService } = require('../../db/services/monthlyRecord.service');

const getMonthlyRecords=async (req, res) => {
    const { month, year } = req.query;
    const result = await getMonthlyRecordsService(month,year);
    res.json(result.rows);
}

const exportReport=async (req, res) => {
    const { type, month, year } = req.query;
    const data = await exportReportService(month,year);

    if (type === 'csv') {
        const csv = parse(data.rows);
        res.header('Content-Type', 'text/csv');
        res.attachment(`Report_${month}_${year}.csv`);
        return res.send(csv);
    } else if (type === 'pdf') {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="Report_${month}_${year}.pdf"`);
                res.setHeader('Content-Length', pdfData.length);
                res.send(pdfData);
            });

            doc.fillColor('#1e293b').fontSize(20).text('Monthly Collection Report', { align: 'center' });
            doc.fontSize(12).fillColor('#64748b').text(`Period: ${month}/${year}`, { align: 'center' });
            doc.moveDown(2);

            const tableTop = doc.y;
            const itemX = 50;
            const amountX = 350;
            const statusX = 450;
            
            doc.rect(50, tableTop, 500, 20).fill('#f1f5f9');
            doc.fillColor('#0f172a').fontSize(10).text('Transaction ID', itemX + 10, tableTop + 6);
            doc.text('Amount Paid', amountX, tableTop + 6);
            doc.text('Date', statusX, tableTop + 6);
            
            let currentY = tableTop + 30;
            let totalAmount = 0;

            data.rows.forEach(payment => {
                totalAmount += parseFloat(payment.amount_paid);
                doc.fillColor('#334155').fontSize(9).text(payment.transaction_id || 'N/A', itemX + 10, currentY);
                doc.text(`INR ${payment.amount_paid}`, amountX, currentY);
                doc.text(new Date(payment.paid_at).toLocaleDateString(), statusX, currentY);
                currentY += 20;
                
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }
            });

            doc.moveTo(50, currentY).lineTo(550, currentY).stroke('#e2e8f0');
            doc.moveDown(1);
            doc.fontSize(12).fillColor('#0f172a').text('Total Collected:', 250, currentY + 10);
            doc.fillColor('#16a34a').text(`INR ${totalAmount}`, amountX, currentY + 10);

            doc.end();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to generate PDF Report" });
        }
    }
}


const getReportsSummary = async (req, res) => {
    const { month, year } = req.query;

    try {

        const [collected, pending] = await Promise.all([
            getPaidPayemntService(month,year),
            getPendingPaymentService(month,year)
        ]);
        res.json({
            total_collected: parseFloat(collected.rows[0].total_paid || 0),
            total_pending: parseFloat(pending.rows[0].total_due || 0),
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate summary" });
    }
};
module.exports={
    getMonthlyRecords,
    exportReport,
    getReportsSummary
}