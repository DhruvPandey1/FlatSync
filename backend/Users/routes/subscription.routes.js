const express=require('express');
const { getSubscriptionHistory, getSubscriptionDetail } = require('../controllers/subscriptions.controller');

const router=express.Router();

router.get('/subscriptions',getSubscriptionHistory);
router.get('/subscriptions/:month',getSubscriptionDetail);


module.exports=router;