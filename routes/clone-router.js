const express = require('express')

const CloneCtrl = require('../controllers/clone-ctrl')

const cloneRouter = express.Router()

cloneRouter.post('/clone', CloneCtrl.createClone)
cloneRouter.put('/clone/:_id', CloneCtrl.updateClone)
cloneRouter.put('/clone/likes/:_id', CloneCtrl.updateCloneLikes)
cloneRouter.put('/clone/views/:_id', CloneCtrl.updateCloneViews)
cloneRouter.delete('/clone/:_id', CloneCtrl.deleteClone)
cloneRouter.get('/clone/:_id', CloneCtrl.getCloneById)
cloneRouter.get('/clones', CloneCtrl.getClones)
// new
cloneRouter.get('/clones/user_id/:user_id', CloneCtrl.getClonesByUserId)

module.exports = cloneRouter
