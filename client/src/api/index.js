import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

export const insertClone = payload => api.post(`/clone`, payload)
export const getAllClones = () => api.get(`/clones`)
export const updateCloneById = (_id, payload) => api.put(`/clone/${_id}`, payload)
export const updateCloneLikesById = (_id, payload) => api.put(`/clone/likes/${_id}`, payload)
export const updateCloneViewsById = (_id, payload) => api.put(`/clone/views/${_id}`, payload)
export const deleteCloneById = _id => api.delete(`/clone/${_id}`)
export const getCloneById = _id => api.get(`/clone/${_id}`)
// new
export const getClonesByUserId = user_id => api.get(`/clones/user_id/${user_id}`)

export const getAllUsers = () => api.get(`/users`)
export const updateUserById = (_id, payload) => api.put(`/user/${_id}`, payload)
export const updateUserAddLikeById = (_id, clone_id) => api.put(`/user/${_id}/addlike/${clone_id}`)
export const updateUserAddViewById = (_id, clone_id) => api.put(`/user/${_id}/addview/${clone_id}`)
export const updateUserRemoveLikeById = (clone_id) => api.put(`/users/removelike/${clone_id}`)
export const updateUserRemoveViewById = (clone_id) => api.put(`/users/removeview/${clone_id}`)
export const getUserById = _id => api.get(`/user/${_id}`)

export const upload = (user_id, formData) => api.post(`/upload/${user_id}`, formData)

const apis = {
    insertClone,
    getAllClones,
    updateCloneById,
    updateCloneLikesById,
    updateCloneViewsById,
    deleteCloneById,
    getCloneById,
    getClonesByUserId,

    getAllUsers,
    updateUserById,
    updateUserAddLikeById,
    updateUserAddViewById,
    updateUserRemoveLikeById,
    updateUserRemoveViewById,
    getUserById,

    upload,
}

export default apis
