const { dashboardStatsService, getTransactionService } = require('../../db/services/dashboard.service');

const getDashboardStats=async (req,res)=>{
    try{
        const stats= await dashboardStatsService();
        const transaction= await getTransactionService();

        res.json({stats:stats.rows[0],recent_payments:transaction.rows});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

module.exports={
    getDashboardStats
}