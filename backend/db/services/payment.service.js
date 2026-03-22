const db=require('../db');

const paymentFlatService=async(q)=>{
    const res=await db.query(`
        SELECT f.id, f.flat_number, f.wing, u.full_name
        FROM flats f
        JOIN users u ON f.owner_id = u.id
        WHERE f.flat_number ILIKE $1 AND f.is_active = true
    `,[q])

    return res
}

const pendingPaymentRecordService=async(id)=>{
    const res=await db.query(`
        SELECT id, billing_month, amount_due 
        FROM subscription_records 
        WHERE flat_id = $1 AND status = 'PENDING'
        ORDER BY billing_month ASC
    `,[id])
    return res
}

const manualPaymentService=async(record_id,amount_paid,method)=>{
    await db.query('BEGIN');

    await db.query(
        'UPDATE subscription_records SET status=$1 WHERE id=$2',
        ['PAID',record_id]
    );

    await db.query(
        'INSERT INTO payments (record_id, amount_paid, method, transaction_id) VALUES ($1,$2,$3,$4)',
        [record_id,amount_paid,method,`MANUAL_${Date.now()}`]
    );

    await db.query('COMMIT');
}

module.exports={
    paymentFlatService,
    pendingPaymentRecordService,
    manualPaymentService
}