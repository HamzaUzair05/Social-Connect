const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { type: String, required: true }, // Changed to username
  content: { type: String, required: true },
  tags: [{ type: String }], // Added tags field
  privacy: { type: String, enum: ['public', 'friends'], default: 'public' }, // Added privacy field with default value 'public'
  image: { type: String }, // Store the URL of the image
  likes: [{ username: { type: String }, count: { type: Number, default: 0 } }], // Added likes field
  comments: [{ username: { type: String }, content: { type: String } }], // Added comments field
  sharedBy: { type: String } // Added sharedBy field
}, { timestamps: true });

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
