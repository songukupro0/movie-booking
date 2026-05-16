const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  avatar: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
  role: { type: String, enum: ['user', 'admin', 'staff'], default: 'user' },
  loyaltyPoints: { type: Number, default: 0 },
  membershipTier: { type: String, enum: ['Standard', 'VIP', 'VVIP'], default: 'Standard' },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  
  googleId: { type: String, select: false },
  facebookId: { type: String, select: false },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
