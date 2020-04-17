const User = require('../models/user-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

updateUserById = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a user ', })
  }
  await User
    .findOne({ _id: ObjectId(req.params._id) }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      user.fullName = body.fullName
      user.city = body.city
      user.state = body.state
      user.address = body.address
      //await
      user
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: user._id,
            message: 'User updated!',
          })
        })
        .catch(err => {
          return res.status(400).json({ success: false, error: err, })
        })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getUserById = async (req, res) => {
  await User
    .findOne({ _id: ObjectId(req.params._id) }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      return res.status(200).json({ success: true, data: user })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getUsers = async (req, res) => {
  await User
    .find({}, (err, users) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!users.length) {
        return res.status(404).json({ success: false, error: 'Users not found', })
      }
      return res.status(200).json({ success: true, data: users})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

module.exports = {
  updateUserById,
  getUserById,
  getUsers,
}
