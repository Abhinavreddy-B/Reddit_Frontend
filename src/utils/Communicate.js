import axios from "axios"

const BaseUrl = process.env.NODE_ENV==='development' ? 'http://localhost:5000' : 'https://reddit-odhk.onrender.com'

let token = window.localStorage.getItem('Greddit:token') || null

const resetToken = () => {
    token = null
    return
}

const config = () => {
    return {
        headers: { Authorization: token }
    }
}

const setToken = (user) => {
    if (user === null) {
        token = null
        return
    }
    token = `Bearer ${user.token}`
}

const signIn = async (credentials, type) => {
    const res = await axios.post(`${BaseUrl}/api/users/login`, credentials)
    return res.data
}

const signUp = async (credentials, type) => {
    const res = await axios.post(`${BaseUrl}/api/users/signup`, credentials)
    return res.data
}

const GetUserData = async () => {
    const res = await axios.get(`${BaseUrl}/api/users/`, config())
    return res.data
}

const UpdateUserData = async (newData) => {
    const res = await axios.put(`${BaseUrl}/api/users/`, newData, config())
    return res.data
}

const getFollowers = async () => {
    const res = await axios.get(`${BaseUrl}/api/users/followers`, config())
    return res.data
}

const getFollowing = async () => {
    const res = await axios.get(`${BaseUrl}/api/users/following`, config())
    return res.data
}

const DeleteFollower = async (id) => {
    const data = {
        FollowerId: id
    }
    const res = await axios.post(`${BaseUrl}/api/users/followers/remove`, data, config())
    return res
}

const DeleteFollowing = async (id) => {
    const data = {
        FollowingId: id
    }
    const res = await axios.post(`${BaseUrl}/api/users/following/remove`, data, config())
    return res
}

const AddSubGreddit = async (data) => {
    const res = await axios.post(`${BaseUrl}/api/subgreddit`, data, config())
    return res.data
}

const GetOwnedSubGreddits = async () => {
    const res = await axios.get(`${BaseUrl}/api/subgreddit`, config())
    return res.data
}

const DeleteSubGreddit = async (id) => {
    const res = await axios.delete(`${BaseUrl}/api/subgreddit/${id}`, config())
    return res
}

const GetAllSubGreddits = async () => {
    const res = await axios.get(`${BaseUrl}/api/subgreddit/all`, config())
    return res.data
}

const GetJoinedSubGreddits = async () => {
    const res = await axios.get(`${BaseUrl}/api/users/subgreddits`, config())
    return res.data
}

const LeaveSubGreddit = async (id) => {
    const res = await axios.delete(`${BaseUrl}/api/subgreddit/leave/${id}`, config())
    return res
}

const GetSingleSubGredditPage = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/subgreddit/${id}`, config())
    return res.data
}

const PostUpvote = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/post/${id}/upvote`, config())
    return res
}

const PostDownvote = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/post/${id}/downvote`, config())
    return res
}

const PostComment = async (id, comment) => {
    const data = {
        comment
    }
    const res = await axios.post(`${BaseUrl}/api/post/comment/${id}`, data, config())
    return res.data
}

const AddPost = async (id, Text) => {
    const data = {
        Text
    }
    const res = await axios.post(`${BaseUrl}/api/post/${id}`, data, config())
    return res.data
}

const SavePost = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/post/${id}/save`, config())
    return res
}

const FollowPostOwner = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/post/${id}/followowner`, config())
    return res
}

const SendJoinRequest = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/subgreddit/${id}/join`, config())
    return res.data
}

const GetJoinRequests = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/subgreddit/${id}/requests`, config())
    return res.data
}

const AcceptJoinRequests = async (SubGredditId, userId) => {
    const data = {
        SubGredditId,
        userId
    }

    const res = await axios.post(`${BaseUrl}/api/subgreddit/accept`, data, config())
    return res.data
}

const RejectJoinRequests = async (SubGredditId, userId) => {
    const data = {
        SubGredditId,
        userId
    }

    const res = await axios.post(`${BaseUrl}/api/subgreddit/reject`, data, config())
    return res.data
}

const GetSubGredditUsers = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/subgreddit/${id}/users`, config())
    return res.data
}

const GetSavedPosts = async () => {
    const res = await axios.get(`${BaseUrl}/api/users/savedposts`, config())
    return res.data
}

const RemoveSavedPost = async (id) => {
    const res = await axios.delete(`${BaseUrl}/api/users/savedposts/${id}`, config())
    return res
}

const GetReports = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/subgreddit/${id}/reports`, config())
    return res.data
}

const PostReport = async (Concern, PostId) => {
    const data = {
        Concern,
        PostId
    }
    const res = await axios.post(`${BaseUrl}/api/report`,data, config())
    return res.data
}

const IgnoreReport = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/report/${id}/ignore`, config())
    return res
}

const BlockReport = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/report/${id}/block`, config())
    return res
}

const DeleteReport = async (id) => {
    const res = await axios.get(`${BaseUrl}/api/report/${id}/delete`, config())
    return res
}

const ServerMethods = {
    resetToken, setToken, signIn, signUp, GetUserData, UpdateUserData, getFollowers, getFollowing, DeleteFollower, DeleteFollowing,
    AddSubGreddit, GetOwnedSubGreddits, DeleteSubGreddit, GetAllSubGreddits, GetJoinedSubGreddits, LeaveSubGreddit, GetSingleSubGredditPage,
    PostUpvote, PostDownvote, PostComment, AddPost, SavePost, FollowPostOwner, GetJoinRequests, SendJoinRequest, AcceptJoinRequests,
    RejectJoinRequests, GetSubGredditUsers, GetSavedPosts, RemoveSavedPost, GetReports, PostReport,IgnoreReport,
    BlockReport,DeleteReport
}

export default ServerMethods