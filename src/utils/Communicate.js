import axios from "axios"

let token = window.localStorage.getItem('Greddit:token') || null

const resetToken = () => {
    token = null
    return
}

const setToken = (user) => {
    if (user === null) {
        token = null
        return
    }
    token = `Bearer ${user.token}`
}

const signIn = async (credentials, type) => {
    const res = await axios.post(`/api/users/login`, credentials)
    return res.data
}

const signUp = async (credentials, type) => {
    const res = await axios.post(`/api/users/signup`, credentials)
    return res.data
}

const GetUserData = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.get(`/api/users/`, config)
    return res.data
}

const UpdateUserData = async (newData) => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.put(`/api/users/`, newData, config)
    return res.data
}

const getFollowers = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.get(`/api/users/followers`, config)
    return res.data
}

const getFollowing = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.get(`/api/users/following`, config)
    return res.data
}

const DeleteFollower = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const data = {
        FollowerId: id
    }
    const res = await axios.post(`/api/users/followers/remove`, data, config)
    return res
}

const DeleteFollowing = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const data = {
        FollowingId: id
    }
    const res = await axios.post(`/api/users/following/remove`, data, config)
    return res
}

const AddSubGreddit = async (data) => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.post(`/api/subgreddit`, data, config)
    return res.data
}

const GetSubGreddits = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.get(`/api/subgreddit`, config)
    return res.data
}

const DeleteSubGreddit = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.delete(`/api/subgreddit/${id}`, config)
    return res
}

const GetAllSubGreddits = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const res = await axios.get(`/api/subgreddit/all`, config)
    return res.data
}

const ServerMethods = {
    resetToken, setToken, signIn, signUp, GetUserData, UpdateUserData, getFollowers, getFollowing, DeleteFollower, DeleteFollowing,
    AddSubGreddit, GetSubGreddits, DeleteSubGreddit, GetAllSubGreddits
}

export default ServerMethods