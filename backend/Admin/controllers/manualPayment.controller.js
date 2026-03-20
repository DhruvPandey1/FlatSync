const db=require('../../db/db')

const getPendingByFlat = async (req, res) => {
    const { q } = req.query;
    try {
        const flatQuery = `
            SELECT f.id, f.flat_number, f.wing, u.full_name
            FROM flats f
            JOIN users u ON f.owner_id = u.id
            WHERE f.flat_number ILIKE $1 AND f.is_active = true
        `;
        const flatResult = await db.query(flatQuery, [q]);

        if (flatResult.rows.length === 0) return res.status(404).json({ error: "Flat not found" });

        const flat = flatResult.rows[0];
        const recordsQuery = `
            SELECT id, billing_month, amount_due 
            FROM subscription_records 
            WHERE flat_id = $1 AND status = 'PENDING'
            ORDER BY billing_month ASC
        `;
        const records = await db.query(recordsQuery, [flat.id]);

        res.json({ ...flat, pending_records: records.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const recordManualPayment=async(req,res)=>{
    const {record_id,amount_paid,method}=req.body;
    try{
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

        res.json({message:"Manual payment recorded successfully"});
    }
    catch(err){
        await db.query('ROLLBACK');
        res.status(500).json({error:"Transaction failed"});
    }
};

module.exports={
    getPendingByFlat,
    recordManualPayment
}
