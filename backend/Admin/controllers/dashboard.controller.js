const db=require('../../db/db')

const getDashboardStats=async (req,res)=>{
    try{
        const stats=await db.query(`
            SELECT
            (SELECT COUNT(*) FROM flats WHERE is_active=true)::int as total_flats,
            (SELECT SUM(amount_paid) FROM payments)::float as total_collected,
            (SELECT SUM(amount_due) FROM subscription_records WHERE status='PENDING')::float as total_pending
        `);
        const transaction=await db.query(`
            SELECT sr.id,sr.amount_due,sr.status,f.flat_number,u.full_name
            FROM subscription_records sr
            JOIN flats f ON sr.flat_id=f.id
            JOIN users u ON f.owner_id=u.id
            ORDER BY sr.id DESC LIMIT 5
        `)

        res.json({stats:stats.rows[0],recent_payments:transaction.rows});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

module.exports={
    getDashboardStats
}