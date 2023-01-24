import { Accordion, AccordionDetails, AccordionSummary, Divider, FormControl, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import { Box } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';
import ServerMethods from '../../utils/Communicate';
// import { StarBorder } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import NotifyContext from '../../contexts/NotifyContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const PostItem = ({ post, setData, data }) => {

    const [CommentBox, setCommentBox] = useState(false)

    const { Notify } = useContext(NotifyContext)

    const Upvote = async () => {
        try {
            await ServerMethods.PostUpvote(post.id)
            setData({ ...data, Posts: data.Posts.map(f => f.id !== post.id ? f : { ...post, Upvotes: post.Upvotes + 1 }) })
        } catch (e) {
            console.log(e)
        }
    }

    const Downvote = async () => {
        try {
            await ServerMethods.PostDownvote(post.id)
            setData({ ...data, Posts: data.Posts.map(f => f.id !== post.id ? f : { ...post, Downvotes: post.Downvotes + 1 }) })
        } catch (e) {
            console.log(e)
        }
    }

    const Save = async () => {
        try {
            await ServerMethods.SavePost(post.id)
            Notify({
                type: 'success',
                message: 'Saved Succesfully'
            })
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: 'Couldnt Save Post'
            })
        }
    }

    const FollowOwner = async () => {
        try {
            await ServerMethods.FollowPostOwner(post.id)
            Notify({
                type: 'success',
                message: `Following ${post.PostedBy.Name}`
            })
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `${e.response.data.error}`
            })
        }
    }

    const HandleAddComment = async () => {

        const val = document.getElementById('New-Comment').value
        document.getElementById('New-Comment').value = null
        setCommentBox(false)

        try {
            const newCom = await ServerMethods.PostComment(post.id, val)
            setData({ ...data, Posts: data.Posts.map(f => f.id !== post.id ? f : { ...post, Comments: [...post.Comments, newCom] }) })
        } catch (e) {
            console.log(e)
        }
    }

    let filtered = post.Text

    // console.log(post.Text)
    // data.Banned.forEach(word => {
    //     let regex = new RegExp(`\\b${word}\\b`,"gi")
    //     filtered = filtered.replace(regex,(x) => {return '*'.repeat(x.length)})
    //     // filtered = filtered.replace(regex,"******")
    // })

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={`${filtered}   (Posted By ${post.PostedBy.Name})`}
                    sx={{ width: '100%' }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                    <ListItemButton onClick={Upvote}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <ThumbUpOutlinedIcon />
                            {post.Upvotes}
                        </Box>
                    </ListItemButton>
                    <ListItemButton onClick={Downvote}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <ThumbDownOutlinedIcon />
                            <div>{post.Downvotes}</div>
                        </Box>
                    </ListItemButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                    <ListItemButton onClick={() => Save()}>
                        <BookmarkAddIcon />
                    </ListItemButton>
                    <ListItemButton onClick={() => FollowOwner()}>
                        <PersonAddIcon />
                    </ListItemButton>
                    <ListItemButton onClick={() => setCommentBox(!CommentBox)}>
                        <AddCommentOutlinedIcon />
                    </ListItemButton>
                </Box>
            </ListItem>
            {
                CommentBox &&
                <>
                    <FormControl sx={{ m: 2, ml: 5, width: { md: '50ch', xs: '80%' } }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">New Comment</InputLabel>
                        <Input
                            id="New-Comment"
                            endAdornment={
                                <>
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            // onClick={handleClickShowPassword}
                                            onClick={HandleAddComment}
                                        >
                                            <DoneIcon color='success' />
                                        </IconButton>
                                    </InputAdornment>
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            // onClick={handleClickShowPassword}
                                            onClick={() => setCommentBox(false)}
                                        >
                                            <CloseIcon color='error' />
                                        </IconButton>
                                    </InputAdornment>
                                </>
                            }
                        />
                    </FormControl>
                </>
            }
            <>

                {/* <Box sx={{ pl: '5%', fontWeight: 'bold', fontSize: '22' }} onClick={() => setOpen(!open)}>
                            <Typography sx={{ display: 'inline-block', fontWeight: 'bold' }} component='h1'>
                                Comments
                            </Typography>
                            <Box >
                                {open ? <ExpandLess /> : <ExpandMore />}
                            </Box>
                        </Box>
                        <Collapse in={open}>
                            <List component="div" sx={{ pl: '10%' }}>
                                {
                                    post.Comments.map(c => <><Divider light /><ListItemText primary={c} /></>)
                                }
                            </List>
                        </Collapse> */}
                <Accordion sx={{ width: {lg: '60%',md: '80%',xs: '95%'}, md: 2,pl: 5 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography sx={{fontWeight: 'bold'}}>Comments ({post.Comments.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List component="div" sx={{ pl: '10%' }}>
                            {
                                post.Comments.map(c => <><Divider light /><ListItemText primary={c} /></>)
                            }
                        </List>
                    </AccordionDetails>
                </Accordion>
            </>

            <Divider />
        </>
    );
};

export default PostItem;