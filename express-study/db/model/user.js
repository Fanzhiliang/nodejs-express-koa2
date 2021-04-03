const mongoose = require('../db')

const UserSchema = mongoose.Schema({
  username: String,
  phone: Number,
  hobby: Array,
  status: { type: Number, default: 1 }
})

const User = mongoose.model('User', UserSchema, 'user')

module.exports = User
