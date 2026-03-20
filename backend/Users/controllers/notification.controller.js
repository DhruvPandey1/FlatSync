const db=require('../../db/db');


const markNotificationRead=async(req,res)=>{
    const {notificationId}=req.query;
    const userId=req.user.id;
    try{
        const result=await db.query(
            'UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2',
            [notificationId,userId]
        );

        if(result.rowCount===0){
            return res.status(404).json({message:"No record Found"})
        }
        res.json({message:"Notification dismissed."});
    }
    catch(err){
        res.status(500).json({error:"Update failed."});
    }
};


const createfcmToken=async (req, res) => {
    const { fcm_token } = req.body;

    const user_id = req.user.id;
    

    try {
        await db.query(
            'UPDATE users SET fcm_token = $1 WHERE id = $2', 
            [fcm_token, user_id]
        );
        res.status(200).json({ message: "Token saved" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save token" });
    }
}

module.exports={
    markNotificationRead,
    createfcmToken
}