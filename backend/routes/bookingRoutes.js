const express =require( 'express');
const { createBooking, getUserBookings } =require('../controllers/bookingController');


const router = express.Router();

router.post('/createbooking', createBooking);
router.post('/getuserbooking', getUserBookings);

module.exports=router;