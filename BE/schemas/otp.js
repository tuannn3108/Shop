const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho OTP
const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  OTP: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Mã OTP sẽ hết hạn sau 600 giây (10 phút)
  }
});

// Tạo model từ schema
const OTPModel = mongoose.model('OTP', OTPSchema);

module.exports = OTPModel;
