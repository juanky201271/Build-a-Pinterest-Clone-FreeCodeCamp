import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

export const insertBook = payload => api.post(`/book`, payload)
export const getAllBooks = () => api.get(`/books`)
export const updateBookById = (_id, payload) => api.put(`/book/${_id}`, payload)
export const deleteBookById = _id => api.delete(`/book/${_id}`)
export const getBookById = _id => api.get(`/book/${_id}`)
// new
export const getBooksByUserId = user_id => api.get(`/books/user_id/${user_id}`)

export const insertRequest = payload => api.post(`/request`, payload)
export const getAllRequests = () => api.get(`/requests`)
export const updateRequestById = (_id, payload) => api.put(`/request/${_id}`, payload)
export const deleteRequestById = _id => api.delete(`/request/${_id}`)
export const getRequestById = _id => api.get(`/request/${_id}`)
// new
export const getRequestsByUserId = user_id => api.get(`/requests/user_id/${user_id}`)
export const getRequestsByGiveBookId = give_book_id => api.get(`/requests/givebookid/${give_book_id}`)
export const getRequestsByTakeBookId = take_book_id => api.get(`/requests/takebookid/${take_book_id}`)
export const getRequestsByTakeOk = take_ok => api.get(`/requests/takeok/${take_ok}`)
export const deleteRequestsByGiveBookId = give_book_id => api.delete(`/requests/givebookid/${give_book_id}`)
export const deleteRequestsByTakeBookId = take_book_id => api.delete(`/requests/takebookid/${take_book_id}`)

export const getAllUsers = () => api.get(`/users`)
export const updateUserById = (_id, payload) => api.put(`/user/${_id}`, payload)
export const getUserById = _id => api.get(`/user/${_id}`)

const apis = {
    insertBook,
    getAllBooks,
    updateBookById,
    deleteBookById,
    getBookById,
    getBooksByUserId,

    insertRequest,
    getAllRequests,
    updateRequestById,
    deleteRequestById,
    getRequestById,
    getRequestsByUserId,
    getRequestsByGiveBookId,
    getRequestsByTakeBookId,
    getRequestsByTakeOk,
    deleteRequestsByGiveBookId,
    deleteRequestsByTakeBookId,

    getAllUsers,
    updateUserById,
    getUserById,
}

export default apis
