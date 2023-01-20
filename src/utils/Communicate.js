import axios from "axios"

const baseUrl = ''

let token = null

const resetToken = () => {
    token = null
    return 
}

const setToken = (user) => {
    console.log(user)
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

const GetUserData = async (id) => {
    const config = {
        headers: {Authorization: token}
    }
    const res = await axios.get(`/api/users/${id}`,config)
    return res.data
}
const ServerMethods = {resetToken,setToken,  signIn , signUp , GetUserData}

export default ServerMethods