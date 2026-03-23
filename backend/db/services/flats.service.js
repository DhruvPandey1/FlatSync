const db=require('../db')

const getAllFlatsService=async()=>{
    const res=await db.query(`
        SELECT f.id,f.flat_number,f.wing,u.full_name,u.email,ft.name as plan_type
        FROM flats f
        JOIN users u ON f.owner_id=u.id
        JOIN flat_types ft ON f.type_id=ft.id
        WHERE f.is_active=true
        ORDER BY f.wing,f.flat_number
    `);

    return res;
}

const addFlatService=async(flat_number,wing,owner_id,type_id)=>{
    const res=await db.query(
        'INSERT INTO flats (flat_number,wing,owner_id,type_id) VALUES ($1,$2,$3,$4) RETURNING *',
        [flat_number,wing,owner_id,type_id]
    );

    return res;
}

const deleteFlatService=async(id)=>{
    await db.query('UPDATE flats SET is_active=false WHERE id=$1',[id]);
}

const editFlatService = async (id, flat_number, wing, owner_id, type_id) => {
    const res = await db.query(
        'UPDATE flats SET flat_number=$1, wing=$2, owner_id=$3, type_id=$4 WHERE id=$5 RETURNING *',
        [flat_number, wing, owner_id, type_id, id]
    );
    return res;
}

const searchFlatsService=async(q,wing,params)=>{
    let query=`
        SELECT f.*,u.full_name,u.email
        FROM flats f
        JOIN users u ON f.owner_id=u.id
        WHERE f.is_active=true
    `;

    if(q){
        params.push(`%${q}%`);
        query+=`AND (u.full_name ILIKE $${params.length} OR f.flat_number ILIKE $${params.length})`;
    }


    if(wing){
        params.push(wing);
        query+=`AND f.wing=$${params.length}`;
    }

    const res=await db.query(query,params);

    return res;
}

module.exports={
    getAllFlatsService,
    addFlatService,
    deleteFlatService,
    searchFlatsService,
    editFlatService
}