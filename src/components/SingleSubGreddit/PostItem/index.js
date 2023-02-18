import { Accordion, AccordionDetails, AccordionSummary, Collapse, Dialog, FormControl, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemText, Paper, Slide, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import { Box } from '@mui/system';
import { ExpandMore, ThumbDown, ThumbUp } from '@mui/icons-material';
import ServerMethods from '../../../utils/Communicate';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import NotifyContext from '../../../contexts/NotifyContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReportIcon from '@mui/icons-material/Report';
import ReportForm from './ReportForm';
import CommentItem from './CommentItem';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const PostItem = ({ post, setData, data }) => {

    const [CommentBox, setCommentBox] = useState(false)
    const [ReportBox, setReportBox] = useState(false)

    const { Notify } = useContext(NotifyContext)

    const Upvote = async () => {
        try {
            await ServerMethods.PostUpvote(post.id)
            if (post.Downvoted === false) {
                setData({ ...data, Posts: data.Posts.map(f => f.id !== post.id ? f : { ...post, Upvotes: post.Upvotes + (post.Upvoted ? -1 : 1), Upvoted: !post.Upvoted }) })
            } else {
                setData({ ...data, Posts: data.Posts.map(f => f.id !== post.id ? f : { ...post, Upvotes: post.Upvotes + 1, Upvoted: true, Downvotes: post.Downvotes - 1, Downvoted: false }) })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const Downvote = async () => {
        try {
            await ServerMethods.PostDownvote(post.id)
            if (post.Upvoted === false) {
                setData({ ...data, Posts: data.Posts.map(f => f.id !== post.id ? f : { ...post, Downvotes: post.Downvotes + (post.Downvoted ? -1 : 1), Downvoted: !post.Downvoted }) })
            } else {
                setData({ ...data, Posts: data.Posts.map(f => f.id !== post.id ? f : { ...post, Upvotes: post.Upvotes - 1, Upvoted: false, Downvotes: post.Downvotes + 1, Downvoted: true }) })

            }
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
    return (
        <>
            <Dialog open={ReportBox} TransitionComponent={Transition}>
                <ReportForm setReportBox={setReportBox} PostId={post.id} />
            </Dialog>
            <Paper elevation={5} sx={{ m: 1, p: 1 }}>
                <ListItem>
                    <ListItemText
                        primary={`${filtered}   (Posted By ${post.PostedBy.Name})`}
                        sx={{ width: '100%' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                        <ListItemButton onClick={Upvote}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                {
                                    post.Upvoted === true ?
                                        <ThumbUp color='success' /> :
                                        <ThumbUpOutlinedIcon color='success' />
                                }
                                {post.Upvotes}
                            </Box>
                        </ListItemButton>
                        <ListItemButton onClick={Downvote}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                {
                                    post.Downvoted === true ?
                                        <ThumbDown color='error' /> :
                                        <ThumbDownOutlinedIcon color='error' />
                                }
                                <div>{post.Downvotes}</div>
                            </Box>
                        </ListItemButton>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <ListItemButton onClick={() => Save()}>
                                <BookmarkAddIcon color='primary' />
                            </ListItemButton>
                            <ListItemButton onClick={() => FollowOwner()}>
                                <PersonAddIcon color='secondary' />
                            </ListItemButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <ListItemButton onClick={() => setCommentBox(!CommentBox)}>
                                <AddCommentOutlinedIcon color='info' />
                            </ListItemButton>
                            <ListItemButton onClick={() => setReportBox(true)}>
                                <ReportIcon color='error' />
                            </ListItemButton>
                        </Box>
                    </Box>
                </ListItem>

                <Collapse in={CommentBox}>
                    <FormControl sx={{ m: 2, ml: 5, width: { md: '50ch', xs: '80%' } }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">New Comment</InputLabel>
                        {CommentBox &&
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
                        }
                    </FormControl>
                </Collapse>
                <>
                    <Accordion sx={{ width: '95%', md: 2, pl: 5, border: 0, borderLeft: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography sx={{ fontWeight: 'bold' }}>Comments ({post.Comments.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ pl: 3, border: 0, borderLeft: 1 }}>
                                {
                                    post.Comments.map(c => <CommentItem key={c.id} comment={c} />)
                                }
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </>
            </Paper>
        </>
    );
};

export default PostItem;