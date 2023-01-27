import { CircularProgress, Divider, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';
import NotifyContext from '../../contexts/NotifyContext';
import ServerMethods from '../../utils/Communicate';

const Users = () => {
    const [users, setUsers] = useState()

    const match = useMatch('/manage/:id')
    const SubGredditId = match.params.id

    const { Notify } = useContext(NotifyContext)

    useEffect(() => {
        if (!Notify || !SubGredditId) {
            return
        }

        ServerMethods.GetSubGredditUsers(SubGredditId).then(res => {
            setUsers(res)
        }).catch(e => {
            console.log(e)
            Notify({
                type: 'error',
                message: 'You are not supposed to see this'
            })
        })
    }, [Notify, SubGredditId])

    if (!users) {
        return (
            <CircularProgress />
        )
    }
    return (
        <>
            <Typography fontSize={30} sx={{ width: '100%', textAlign: 'center' }}>Users</Typography>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <Typography fontSize={30} sx={{ width: '100%', textAlign: 'center' }}>Not Blocked</Typography>
                    <List sx={{ display: 'block', height: { md: '60vh' }, overflowY: { md: 'scroll' } }}>
                        {
                            users.filter(f => f.blocked === false).map(r => {
                                return (
                                    <>
                                        <ListItem key={r.ref.id + 'list'}>
                                            <ListItemText sx={{ flexGrow: 1 }}>
                                                {r.ref.firstName} {r.ref.lastName}
                                            </ListItemText>
                                        </ListItem>
                                        <Divider key={r.ref.id + 'divider'} />
                                    </>
                                )
                            }
                            )
                        }
                    </List>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Typography fontSize={30} sx={{ width: '100%', textAlign: 'center' }}>Blocked</Typography>
                    <List sx={{ display: 'block', height: { md: '60vh' }, overflowY: { md: 'scroll' } }}>
                        {
                            users.filter(f => f.blocked === true).map(r => {
                                return (
                                    <>
                                        <ListItem key={r.ref.id + 'list'}>
                                            <ListItemText sx={{ flexGrow: 1 }}>
                                                {r.ref.firstName} {r.ref.lastName}
                                            </ListItemText>
                                        </ListItem>
                                        <Divider key={r.ref.id + 'divider'} />
                                    </>
                                )
                            }
                            )
                        }
                    </List>
                </Grid>
            </Grid>
        </>
    );
};

export default Users;