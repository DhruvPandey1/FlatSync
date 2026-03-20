const express=require('express');
const { getPlanRate, addPlanType, updatePlanRate } = require('../controllers/subscriptionPlan.controller');

const router=express.Router();

router.get('/plan-types',getPlanRate);
router.post('/add-plan-type',addPlanType);
router.put('/update-plan-rate',updatePlanRate);

module.exports=router;