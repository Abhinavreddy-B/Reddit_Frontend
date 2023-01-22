import { Button, Collapse, Divider, FormControl, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import { Box } from '@mui/system';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import ServerMethods from '../../utils/Communicate';
// import { StarBorder } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const PostItem = ({ post, setData, data }) => {

    const [open, setOpen] = useState(false)
    const [CommentBox, setCommentBox] = useState(false)

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

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={post.Text}
                    sx={{ width: '100%' }}
                />
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
                <ListItemButton onClick={() => setCommentBox(!CommentBox)}>
                    <AddCommentOutlinedIcon />
                </ListItemButton>
            </ListItem>
            {
                CommentBox ?
                    <>
                        <FormControl sx={{ m: 2, ml: 5, width: { md: '50ch', xs: '25ch' } }} variant="standard">
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
                    :
                    <>

                        <Box sx={{ pl: '5%', fontWeight: 'bold', fontSize: '22' }} onClick={() => setOpen(!open)}>
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
                        </Collapse>
                    </>
            }
            <Divider />
        </>
    );
};

export default PostItem;