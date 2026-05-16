const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },    
  cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema' },  
  
  totalAmount: { type: Number, required: true },
  
  // Promotion handling
  promotionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
  discountAmount: { type: Number, default: 0 },
  
  popcornDrinks: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      quantity: Number,
      price: Number
    }
  ],
  paymentMethod: { type: String, enum: ['momo', 'zalopay', 'atm', 'visa'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed', 'cancelled'], default: 'pending' },
  
  bookingCode: { type: String, required: true, unique: true }, // For humans
  ticketBarcode: { type: String, unique: true, sparse: true }, // For scanning at cinema
  
  seats: [{
    seatCode: String,           
    seatType: { type: String, enum: ['standard', 'vip', 'sweetbox'] },
    price: Number               
  }],
  
  expiresAt: Date,              
  refundStatus: { type: String, enum: ['none', 'requested', 'refunded'], default: 'none' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
