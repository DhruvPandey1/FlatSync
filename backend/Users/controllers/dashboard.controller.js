const db=require('../../db/db');

const getDashboardSummary=async(req,res)=>{
    const userId=req.user.id;

    try{
        const summary=await db.query(`
            SELECT 
                f.flat_number,f.wing,
                (SELECT status FROM subscription_records WHERE flat_id=f.id ORDER BY billing_month DESC LIMIT 1) as current_month_status,
                (SELECT SUM(amount_due) FROM subscription_records WHERE flat_id=f.id AND status='PENDING') as total_pending_debt
            FROM flats f
            WHERE f.owner_id=$1
            `,[userId]
        );

        const notifications=await db.query(
            'SELECT * FROM notifications WHERE user_id=$1 AND is_read = false ORDER BY created_at DESC LIMIT 5',
            [userId]
        )

        res.json({
            flat_info:summary.rows[0],
            notifications:notifications.rows
        });

    }
    catch(err){
        res.status(500).json({
            error:"Dashboard load failed"
        })
    }
};

module.exports={getDashboardSummary}