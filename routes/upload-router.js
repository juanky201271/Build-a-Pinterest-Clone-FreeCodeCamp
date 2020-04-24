const express = require('express')

const UploadCtrl = require('../controllers/upload-ctrl')

const uploadRouter = express.Router()

uploadRouter.post('/upload/:user_id', UploadCtrl.upload)

module.exports = uploadRouter
