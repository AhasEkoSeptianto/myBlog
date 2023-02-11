import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var blog = new Schema({
  title: {
    type: String,
    required: true
  },
  Content: {
    type: String,
    required: true
  },
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

var Blog = mongoose.model('blog', blog);

export default Blog;