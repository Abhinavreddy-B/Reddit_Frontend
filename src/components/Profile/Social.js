import { Button, Card, CardActions, CardContent, CircularProgress, Dialog, Grid, ListItem, ListItemButton, ListItemText, Slide, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotifyContext from '../../contexts/NotifyContext';
import ServerMethods from '../../utils/Communicate';

const style = {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    // Height: '60%',
    margin: 0,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,

    borderRadius: 2,
    // width: '100%',
    minWidth: '33vw',
    maxWidth: '90vw'
    // display: 'block',
    // overflowY: "scroll"
};


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const FollowerModal = ({ open, setOpen, setUserData, userData }) => {
    const [data, setData] = useState()
    const { Notify } = useContext(NotifyContext)
    const [pinging, setPinging] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (open === false) {
            return
        }
        ServerMethods.getFollowers().then((response) => {
            setData(response)
        })
    }, [open])

    const RemoveFollower = async (id) => {
        try {
            setPinging(true)
            await ServerMethods.DeleteFollower(id)
            setData(data.filter(f => f.id !== id))
            setUserData({ ...userData, FollowerCount: userData.FollowerCount - 1 })
            Notify({
                type: 'success',
                message: `Removed Follower Succesfully`
            })
            setPinging(false)
        } catch (e) {
            Notify({
                type: 'error',
                message: e.response.data.error
            })
            setPinging(false)
        }
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="alert-dialog-slide-description"
            sx={{minWidth: '60%',maxWidth: '90%'}}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Followers
                </Typography>
                {
                    data && pinging === false ?
                        <Box id="modal-modal-description" sx={{ mt: 2 }}>
                            {
                                data.map(f => {
                                    return (
                                        <ListItem key={f.id}>
                                            <ListItemText primary={f.firstName + ' ' + f.lastName} sx={{flexGrow: 1}}/>
                                            <ListItemButton sx={{flexGrow: 0}}>
                                                <Button variant="outlined" onClick={() => RemoveFollower(f.id)}>Remove</Button>
                                            </ListItemButton>
                                            <ListItemButton sx={{flexGrow: 0}}>
                                                <Button variant="outlined" onClick={() => navigate(`/chat/${f.id}`)}>Chat</Button>
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })
                            }
                        </Box> :
                        <CircularProgress />
                }
                <Box>
                    <Button variant="contained" onClick={() => setOpen(false)}>Close</Button>
                </Box>
            </Box>
        </Dialog>
    )
}

const FollowingModal = ({ open, setOpen, userData, setUserData }) => {
    const [data, setData] = useState()
    const [pinging, setPinging] = useState(false)
    const { Notify } = useContext(NotifyContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (open === false) {
            return
        }
        ServerMethods.getFollowing().then((response) => {
            setData(response)
        })
    }, [open])

    const RemoveFollowing = async (id) => {
        try {
            setPinging(true)
            await ServerMethods.DeleteFollowing(id)
            setData(data.filter(f => f.id !== id))
            setUserData({ ...userData, FollowingCount: userData.FollowingCount - 1 })
            Notify({
                type: 'success',
                message: `Unfollowed Succesfully`
            })
            setPinging(false)
        } catch (e) {
            Notify({
                type: 'error',
                message: e.response.data.error
            })
            setPinging(false)
        }
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="alert-dialog-slide-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Following
                </Typography>
                {
                    data && pinging === false ?
                        <Box id="modal-modal-description" sx={{ mt: 2 }}>
                            {
                                data.map(f => {
                                    return (
                                        <ListItem key={f.id}>
                                            <ListItemText primary={f.firstName + ' ' + f.lastName} />
                                            <ListItemButton sx={{flexGrow: 0}}>
                                                <Button variant="outlined" onClick={() => RemoveFollowing(f.id)}>Unfollow</Button>
                                            </ListItemButton>
                                            <ListItemButton sx={{flexGrow: 0}}>
                                                <Button variant="outlined" onClick={() => navigate(`/chat/${f.id}`)}>Chat</Button>
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })
                            }
                        </Box> :
                        <CircularProgress />
                }
                <Box>
                    <Button variant="contained" onClick={() => setOpen(false)}>Close</Button>
                </Box>
            </Box>
        </Dialog>
    )
}

const Social = ({ userData, setUserData }) => {

    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false)

    return (
        <>
            <FollowerModal open={open1} setOpen={setOpen1} setUserData={setUserData} userData={userData} />
            <FollowingModal open={open2} setOpen={setOpen2} setUserData={setUserData} userData={userData} />
            <Grid container>
                <Grid item xs={6}>
                    <Card
                        sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                Followers
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button sx={{ fontSize: 35 }} onClick={() => { setOpen1(true) }}>{userData.FollowerCount}</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card
                        sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                Following
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button sx={{ fontSize: 35 }} onClick={() => { setOpen2(true) }}>{userData.FollowingCount}</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}


export default Social;