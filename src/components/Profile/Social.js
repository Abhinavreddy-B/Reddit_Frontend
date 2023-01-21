import { Button, Card, CardActions, CardContent, CircularProgress, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import NotifyContext from '../../contexts/NotifyContext';
import ServerMethods from '../../utils/Communicate';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '80%', md: 500 },
    maxHeight: '60%',
    margin: 0,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

    borderRadius: 2,
    display: 'block',
    overflowY: "scroll"
};

const FollowerModal = ({ open, setOpen, setUserData, userData }) => {
    const [data, setData] = useState()
    const { Notify } = useContext(NotifyContext)
    const [pinging, setPinging] = useState(false)

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
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
                                            <ListItemText primary={f.firstName + ' ' + f.lastName} />
                                            <ListItemButton>
                                                <Button variant="outlined" onClick={() => RemoveFollower(f.id)}>Remove</Button>
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
        </Modal>
    )
}

const FollowingModal = ({ open, setOpen, userData, setUserData }) => {
    const [data, setData] = useState()
    const [pinging, setPinging] = useState(false)
    const { Notify } = useContext(NotifyContext)

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
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
                                            <ListItemButton>
                                                <Button variant="outlined" onClick={() => RemoveFollowing(f.id)}>Unfollow</Button>
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
        </Modal>
    )
}

const Social = ({ userData, setUserData }) => {

    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false)

    return (
        <>
            <FollowerModal open={open1} setOpen={setOpen1} setUserData={setUserData} userData={userData} />
            <Card
                sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Followers
                    </Typography>
                    <Typography>
                        {userData.FollowerCount}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => { setOpen1(true) }}>View</Button>
                </CardActions>
            </Card>
            <Card
                sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}
            >
                <FollowingModal open={open2} setOpen={setOpen2} setUserData={setUserData} userData={userData} />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Following
                    </Typography>
                    <Typography>
                        {userData.FollowingCount}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => { setOpen2(true) }}>View</Button>
                </CardActions>
            </Card>
        </>
    )
}


export default Social;