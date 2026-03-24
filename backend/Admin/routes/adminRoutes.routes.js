const express=require('express');
const {verifyAdmin}=require('../middleware/verifyAdmin');
const { generateMonthlyBills } = require('../utils/billingUtils');
const dashboardRoutes=require('./dashboard.routes');
const flatRoutes=require('./flats.routes');
const subscriptionRoutes=require('./subscriptionPlan.routes');
const monthlyRecordRoutes=require('./monthlyRecord.routes');
const manualPaymentRoutes=require('./manualPayment.routes');
const notificationRoutes=require('./notification.routes');
const userRoute=require('./User.routes');
const router=express.Router();

router.use(verifyAdmin);

router.use('/',userRoute)
router.use('/',dashboardRoutes)
router.use('/',flatRoutes)
router.use('/',subscriptionRoutes)
router.use('/',monthlyRecordRoutes)
router.use('/',manualPaymentRoutes)
router.use('/',notificationRoutes)

router.post('/generate-monthly-bills',async(req,res)=>{
    const {month}=req.body;
    if(!month){
        return res.status(400).json({error:"Month is required (YYYY-MM-DD)"});
    }
    try{
        const result=await generateMonthlyBills(month);
        if (result.count === 0) {
            return res.status(400).json({ error: "No bills remaining to be generated for this month." });
        }
        res.json({
            message:`Successfully generated ${result.count} bills for ${month}.`
        });
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
});







module.exports=router;