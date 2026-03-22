const db=require('../db');

const getMonthlyRecordsService=async(month,year)=>{
    const res=await db.query(`
        SELECT f.flat_number,u.full_name ,p.method,sr.status,p.paid_at,sr.amount_due
        FROM users u 
        JOIN flats f ON f.owner_id=u.id 
        LEFT JOIN subscription_records sr ON sr.flat_id=f.id
        LEFT JOIN payments p ON sr.id = p.record_id
        AND sr.billing_month::char = $1 AND sr.billing_month::char = $2
    `, [month, year]);
    return res;
}

const exportReportService=async(month,year)=>{
    const res=await db.query('SELECT * FROM payments WHERE month=$1 AND year=$2', [month, year]);
    return res;
}

module.exports={
    getMonthlyRecordsService,
    exportReportService
}