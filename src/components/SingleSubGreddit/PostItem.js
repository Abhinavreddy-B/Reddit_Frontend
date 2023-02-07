import { Accordion, AccordionDetails, AccordionSummary, Avatar, Button, CircularProgress, Collapse, Container, Dialog, Divider, FormControl, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemText, Paper, Slide, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import { Box } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';
import ServerMethods from '../../utils/Communicate';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import NotifyContext from '../../contexts/NotifyContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReportIcon from '@mui/icons-material/Report';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const ReportForm = ({ setReportBox, PostId }) => {

    const [inv1, setInv1] = useState(true)
    const [touched, setTouched] = useState({
        1: false
    })
    const [pinging, setPinging] = useState(false)
    const [concern,setConcern] = useState()

    const {Notify} = useContext(NotifyContext)

    const HandleSubmit = async (event) => {
        console.log(document.getElementById('Report-Form'))
        event.preventDefault();
        setPinging(true)
        console.log(document.querySelectorAll('#Report-Form'))
        const val = document.getElementById('Report-Form').value;
        // document.getElementById('Report-Form').value = null
        try{
            console.log(val)
            await ServerMethods.PostReport(val,PostId)
            Notify({
                type: 'success',
                message: 'Reported Succesfully'
            })
            setPinging(false)
            setReportBox(false)
        }catch(e){
            Notify({
                type: 'error',
                message: e.response.data.error
            })
            setPinging(false)
            setReportBox(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <ReportIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Report Post
                </Typography>
                <Box component="form" sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Your Concern...."
                        name="Text"
                        id='Report-Form'
                        error={touched[1] && inv1}
                        inputProps={{
                            onChange: (event) => {
                                if (!event.target.value || event.target.value === null || event.target.value === '') {
                                    setConcern(event.target.value)
                                    setInv1(true)
                                } else {
                                    setInv1(false)
                                }
                            },
                            onBlur: () => {
                                setTouched({ ...touched, 1: true })
                            }
                        }}

                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={inv1 === true || pinging === true}
                        onClick={HandleSubmit}
                    >
                        {
                            pinging === true ?
                                <CircularProgress /> :
                                "Create"
                        }
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => setReportBox(false)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

const PostItem = ({ post, setData, data }) => {

    const [CommentBox, setCommentBox] = useState(false)
    const [ReportBox, setReportBox] = useState(false)

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
    return (
        <>
            <Dialog open={ReportBox} TransitionComponent={Transition}>
                <ReportForm setReportBox={setReportBox} PostId={post.id}/>
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
                                <ThumbUpOutlinedIcon color='success' />
                                {post.Upvotes}
                            </Box>
                        </ListItemButton>
                        <ListItemButton onClick={Downvote}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                <ThumbDownOutlinedIcon color='error' />
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
                            <ListItemButton >
                                <ReportIcon color='error' onClick={() => setReportBox(true)} />
                            </ListItemButton>
                        </Box>
                    </Box>
                </ListItem>

                <Collapse in={CommentBox}>
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
                </Collapse>
                <>
                    <Accordion sx={{ width: { lg: '60%', md: '80%', xs: '95%' }, md: 2, pl: 5 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography sx={{ fontWeight: 'bold' }}>Comments ({post.Comments.length})</Typography>
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
            </Paper>
        </>
    );
};

export default PostItem;