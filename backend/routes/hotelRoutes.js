const express=require("express")
const { getAllHotels, createHotel } =require('../controllers/hotelController');

const router = express.Router();

router.get('/gethotels', getAllHotels);
router.post('/createhotel', createHotel); 

module.exports=router;