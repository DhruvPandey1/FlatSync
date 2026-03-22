const db = require('../db');

const dashboardStatsService = async () => {
    const res = await db.query(`
        SELECT
        (SELECT COUNT(*) FROM flats WHERE is_active=true)::int as total_flats,
        (SELECT SUM(amount_paid) FROM payments)::float as total_collected,
        (SELECT SUM(amount_due) FROM subscription_records WHERE status='PENDING')::float as total_pending
    `);

    return res;
}

const getTransactionService=async()=>{
    const res = await db.query(`
        SELECT sr.id,sr.amount_due,sr.status,f.flat_number,u.full_name
        FROM subscription_records sr
        JOIN flats f ON sr.flat_id=f.id
        JOIN users u ON f.owner_id=u.id
        ORDER BY sr.id DESC LIMIT 5
    `)

    return res;
}

const dashboardSummaryService=async(userId)=>{
    const res=await db.query(`
        SELECT 
            f.flat_number,f.wing,
            (SELECT status FROM subscription_records WHERE flat_id=f.id ORDER BY billing_month DESC LIMIT 1) as current_month_status,
            (SELECT SUM(amount_due) FROM subscription_records WHERE flat_id=f.id AND status='PENDING') as total_pending_debt
        FROM flats f
        WHERE f.owner_id=$1
        `,[userId]
    );

    return res;
}


module.exports={
    dashboardStatsService,
    getTransactionService,
    dashboardSummaryService,
}