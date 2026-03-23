const {parse}=require('json2csv');
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