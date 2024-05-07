const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  content: { type: String, required: true },
  // Other fields as needed...
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
