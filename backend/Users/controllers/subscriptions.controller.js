const { subscriptionHistoryService, subscriptionDetailService } = require('../../db/services/subscription.service');

const getSubscriptionHistory=async(req,res)=>{
    const userId=req.user.id;
    try{
        const history=await subscriptionHistoryService(userId);
        res.json(history.rows);
    }
    catch(err){
        res.status(500).json({
            error:"History load failed"
        })
    }
}

const getSubscriptionDetail=async(req,res)=>{
    const {month}=req.params;
    const userId=req.user.id;

    try{
        const result=await subscriptionDetailService(month,userId);

        if(result.rows.length===0){
            return res.status(404).json({error:"Record not found or access denied."});
        }

        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({error:"Server error"});
    }
}

module.exports={
    getSubscriptionHistory,
    getSubscriptionDetail
}