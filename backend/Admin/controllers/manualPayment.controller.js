const db=require('../../db/db');
const { paymentFlatService, pendingPaymentRecordService, manualPaymentService } = require('../../db/services/payment.service');

const getPendingByFlat = async (req, res) => {
    const { q } = req.query;
    try {
        const flatResult = await paymentFlatService(q);

        if (flatResult.rows.length === 0) return res.status(404).json({ error: "Flat not found" });

        const flat = flatResult.rows[0];

        const records = await pendingPaymentRecordService(flat.id);

        res.json({ ...flat, pending_records: records.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const recordManualPayment=async(req,res)=>{
    const {record_id,amount_paid,method}=req.body;
    try{
        await manualPaymentService(record_id,amount_paid,method)

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
