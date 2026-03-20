const express=require('express');
const { sendNotification, getNotifiactionHistory } = require('../controllers/notification.controller');

const router=express.Router();

router.get('/notification-history', getNotifiactionHistory);
router.post('/send-notification',sendNotification);

module.exports=router;