const { dashboardSummaryService} = require('../../db/services/dashboard.service');
const { getNotificationService } = require('../../db/services/notification.service');

const getDashboardSummary=async(req,res)=>{
    const userId=req.user.id;

    try{
        const summary= await dashboardSummaryService(userId);

        const notifications= await getNotificationService(userId);

        res.json({
            flat_info:summary.rows[0],
            notifications:notifications.rows
        });

    }
    catch(err){
        res.status(500).json({
            error:"Dashboard load failed"
        })
    }
};

module.exports={getDashboardSummary}