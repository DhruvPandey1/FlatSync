const { getPlanService, addPlanService, updatePlanService } = require('../../db/services/subscriptionPlan.service');

const getPlanRate=async(req,res)=>{
    try{
        const plan= await getPlanService();

        res.json(plan.rows);
    }
    catch(err){
        res.status(500).json(err.message);
    }
}

const addPlanType = async (req, res) => {
    const { name, monthly_rate } = req.body;
    try {
        const result = await addPlanService(name,monthly_rate);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

const updatePlanRate=async(req,res)=>{
    const {type_id,new_rate}=req.body;
    try{
        await updatePlanService(new_rate,type_id)

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