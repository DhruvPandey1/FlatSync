const db=require('../db');

const getMonthlyRecordsService=async(month,year)=>{
    const res=await db.query(`
        SELECT f.flat_number,u.full_name ,p.method,sr.status,p.paid_at,sr.amount_due
        FROM users u 
        JOIN flats f ON f.owner_id=u.id 
        LEFT JOIN subscription_records sr ON sr.flat_id=f.id AND EXTRACT(MONTH FROM sr.billing_month) = $1 AND EXTRACT(YEAR FROM sr.billing_month) = $2
        LEFT JOIN payments p ON sr.id = p.record_id
    `, [month, year]);
    return res;
}

const exportReportService=async(month,year)=>{
    const res=await db.query(`
        SELECT f.flat_number, u.full_name, p.method, sr.status, p.paid_at, sr.amount_due, p.amount_paid, p.transaction_id
        FROM flats f 
        LEFT JOIN users u ON f.owner_id=u.id 
        LEFT JOIN subscription_records sr ON sr.flat_id=f.id AND EXTRACT(MONTH FROM sr.billing_month) = $1 AND EXTRACT(YEAR FROM sr.billing_month) = $2
        LEFT JOIN payments p ON sr.id = p.record_id
    `, [month, year]);

    return res;
}

const getPaidPayemntService=async(month,year)=>{
    const res=await db.query(`
            SELECT SUM(amount_paid) as total_paid
            FROM payments 
            WHERE EXTRACT(MONTH FROM paid_at) = $1 AND EXTRACT(YEAR FROM paid_at) = $2
        `,[month,year])
    return res
    
}

const getPendingPaymentService=async(month,year)=>{
    const res=await db.query(`
            SELECT SUM(amount_due) as total_due
            FROM subscription_records
            WHERE EXTRACT(MONTH FROM billing_month) = $1 AND EXTRACT(YEAR FROM billing_month) = $2 AND status = 'PENDING'
        `,[month,year]);
    
    return res
}
module.exports={
    getMonthlyRecordsService,
    exportReportService,
    getPaidPayemntService,
    getPendingPaymentService
}