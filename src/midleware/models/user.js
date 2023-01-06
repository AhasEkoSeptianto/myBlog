import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var user = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_picture: {
    type: String,
    required: true
  }
});

mongoose.models = {};

var User = mongoose.model('users', user);

export default User;