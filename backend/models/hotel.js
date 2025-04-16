const mongoose= require ("mongoose");

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  amenities: [String],
  rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', HotelSchema);