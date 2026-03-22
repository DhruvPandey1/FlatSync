const db=require('../../db/db');
const { getMonthlyRecordsService, exportReportService } = require('../../db/services/monthlyRecord.service');

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

module.exports={
    getMonthlyRecords,
    exportReport
}