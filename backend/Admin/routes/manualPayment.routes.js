const expres=require('express');
const { getPendingByFlat, recordManualPayment } = require('../controllers/manualPayment.controller');

const router=expres.Router();

router.get('/pending-by-flat',getPendingByFlat);
router.post('/manual-payment',recordManualPayment);

module.exports=router;