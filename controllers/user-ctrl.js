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

updateUserAddLikeById = async (req, res) => {
  await User
    .findOne({ _id: ObjectId(req.params._id) }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      user.likes = user.likes.concat(req.params.clone_id)
      //await
      user
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: user._id,
            message: 'User likes updated!',
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

updateUserAddViewById = async (req, res) => {
  await User
    .findOne({ _id: ObjectId(req.params._id) }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      user.views = user.views.concat(req.params.clone_id)
      //await
      user
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: user._id,
            message: 'User views updated!',
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

updateUserRemoveLikeById = async (req, res) => {
  await User
    .find({}, (err, users) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!users) {
        return res.status(404).json({ success: false, error: 'Users not found', })
      }
      users.forEach((user, index) => {
        user.likes = user.likes.filter((item, index) => item !== req.params.clone_id)
      //await
        user
          .save()
          .catch(err => {
            return res.status(400).json({ success: false, error: err, })
          })
      })
      return res.status(201).json({
        success: true,
        message: 'Users likes updated!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updateUserRemoveViewById = async (req, res) => {
  await User
    .find({}, (err, users) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!users) {
        return res.status(404).json({ success: false, error: 'Users not found', })
      }
      users.forEach((user, index) => {
        user.views = user.views.filter((item, index) => item !== req.params.clone_id)
      //await
        user
          .save()
          .catch(err => {
            return res.status(400).json({ success: false, error: err, })
          })
      })
      return res.status(201).json({
        success: true,
        message: 'Users views updated!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getUserById = async (req, res) => {
  await User
    .findOne({ _id: ObjectId(req.params._id) })
    .populate('likes')
    .populate("views")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      return res.status(200).json({ success: true, data: user, })
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

getUsers = async (req, res) => {
  await User
    .find({})
    .populate('likes')
    .populate("views")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      return res.status(200).json({ success: true, data: user, })
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

module.exports = {
  updateUserById,
  updateUserAddLikeById,
  updateUserAddViewById,
  updateUserRemoveLikeById,
  updateUserRemoveViewById,
  getUserById,
  getUsers,
}
