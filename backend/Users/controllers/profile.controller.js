const db=require('../../db/db')

const fetchProfile=async(req,res)=>{
    const userId=req.user.id
    try{
        const user=await db.query('SELECT * from users WHERE id=$1',[userId]);
        res.status(200).json(user.rows[0]);

    }
    catch(err){
        res.status(500).json({error:"Record not found"})
    }
}
const updateProfile=async(req,res)=>{
    const {full_name,email,password}=req.body;
    const userId=req.user.id;
    try{
        await db.query('UPDATE users SET full_name =$1,email =$2,password_hash =$3 WHERE id=$4',[full_name,email,password,userId])
        res.json({message:"Profile updated successfully"})
    }
    catch(err){
        res.status(500).json({error:"Update failed",message:err.message})
    }
}

module.exports={
    fetchProfile,
    updateProfile
}