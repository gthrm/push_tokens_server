import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  secondName: {type: String},
  email: {type: String},
  tel: {type: String},
  org: {type: String},
  createdAt: {type: Date},
});

const ItemSchema = new Schema({
  identifier: {type: String, required: true},
  token: {type: String, required: true},
  description: {type: String},
  deleted: {type: Boolean, default: false},
  createdAt: {type: Date, default: new Date()},
});

mongoose.model('User', UserSchema);
mongoose.model('Item', ItemSchema);
