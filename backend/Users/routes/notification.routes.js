const express=require('express');
const { createfcmToken, markNotificationRead } = require('../controllers/notification.controller');

const router=express.Router();

router.put('/notification-read',markNotificationRead);
router.post('/save-fcm-token', createfcmToken);

module.exports= router;