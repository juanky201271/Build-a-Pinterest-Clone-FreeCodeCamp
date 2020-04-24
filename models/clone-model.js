const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Clones = new Schema({
  //key - _id
  title: {type: 'String', required: true},
  text: {type: 'String', rquired: true},
  url: {type: 'String'},
  file: {type: 'String'},
  likes: {type: 'Number', required: true},
  views: {type: 'Number', required: true},
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'bpc-users'
  },
})
module.exports = mongoose.model('bpc-clones', Clones)
