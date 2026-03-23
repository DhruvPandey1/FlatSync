const db = require('../../db/db');

const generateMonthlyBills=async(billingMonth)=>{
    const client = await db.connect();
    try{
        await client.query('BEGIN');

        
        const insertQuery=`
            INSERT INTO subscription_records(flat_id, billing_month, amount_due, status)
            SELECT 
                f.id as flat_id,
                $1::DATE as billing_month,
                CASE 
                    WHEN DATE_TRUNC('month', u.created_at) = DATE_TRUNC('month', $1::DATE) THEN
                        ROUND(ft.monthly_rate * (
                            EXTRACT(DAY FROM (DATE_TRUNC('month', $1::DATE) + INTERVAL '1 month - 1 day')) - EXTRACT(DAY FROM u.created_at) + 1
                        ) / EXTRACT(DAY FROM (DATE_TRUNC('month', $1::DATE) + INTERVAL '1 month - 1 day'))::NUMERIC, 2)
                    ELSE ft.monthly_rate
                END as amount_due,
                'PENDING' as status
            FROM flats f
            JOIN flat_types ft ON f.type_id = ft.id
            JOIN users u ON f.owner_id = u.id
            WHERE f.is_active = TRUE
            AND NOT EXISTS (
                SELECT 1 FROM subscription_records sr 
                WHERE sr.flat_id = f.id AND sr.billing_month = $1::DATE
            )
        `;

        const result=await client.query(insertQuery,[billingMonth]);
        await client.query('COMMIT');
        return {success:true,count:result.rowCount};
    }
    catch(err){
        await client.query('ROLLBACK');
        throw err;
    }
    finally{
        client.release();
    }
};

module.exports={generateMonthlyBills};