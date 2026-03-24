const db=require('../db')

const getNotificationService =async(userId)=>{
    const res= await db.query(
        'SELECT * FROM notifications WHERE user_id=$1 AND is_read = false ORDER BY created_at DESC LIMIT 5',
        [userId]
    )

    return res;
}

const notificationHistoryService=async()=>{
    const res=await db.query(
        'SELECT MAX(CAST(id AS VARCHAR)) as id, title, message, MIN(created_at) as created_at FROM notifications GROUP BY title, message ORDER BY MIN(created_at) DESC LIMIT 10'
    );
    return res;
}

const sendNotificationService=async(type)=>{
    if(type==="PENDING"){
        const res= await db.query(`SELECT u.id, u.fcm_token FROM users u JOIN flats f ON f.owner_id=u.id JOIN subscription_records sr ON sr.flat_id=f.id WHERE u.fcm_token IS NOT NULL AND sr.status='PENDING'`);
        return res
    }

    const res=await db.query('SELECT id, fcm_token FROM users WHERE fcm_token IS NOT NULL');
    return res
}

const createNotificationsService = async (userIds, title, message) => {
    if (!userIds || userIds.length === 0) return;
    const values = [];
    let query = 'INSERT INTO notifications (user_id, title, message) VALUES ';
    let paramIndex = 1;
    for (let i = 0; i < userIds.length; i++) {
        query += `($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`;
        if (i < userIds.length - 1) query += ', ';
        values.push(userIds[i], title, message);
    }
    await db.query(query, values);
};

const notificationReadService=async(notificationId,userId)=>{
    const res=await db.query(
        'UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2',
        [notificationId,userId]
    );

    return res;
}

const fcmTokenService=async(fcm_token,user_id)=>{
    await db.query(
        'UPDATE users SET fcm_token = $1 WHERE id = $2', 
        [fcm_token, user_id]
    );
}

module.exports={
    getNotificationService,
    notificationHistoryService,
    sendNotificationService,
    createNotificationsService,
    notificationReadService,
    fcmTokenService
}