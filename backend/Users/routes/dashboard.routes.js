const express=require('express');
const { getDashboardSummary } = require('../controllers/dashboard.controller');

const router=express.Router();

router.get('/dashboard',getDashboardSummary);

module.exports=router;