import axios from "axios"

let token = window.localStorage.getItem('Greddit:token') || null

const resetToken = () => {
    token = null
    return 
}

const setToken = (user) => {
    if(user === null){
        token = null
        return
    }
    token = `Bearer ${user.token}`
}

const signIn = async (credentials,type) => {
    const res = await axios.post(`/api/users/login`,credentials)
    return res.data
}

const signUp = async (credentials, type) => {
    const res = await axios.post(`/api/users/signup`,credentials)
    return res.data
}

const GetUserData = async () => {
    const config = {
        headers: {Authorization: token}
    }
    const res = await axios.get(`/api/users/`,config)
    return res.data
}

const UpdateUserData = async (newData) => {
    const config = {
        headers: {Authorization: token}
    }
    const res = await axios.put(`/api/users/`,newData, config)
    return res.data
}

const ServerMethods = {resetToken,setToken,  signIn , signUp , GetUserData, UpdateUserData}

export default ServerMethods