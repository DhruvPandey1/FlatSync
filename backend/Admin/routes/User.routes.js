const express=require('express');
const { createUser, getAdminDetails, updateAdminDetails } = require('../controllers/User.controller');

const router=express.Router();

router.post('/create-user',createUser);
router.get('/me',getAdminDetails);
router.put('/update-profile',updateAdminDetails)

module.exports=router