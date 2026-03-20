const db=require('../../db/db');

const isResident=async(req,res,next)=>{
    const userId=req.headers['x-user-id'];

    if(!userId){
        return res.status(401).json({error:"Unauthorized. Please provide a user ID."});
    }

    try{
        const user=await db.query('SELECT id,role FROM users WHERE id=$1',[userId]);

        if(user.rows.length===0){
            return res.status(404).json({error:"User not found."});
        }

        if(user.rows[0].role!=='RESIDENT'){
            return res.status(403).json({error:"Access Denied. Resident role required."});
        }

        req.user=user.rows[0];
        next();
    }
    catch(err){
        res.status(500).json({error:"Authentication error",message:err.message});
    }
}

module.exports={isResident}