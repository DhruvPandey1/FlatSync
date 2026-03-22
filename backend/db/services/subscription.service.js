const db=require('../db');

const subscriptionHistoryService=async(userId)=>{
    const res=await db.query(`
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
    );

    return res;
}

const subscriptionDetailService=async(month,userId)=>{
    const res=await db.query(
        `SELECT sr.*,p.amount_paid,p.method,p.transaction_id,p.paid_at
        FROM subscription_records sr
        JOIN flats f ON sr.flat_id=f.id
        LEFT JOIN payments p ON sr.id=p.record_id
        WHERE sr.billing_month=$1 AND f.owner_id=$2
        `,[month,userId]
    );

    return res;
}


module.exports={
    subscriptionHistoryService,
    subscriptionDetailService
}