const isAdmin=(req,res,next)=>{
    const role=req.headers['x-role'];

    if(role!=='ADMIN'){
        return res.status(403).json(
            {
                error:"Access Denied. Admin only."
            }
        )
    }
    next();
}


module.exports={isAdmin};