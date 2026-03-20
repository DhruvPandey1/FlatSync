const express=require('express');
const { getMonthlyRecords, exportReport } = require('../controllers/monthlyRecord.controller');

const router=express.Router();

router.get('/monthly-reports', getMonthlyRecords);
router.get('/export-report', exportReport);

module.exports=router;