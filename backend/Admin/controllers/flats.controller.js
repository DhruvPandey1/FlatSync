const { getAllFlatsService, addFlatService, deleteFlatService, searchFlatsService } = require('../../db/services/flats.service');

const getAllFlats=async(req,res)=>{
    try{
        const result= await getAllFlatsService();
        
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
        const result=await addFlatService(flat_number,wing,owner_id,type_id);
        res.status(201).json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

const deleteFlat=async(req,res)=>{
    const {id}=req.params;
    try{
        await deleteFlatService(id);
        res.json({message:"Flat deactivated. Payment history preserved."});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

const searchFlats=async(req,res)=>{
    const {q,wing}=req.query;
    try{
    
        const params=[];
        const result=await searchFlatsService(q,wing,params);
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