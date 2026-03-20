const express=require('express');
const { getAllFlats, addFlat, deleteFlat, searchFlats } = require('../controllers/flats.controller');
const router=express.Router();


router.get('/flats',getAllFlats);
router.post('/add-flats',addFlat);
router.delete('/flats/:id',deleteFlat);
router.get('/search-flats',searchFlats);

module.exports=router;