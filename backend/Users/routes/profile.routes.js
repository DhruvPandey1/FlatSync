const express = require('express');
const { fetchProfile, updateProfile } = require('../controllers/profile.controller');

const router = express.Router();

router.get('/fetch-profile', fetchProfile);
router.put('/profile', updateProfile);

module.exports = router;