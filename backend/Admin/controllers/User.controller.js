const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { createUserService,getAdminDetailsService, updateAdminDetailsService } = require("../../db/services/auth.service");



const createUser=async(req,res)=>{
    try{
        const {name,email,role}=req.body;
        const generatedPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const result=await createUserService(email,name,role,hashedPassword);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Account Password',
            text: `Hello ${name},\n\nYour account has been created. Your password is: ${generatedPassword}\n\nPlease login and change your password.\n\nThanks!`
        };

        await transporter.sendMail(mailOptions);

        res.json({user: result.rows[0], message: "User created and password emailed successfully"});
    }
    catch(err){
        res.status(500).json({message:"User Not Created",error:err.message})
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