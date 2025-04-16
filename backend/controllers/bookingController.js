const Booking =require("../models/booking")

const createBooking = async (req, res) => {
    try {
        const { userId, hotelId, checkIn, days, people, totalPrice } = req.body;
    
        if (!userId || !hotelId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        const newBooking = new Booking({
          userId,
          hotelId,
          checkIn,
          days,
          people,
          totalPrice
        });
    
        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
};


const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.body.userId }).populate('hotelId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports={
    getUserBookings,
    createBooking,


}