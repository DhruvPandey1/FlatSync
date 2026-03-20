const db=require('../../db/db')

const getPlanRate=async(req,res)=>{
    try{
        const plan= await db.query(
            'SELECT * FROM flat_types'
        );

        res.json(plan.rows);
    }
    catch(err){
        res.status(500).json(err.message);
    }
}

const addPlanType = async (req, res) => {
    const { name, monthly_rate } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO flat_types (name, monthly_rate) VALUES ($1, $2) RETURNING *',
            [name, monthly_rate]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

const updatePlanRate=async(req,res)=>{
    const {type_id,new_rate}=req.body;
    try{
        await db.query(
            'UPDATE flat_types SET monthly_rate=$1 WHERE id=$2',
            [new_rate,type_id]
        );

        res.json({
            message:"Plan rate updated successfully."
        });
    }
    catch(err){
        res.status(500).json({
            error:"Update failed"
        });
    }
}

module.exports={
    addPlanType,
    getPlanRate,
    updatePlanRate
}