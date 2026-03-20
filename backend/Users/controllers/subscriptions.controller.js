const db=require('../../db/db')

const getSubscriptionHistory=async(req,res)=>{
    const userId=req.user.id;
    try{
        const history=await db.query(`
            SELECT 
                sr.id as record_id,
                sr.billing_month,
                sr.amount_due,
                sr.status,
                p.method,
                p.paid_at
            FROM subscription_records sr 
            JOIN flats f ON sr.flat_id=f.id
            LEFT JOIN payments p ON sr.id=p.record_id
            WHERE f.owner_id=$1
            ORDER BY sr.billing_month DESC
            `,[userId]
        )

        res.json(history.rows);
    }
    catch(err){
        res.status(500).json({
            error:"History load failed"
        })
    }
}

const getSubscriptionDetail=async(req,res)=>{
    const {month}=req.params;
    const userId=req.user.id;

    try{
        const result=await db.query(
            `SELECT sr.*,p.amount_paid,p.method,p.transaction_id,p.paid_at
            FROM subscription_records sr
            JOIN flats f ON sr.flat_id=f.id
            LEFT JOIN payments p ON sr.id=p.record_id
            WHERE sr.billing_month=$1 AND f.owner_id=$2
            `,[month,userId]
        );

        if(result.rows.length===0){
            return res.status(404).json({error:"Record not found or access denied."});
        }

        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({error:"Server error"});
    }
}

module.exports={
    getSubscriptionHistory,
    getSubscriptionDetail
}