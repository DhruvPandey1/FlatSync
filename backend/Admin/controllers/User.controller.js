const bcrypt = require("bcrypt");
const { createUserService,getAdminDetailsService, updateAdminDetailsService } = require("../../db/services/auth.service");



const createUser=async(req,res)=>{
    try{
        const {full_name,email,role,password}=req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const result=await createUserService(email,full_name,role,hashedPassword);

        res.json({...result.rows,hashedPassword:password});
    }
    catch(err){
        res.status(500).json({message:"User Not Created"})
    }
    
}

const getAdminDetails=async(req,res)=>{
    try{
        const adminId=req.admin.id;
        const admin=await getAdminDetailsService(adminId);

        res.json(admin.rows[0]);
    }
    catch(err){
        res.status(500).json({error:"Admin not found."})
    }
}

const updateAdminDetails=async(req,res)=>{
    try{
        const {name,oldPassword,newPassword}=req.body;
        const adminId=req.admin.id;

        const result = await updateAdminDetailsService(name,oldPassword,newPassword,adminId);

        if(!result){
            return res.status(401).json("Unauthorized the creadentials are incorrect")
        }

        res.json("Update is successfull");

    }
    catch(err){
        res.status(500).json({error:"Update is unsuccessfull",message:err.message});
    }
}
module.exports={
    createUser,
    getAdminDetails,
    updateAdminDetails
}