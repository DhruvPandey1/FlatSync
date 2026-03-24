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

const updateAdminDetailsService=async(name,newPasswordHash,adminId)=>{
    if (newPasswordHash) {
        return await db.query(
            'UPDATE users SET full_name=$1, password_hash=$2 WHERE id=$3 RETURNING *',
            [name, newPasswordHash, adminId]
        );
    } else {
        return await db.query(
            'UPDATE users SET full_name=$1 WHERE id=$2 RETURNING *',
            [name, adminId]
        );
    }
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