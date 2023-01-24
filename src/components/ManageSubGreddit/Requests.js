import { CircularProgress, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';
import ServerMethods from '../../utils/Communicate';
import CheckIcon from '@mui/icons-material/Check';
import { Clear } from '@mui/icons-material';
import { Box } from '@mui/system';
import NotifyContext from '../../contexts/NotifyContext'

const Requests = () => {
    const [Requests, setRequests] = useState()

    const match = useMatch('/manage/:id')
    const SubGredditId = match.params.id

    const { Notify } = useContext(NotifyContext)

    useEffect(() => {
        ServerMethods.GetJoinRequests(SubGredditId).then(res => {
            setRequests(res)
        }).catch(err => {
            console.log(err)
        })
    }, [SubGredditId])

    const HandleAccept = (userId) => {
        ServerMethods.AcceptJoinRequests(SubGredditId, userId).then(res => {
            Notify({
                type: 'success',
                message: `Accepted User ${res.Name} successfully`
            })
            setRequests(Requests.filter(f => f.id !== res.id))
        }).catch(e => {
            console.log(e)
            Notify({
                type: 'error',
                message: e.response.data.error
            })
        })
    }

    const HandleReject = (userId) => {
        ServerMethods.RejectJoinRequests(SubGredditId, userId).then(res => {
            Notify({
                type: 'success',
                message: `Rejected User ${res.Name} successfully`
            })
            setRequests(Requests.filter(f => f.id !== res.id))
        }).catch(e => {
            console.log(e)
            Notify({
                type: 'error',
                message: e.response.data.error
            })
        })
    }


    if (!Requests) {
        return (
            <CircularProgress />
        )
    }

    return (
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography fontSize={30} sx={{ width: '100%',textAlign: 'center' }}>Requests</Typography>
            <List sx={{ width: { md: '55%' }, display: 'block', height: { md: '70vh' }, overflowY: { md: 'scroll' } }}>
                {
                    Requests.map(r => {
                        return (
                            <>
                                <ListItem key={r.id + 'list'}>
                                    <ListItemText sx={{ flexGrow: 1 }}>
                                        {r.firstName} {r.lastName}
                                    </ListItemText>
                                    <ListItemButton sx={{ flexGrow: 0 }} onClick={() => HandleAccept(r.id)}>
                                        <CheckIcon color='success' />
                                    </ListItemButton>
                                    <ListItemButton sx={{ flexGrow: 0 }} onClick={() => HandleReject(r.id)}>
                                        <Clear color='error' />
                                    </ListItemButton>
                                </ListItem>
                                <Divider key={r.id + 'divider'} />
                            </>
                        )
                    }
                    )
                }
            </List>
        </Box>
    );
};

export default Requests;