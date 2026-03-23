const express=require('express');
const { getPaymentDetails, mockPayment, downloadReceipt } = require('../controllers/payment.controller');

const router=express.Router();

router.get('/payments/details',getPaymentDetails);
router.post('/payments/mock-pay', mockPayment);
router.get('/subscriptions/:id/download',downloadReceipt)

module.exports=router;