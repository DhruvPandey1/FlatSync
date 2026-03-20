const db=require('../db/db');
const admin = require('../config/firebaseAdmin');







// const getDefaulters=async(req,res)=>{
//     try{
//         const query=`
//             SELECT u.full_name,u.email,f.flat_number,f.wing,COUNT(sr.id) as pending_months, SUM(sr.amount_due) as total_debt
//             FROM users u JOIN flats f ON u.id=f.owner_id
//             JOIN subscription_records sr ON f.id=sr.flat_id
//             WHERE sr.status='PENDING'
//             GROUP BY u.full_name,u.email,f.flat_number,f.wing
//             HAVING COUNT(sr.id)>=2
//             ORDER BY total_debt DESC;
//         `;

//         const result=await db.query(query);
//         res.json(result.rows);
//     }
//     catch(err){
//         res.status(500).json({
//             error:"Failed to fetch defaulter list"
//         })
//     }
// }


// const getAuditLogs=async(req,res)=>{
//     try{
//         const query=`
//             SELECT a.action_type,a.table_name,a.old_values,a.created_at,u.full_name as admin_name
//             FROM audit_logs a 
//             JOIN users u ON a.admin_id=u.id
//             ORDER BY a.created_at DESC LIMIT 50;
//         `;

//         const result=await db.query(query);
//         res.json(result.rows);
//     }
//     catch(err){
//         res.status(500).json({error:"Failed to fetch audit logs"})
//     }
// }







// module.exports={
//     getDashboardStats,
//     getAllFlats,
//     addFlat,
//     deleteFlat,
//     getPlanRate,
//     addPlanType,
//     updatePlanRate,
//     getPendingByFlat,
//     recordManualPayment,
//     getDefaulters,
//     getAuditLogs,
//     searchFlats,
//     getMonthlyRecords,
//     exportReport,
//     getNotifiactionHistory,
//     sendNotification
// };