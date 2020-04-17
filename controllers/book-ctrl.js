const Book = require('../models/book-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createBook = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a book', })
  }
  const book = new Book(body)
  if (!book) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json book', })
  }
  // body with title, author and userid
  await book
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        _id: book._id,
        message: 'Book created!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updateBook = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a book', })
  }
  await Book
    .findOne({ _id: ObjectId(req.params._id) }, (err, book) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found', })
      }
      book.title = body.title
      book.author = body.author
      //await
      book
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: book._id,
            message: 'Book updated!',
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

deleteBook = async (req, res) => {
  await Book
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!book) {
      //  return res.status(404).json({ success: false, error: 'Book not found', })
      //}
      return res.status(200).json({ success: true, }) // data: book})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getBookById = async (req, res) => {
  await Book
    .findOne({ _id: ObjectId(req.params._id) })
    .populate('user_id')
    .exec((err, book) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found', })
      }
      return res.status(200).json({ success: true, data: book})
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

getBooks = async (req, res) => {
  await Book
    .find({})
    .populate('user_id')
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!books.length) {
        return res.status(404).json({ success: false, error: 'Books not found', })
      }
      return res.status(200).json({ success: true, data: books})
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

getBooksByUserId = async (req, res) => {
  await Book
    .find({ user_id: ObjectId(req.params.user_id) })
    .populate('user_id')
    .exec((err, book) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found', })
      }
      return res.status(200).json({ success: true, data: book})
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getBooks,
  getBooksByUserId,
}
