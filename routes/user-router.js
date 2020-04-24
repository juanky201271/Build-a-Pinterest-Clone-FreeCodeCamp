const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')

const userRouter = express.Router()

userRouter.put('/user/:_id', UserCtrl.updateUserById)
userRouter.put('/user/:_id/addlike/:clone_id', UserCtrl.updateUserAddLikeById)
userRouter.put('/user/:_id/addview/:clone_id', UserCtrl.updateUserAddViewById)
userRouter.put('/users/removelike/:clone_id', UserCtrl.updateUserRemoveLikeById)
userRouter.put('/users/removeview/:clone_id', UserCtrl.updateUserRemoveViewById)
userRouter.get('/user/:_id', UserCtrl.getUserById)
userRouter.get('/users', UserCtrl.getUsers)

module.exports = userRouter
