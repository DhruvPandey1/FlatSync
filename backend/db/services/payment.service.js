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


const getPaymentDetailsAllService=async(userId)=>{
    const res=await db.query(`
                SELECT 
                    (SELECT SUM(amount_due) FROM subscription_records WHERE flat_id=f.id AND status='PENDING') as total_pending_debt
                FROM flats f
                WHERE f.owner_id=$1
                `,
                [userId]
            );
    return res
}

const getPaymentDetailsMonthService = async (month, userId) => {
    return await db.query(
        `SELECT sr.*,p.amount_paid,p.method,p.transaction_id,p.paid_at
        FROM subscription_records sr
        JOIN flats f ON sr.flat_id=f.id
        LEFT JOIN payments p ON sr.id=p.record_id
        WHERE sr.billing_month=$1 AND f.owner_id=$2
        `,[month, userId]
    );
};

const mockPaymentTransactionService = async (userId, month, isCumulative) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        
        let pendingRecords;
        if(isCumulative) {
            pendingRecords = await client.query(
                `SELECT sr.id, sr.amount_due FROM subscription_records sr JOIN flats f ON sr.flat_id = f.id WHERE f.owner_id = $1 AND sr.status = 'PENDING'`, 
                [userId]
            );
        } else {
            pendingRecords = await client.query(
                `SELECT sr.id, sr.amount_due FROM subscription_records sr JOIN flats f ON sr.flat_id = f.id WHERE f.owner_id = $1 AND sr.billing_month = $2 AND sr.status = 'PENDING'`, 
                [userId, month]
            );
        }

        const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random()*1000)}`;

        for (const record of pendingRecords.rows) {
            await client.query(
                `INSERT INTO payments (record_id, amount_paid, method, transaction_id) VALUES ($1, $2, 'UPI', $3)`,
                [record.id, record.amount_due, transactionId]
            );
            await client.query(
                `UPDATE subscription_records SET status = 'PAID' WHERE id = $1`,
                [record.id]
            );
        }

        await client.query('COMMIT');
        return transactionId;
    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const getReceiptDetailsService = async (month, userId) => {
    return await db.query(`
        SELECT sr.*,u.full_name,u.email,f.flat_number,f.wing,p.transaction_id,p.amount_paid
        FROM payments p 
        JOIN subscription_records sr ON p.record_id=sr.id
        JOIN flats f ON sr.flat_id=f.id
        JOIN users u ON f.owner_id=u.id
        WHERE sr.billing_month=$1 AND u.id=$2
        `,[month, userId]
    );
};

module.exports={
    paymentFlatService,
    pendingPaymentRecordService,
    manualPaymentService,
    getPaymentDetailsAllService,
    getPaymentDetailsMonthService,
    mockPaymentTransactionService,
    getReceiptDetailsService
}