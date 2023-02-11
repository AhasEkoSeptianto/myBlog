import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var tags = new Schema({
  tag: {
    type: String,
    required: true
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
});

mongoose.models = {};

var Tags = mongoose.model('tags', tags);

export default Tags;