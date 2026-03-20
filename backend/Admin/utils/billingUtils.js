const db = require('../../db/db');

const generateMonthlyBills=async(billingMonth)=>{
    const client = await db.connect();
    try{
        await client.query('BEGIN');

        const checkExist=await client.query(
            'SELECT 1 FROM subscription_records WHERE billing_month=$1 LIMIT 1',
            [billingMonth]
        );

        if(checkExist.rows.length>0){
            throw new Error(`Bills for ${billingMonth} have already been generated.`);
        }

        const insertQuery=`
            INSERT INTO subscription_records(flat_id,billing_month,amount_due,status)
            SELECT f.id,$1,ft.monthly_rate,'PENDING'
            FROM flats f
            JOIN flat_types ft ON f.type_id=ft.id
            WHERE f.is_active=TRUE
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