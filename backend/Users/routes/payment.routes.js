const express=require('express');
const { getPaymentDetails, createOrder, verifyPayment, downloadReceipt } = require('../controllers/payment.controller');

const router=express.Router();

router.get('/payments/details',getPaymentDetails);
// router.post('/create-order',createOrder);
// router.post('verify-payment',verifyPayment);
router.get('/subscriptions/:id/download',downloadReceipt)

module.exports=router;