const mongoose= require ("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkIn: { type: Date, required: true },
  days: { type: Number, required: true },
  people: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);