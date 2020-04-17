const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')

const userRouter = express.Router()

userRouter.put('/user/:_id', UserCtrl.updateUserById)
userRouter.get('/user/:_id', UserCtrl.getUserById)
userRouter.get('/users', UserCtrl.getUsers)

module.exports = userRouter
