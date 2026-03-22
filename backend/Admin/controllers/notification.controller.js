const { notificationHistoryService, sendNotificationService } = require('../../db/services/notification.service');
const admin = require('../config/firebaseAdmin');

const getNotifiactionHistory=async (req, res) => {
    try {
        const result = await notificationHistoryService();
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" ,message:err.message});
    }
}



const sendNotification = async (req, res) => {
    const { title, body, type } = req.body;
    
    const result = await sendNotificationService(type);

    const tokens = result.rows.map(r => r.fcm_token);

    if (tokens.length === 0) return res.status(404).send("No registered devices");

    const message = {
        notification: { title, body },
        tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    res.json({ success: true, sentCount: response.successCount });
};


module.exports={
    getNotifiactionHistory,
    sendNotification
}