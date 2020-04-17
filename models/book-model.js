const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Books = new Schema({
  //key - _id
  title: {type: 'String', required: true},
  author: {type: 'String', rquired: true},
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'BTC-users'
  },
})
module.exports = mongoose.model('BTC-books', Books)
