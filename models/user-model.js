const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Users = new Schema({
  //key - _id
  twitterId: { type: 'String', unique: true },
  name: 'String',
  screenName: 'String',
  profileImageUrl: 'String',
  token: 'String',
  tokenSecret: 'String',
  //profile fields
  fullName: 'String',
  city: 'String',
  state: 'String',
  address: 'String',
  // counters
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'bpc-clones'
  }],
  views: [{
    type: Schema.Types.ObjectId,
    ref: 'bpc-clones'
  }],
})
module.exports = mongoose.model("bpc-users", Users)
