const express=require('express');
const {verifyToken} =require('../middleware/userAuth')
const dashboardRoutes=require('./dashboard.routes');
const subscriptionRoutes=require('./subscription.routes');
const paymentRoutes=require('./payment.routes');
const notificationRoutes=require('./notification.routes');
const profileRoutes=require('./profile.routes');
const authRoutes=require('./auth.routes')

const router=express.Router();

router.use('/auth',authRoutes);

router.use(verifyToken);


router.use('/',dashboardRoutes)
router.use('/',subscriptionRoutes)
router.use('/',paymentRoutes)
router.use('/',notificationRoutes)
router.use('/',profileRoutes)



module.exports=router;


