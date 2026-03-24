const express = require('express');
const { getAllFlats, addFlat, deleteFlat, searchFlats, editFlat } = require('../controllers/flats.controller');
const router = express.Router();


router.get('/flats', getAllFlats);
router.post('/add-flats', addFlat);
router.delete('/flats/:id', deleteFlat);
router.get('/search-flats', searchFlats);
router.put('/edit-flat/:id', editFlat);

module.exports = router;