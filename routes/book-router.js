const express = require('express')

const BookCtrl = require('../controllers/book-ctrl')

const bookRouter = express.Router()

bookRouter.post('/book', BookCtrl.createBook)
bookRouter.put('/book/:_id', BookCtrl.updateBook)
bookRouter.delete('/book/:_id', BookCtrl.deleteBook)
bookRouter.get('/book/:_id', BookCtrl.getBookById)
bookRouter.get('/books', BookCtrl.getBooks)
// new
bookRouter.get('/books/user_id/:user_id', BookCtrl.getBooksByUserId)

module.exports = bookRouter
