const db=require('../../db/db');
const admin = require('../config/firebaseAdmin');

const getNotifiactionHistory=async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, user_id ,title, message, is_read, created_at FROM notifications ORDER BY created_at DESC LIMIT 10'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" ,message:err.message});
    }
}



const sendNotification = async (req, res) => {
    const { title, body, type } = req.body;
    
    let query = 'SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL';
    if (type === 'PENDING') {
        query = `SELECT u.fcm_token FROM users u JOIN flats f ON f.owner_id=u.id JOIN subscription_records sr ON sr.flat_id=f.id WHERE u.fcm_token IS NOT NULL AND sr.status='PENDING'`;
    }
    
    const result = await db.query(query);
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