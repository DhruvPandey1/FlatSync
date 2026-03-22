const db=require('../db');

const getPlanService=async()=>{
    const res=await db.query(
        'SELECT * FROM flat_types'
    );
    return res;
}

const addPlanService=async(name,monthly_rate)=>{
    const res=await db.query(
        'INSERT INTO flat_types (name, monthly_rate) VALUES ($1, $2) RETURNING *',
        [name, monthly_rate]
    );

    return res;
}

const updatePlanService=async(new_rate,type_id)=>{
    await db.query(
        'UPDATE flat_types SET monthly_rate=$1 WHERE id=$2',
        [new_rate,type_id]
    );
}

module.exports={
    getPlanService,
    addPlanService,
    updatePlanService
}