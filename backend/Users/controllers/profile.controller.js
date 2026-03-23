const { getUserProfileService, updateUserProfileService } = require('../../db/services/profile.service');

const fetchProfile=async(req,res)=>{
    const userId=req.user.id
    try{
        const user = await getUserProfileService(userId);
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
        const bcrypt = require('bcrypt');
        if (password && typeof password === 'string' && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            await updateUserProfileService(full_name, email, hashedPassword, userId);
        } else {
            await updateUserProfileService(full_name, email, null, userId);
        }
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