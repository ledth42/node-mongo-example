const mongoose = require('mongoose');
const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 10,
    trim: true,
    unique: true
  },
  location: {
    type: String
  },
  age: {
    type: Number
  }
});
