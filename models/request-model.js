const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Requests = new Schema({
  //key - _id
  give_book_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'BTC-books'
  },
  take_book_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'BTC-books'
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'BTC-users'
  },
  take_ok: { type: 'Boolean', required: true },
})
module.exports = mongoose.model('BTC-requests', Requests)
