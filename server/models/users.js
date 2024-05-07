const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  interests: [{ type: String }], // Added tags field
  // Other fields as needed...
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
