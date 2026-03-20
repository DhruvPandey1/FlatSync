const db=require('../../db/db')

const getAllFlats=async(req,res)=>{
    try{
        const result=await db.query(`
            SELECT f.id,f.flat_number,f.wing,u.full_name,u.email,ft.name as plan_type
            FROM flats f
            JOIN users u ON f.owner_id=u.id
            JOIN flat_types ft ON f.type_id=ft.id
            WHERE f.is_active=true
            ORDER BY f.wing,f.flat_number
        `);
        
        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({
            error:err.message
        });
    }
};

const addFlat=async(req,res)=>{
    const {flat_number,wing,owner_id,type_id}=req.body;
    try{
        const result=await db.query(
            'INSERT INTO flats (flat_number,wing,owner_id,type_id) VALUES ($1,$2,$3,$4) RETURNING *',
            [flat_number,wing,owner_id,type_id]
        );
        res.status(201).json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

const deleteFlat=async(req,res)=>{
    const {id}=req.params;
    try{
        await db.query('UPDATE flats SET is_active=false WHERE id=$1',[id]);
        res.json({message:"Flat deactivated. Payment history preserved."});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

const searchFlats=async(req,res)=>{
    const {q,wing}=req.query;
    try{
        let query=`
            SELECT f.*,u.full_name,u.email
            FROM flats f
            JOIN users u ON f.owner_id=u.id
            WHERE f.is_active=true
        `;

        const params=[];

        if(q){
            params.push(`%${q}%`);
            query+=`AND (u.full_name ILIKE $${params.length} OR f.flat_number ILIKE $${params.length})`;
        }

        if(wing){
            params.push(wing);
            query+=`AND f.wing=$${params.length}`;
        }

        const result=await db.query(query,params);
        res.json(result.rows);
        
    }
    catch(err){
        res.status(500).json({
            error:"Search Failed"
        });
    }
}

module.exports={
    getAllFlats,
    addFlat,
    deleteFlat,
    searchFlats
}