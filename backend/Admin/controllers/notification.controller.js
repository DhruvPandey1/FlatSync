const { notificationHistoryService, sendNotificationService, createNotificationsService } = require('../../db/services/notification.service');
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
    try {
        const { title, body, type } = req.body;
        
        const result = await sendNotificationService(type);

        const tokens = [];
        const userIds = [];

        result.rows.forEach(r => {
            if (r.fcm_token) tokens.push(r.fcm_token);
            if (r.id) userIds.push(r.id);
        });

        if (tokens.length === 0) return res.status(404).json({ error: "No registered devices" });

        const message = {
            notification: { title, body },
            tokens: tokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        
        if (userIds.length > 0) {
            await createNotificationsService(userIds, title, body);
        }

        res.json({ success: true, sentCount: response.successCount });
    } catch (err) {
         res.status(500).json({ error: "Failed to send notification" , message: err.message});
    }
};

module.exports={
    getNotifiactionHistory,
    sendNotification
}