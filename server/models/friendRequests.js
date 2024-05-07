const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
  senderUsername: { type: String, required: true },
  receiverUsername: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  // Other fields as needed...
});


const FriendRequestModel = mongoose.model('FriendRequest', FriendRequestSchema);

module.exports = FriendRequestModel;
