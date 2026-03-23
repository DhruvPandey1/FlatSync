const db=require('../db')
const userLoginService=async(email)=>{
    const res =await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return res;
}

const createUserService=async(email,full_name,role,hashedPassword)=>{
    const res=await db.query(
        'INSERT INTO users (email,password_hash,full_name,role) values ($1,$2,$3,$4) RETURNING *',
        [email,hashedPassword,full_name,role]
    )

    return res;
}

const getAdminDetailsService=async(adminId)=>{
    const res=db.query(
        'SELECT full_name,email FROM users WHERE id=$1',
        [adminId]
    )

    return res
}

const updateAdminDetailsService=async(name,oldPassword,newPassword,adminId)=>{
    const res= await db.query(
        'SELECT password_hash FROM users WHERE id=$1',
        [adminId]
    );

    if(res.rows[0].password_hash!==oldPassword) return false;

    const update=await db.query(
        'UPDATE users SET full_name=$1,password_hash=$2 WHERE id=$3',
        [name,newPassword,adminId]
    )

    return update
    
}
const getAdminByEmailService = async(email) => {
    const res = await db.query(
        "SELECT * FROM users WHERE email = $1 AND role = $2",
        [email, "ADMIN"]
    );
    return res;
}

module.exports={
    userLoginService,
    createUserService,
    getAdminDetailsService,
    updateAdminDetailsService,
    getAdminByEmailService
}