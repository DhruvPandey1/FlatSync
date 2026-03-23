const express=require('express');
const { getMonthlyRecords, exportReport, getReportsSummary } = require('../controllers/monthlyRecord.controller');

const router=express.Router();

router.get('/monthly-reports', getMonthlyRecords);
router.get('/export-report', exportReport);
router.get('/reports-summary',getReportsSummary)

module.exports=router;