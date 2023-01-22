import { Box, Chip, CircularProgress, Fab, Grid, Modal, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import ServerMethods from '../../utils/Communicate';
import PostItem from './PostItem';
import NotifyContext from '../../contexts/NotifyContext'
import PostForm from './PostForm';
import { AddOutlined } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs: '90%',md: 'fit-content'},
    // maxWidth: '90%',
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 3,
    pt: 2,
    px: 4,
    pb: 3,
    zIndex: 15
};

const SingleSubGredditPage = () => {
    const match = useMatch('/subgreddit/:id')
    const PageId = match.params.id
    const {Notify} = useContext(NotifyContext)
    const navigate = useNavigate()
    const [edit, setEdit] = useState(false)

    const [data, setData] = useState()

    useEffect(() => {
        ServerMethods.GetSingleSubGredditPage(PageId).then(response => {
            setData(response)
            console.log(response)
        }).catch(error => {
            if(error.response.status === 401){
                Notify({
                    type: 'error',
                    message: 'You are Not allowed to view This'
                })
                navigate('/profile')
            }
        })
    }, [PageId,Notify,navigate])

    if (!data) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Grid container sx={{ height: '100%', width: '100%' }}>
            {
                edit === true ?
                    <Modal open>
                        <Box sx={style}>
                            <PostForm data={data} setData={setData} setEdit={setEdit} />
                        </Box>
                    </Modal> :
                    <Box sx={{position: 'fixed',bottom: 20 ,right: 20}}>
                        <Fab color="primary" aria-label="add" sx={{ bottom: 0, left: 0 }} onClick={() => setEdit(true)}>
                            <AddOutlined />
                        </Fab>
                    </Box>
            }
            <Grid item xs={12} md={3} sx={{ height: '100%', textAlign: 'center' }}>
                <img src="/logo.png" style={{ width: '80%' }} alt='lol' />
            </Grid>
            <Grid item xs={12} md={9} sx={{ height: {md: '85vh'}, padding: 3, overflowY: {md: 'scroll'} }}>
                <Typography sx={{ fontSize: 25 }} gutterBottom>
                    {data.Name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {data.Description}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {data.PeopleCount} People
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {data.PostsCount} Posts
                </Typography>
                <Typography sx={{ mb: 1.5, display: 'inline-block' }} color="text.secondary">
                    Banned:
                </Typography>
                {
                    data.Banned.map(word => <Chip key={word} variant="outlined" label={word} sx={{ ml: 1 }} />)
                }
                <Box>
                    {
                        data.Posts.map(p => <PostItem data={data} setData={setData} key={p.id} post={p} />)
                    }
                </Box>
            </Grid>
        </Grid>
    );
};

export default SingleSubGredditPage;