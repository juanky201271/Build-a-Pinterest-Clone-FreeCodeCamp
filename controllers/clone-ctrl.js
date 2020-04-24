const Clone = require('../models/clone-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createClone = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a clone', })
  }
  const clone = new Clone(body)
  if (!clone) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json clone', })
  }
  // body with title, author and userid
  await clone
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        _id: clone._id,
        message: 'Clone created!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updateClone = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a clone', })
  }
  await Clone
    .findOne({ _id: ObjectId(req.params._id) }, (err, clone) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!clone) {
        return res.status(404).json({ success: false, error: 'Clone not found', })
      }
      clone.title = body.title
      clone.text = body.text
      clone.url = body.url
      clone.file = body.file
      clone.likes = body.likes
      clone.views = body.views
      //await
      clone
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: clone._id,
            message: 'Clone updated!',
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

updateCloneLikes = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a clone', })
  }
  await Clone
    .findOne({ _id: ObjectId(req.params._id) }, (err, clone) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!clone) {
        return res.status(404).json({ success: false, error: 'Clone not found', })
      }
      clone.likes = body.likes
      //await
      clone
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: clone._id,
            message: 'Clone likes updated!',
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

updateCloneViews = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a clone', })
  }
  await Clone
    .findOne({ _id: ObjectId(req.params._id) }, (err, clone) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!clone) {
        return res.status(404).json({ success: false, error: 'Clone not found', })
      }
      clone.views = body.views
      //await
      clone
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: clone._id,
            message: 'Clone views updated!',
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

deleteClone = async (req, res) => {
  await Clone
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!clone) {
      //  return res.status(404).json({ success: false, error: 'Clone not found', })
      //}
      return res.status(200).json({ success: true, }) // data: clone})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getCloneById = async (req, res) => {
  await Clone
    .findOne({ _id: ObjectId(req.params._id) })
    .populate('user_id')
    .exec((err, clone) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!clone) {
        return res.status(404).json({ success: false, error: 'Clone not found', })
      }
      return res.status(200).json({ success: true, data: clone})
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

getClones = async (req, res) => {
  await Clone
    .find({})
    .populate('user_id')
    .exec((err, clones) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!clones.length) {
        return res.status(404).json({ success: false, error: 'Clones not found', })
      }
      return res.status(200).json({ success: true, data: clones})
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

getClonesByUserId = async (req, res) => {
  await Clone
    .find({ user_id: ObjectId(req.params.user_id) })
    .populate('user_id')
    .exec((err, clone) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!clone) {
        return res.status(404).json({ success: false, error: 'Clone not found', })
      }
      return res.status(200).json({ success: true, data: clone})
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

module.exports = {
  createClone,
  updateClone,
  updateCloneLikes,
  updateCloneViews,
  deleteClone,
  getCloneById,
  getClones,
  getClonesByUserId,
}
