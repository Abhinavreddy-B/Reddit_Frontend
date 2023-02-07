import { Box, Chip, CircularProgress, Dialog, Fab, Grid, Slide, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import ServerMethods from '../../utils/Communicate';
import PostItem from './PostItem';
import NotifyContext from '../../contexts/NotifyContext'
import PostForm from './PostForm';
import { AddOutlined } from '@mui/icons-material';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import moment from 'moment';

const style = {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    width: { xs: '80%', md: 500 },
    // Height: '60%',
    margin: 0,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,

    borderRadius: 2,
    // display: 'block',
    // overflowY: "scroll"
};


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const SingleSubGredditPage = () => {
    const match = useMatch('/subgreddit/:id')
    const PageId = match.params.id
    const { Notify } = useContext(NotifyContext)
    const navigate = useNavigate()
    const [edit, setEdit] = useState(false)

    const [data, setData] = useState()

    useEffect(() => {
        ServerMethods.GetSingleSubGredditPage(PageId).then(response => {
            setData(response)
        }).catch(error => {
            if (error.response.status === 401) {
                Notify({
                    type: 'error',
                    message: 'You are Not allowed to view This'
                })
                navigate('/profile')
            }
        })
    }, [PageId, Notify, navigate])

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

    const dateObject = new Date(data.CreatedAt)
    const formattedDate = moment(dateObject).format('DD/MM/YYYY (h:mm:ss a)');
    return (
        <Grid container sx={{ height: '90%', width: '100%',px: 3,my:2 }}>
            <Dialog
                open={edit === true}
                TransitionComponent={Transition}
                aria-describedby="alert-dialog-slide-description"
            >
                <Box sx={style}>
                    <PostForm data={data} setData={setData} setEdit={setEdit} />
                </Box>
            </Dialog>
            {
                edit === false &&
                    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 20 }}>
                        <Fab color="primary" aria-label="add" sx={{ bottom: 0, left: 0 }} onClick={() => setEdit(true)}>
                            <AddOutlined />
                        </Fab>
                    </Box>
            }
            <Grid item xs={12} md={3} sx={{ height: '100%', textAlign: 'center' }}>
                <img src={data.ImageUrl || "/logo.png"} style={{ width: '80%' }} alt='lol' />
            </Grid>
            <Grid item xs={12} md={9} sx={{ height: { md: '85vh' }, mt: 3, overflowY: { md: 'scroll' } }}>
                <Typography sx={{ fontSize: 25, top: { md: 0 },display: 'block', zIndex: 10 }} gutterBottom>
                    {data.Name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {data.Description}
                </Typography>
                <Grid container>
                        <Grid item xs={3} lg={1} sx={{textAlign: 'center'}}>
                            <PeopleRoundedIcon sx={{height: 20}} />
                            <Typography sx={{ mb: 1.5 }} color="text.primary">
                                {data.PeopleCount}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} lg={1} sx={{textAlign: 'center'}}>
                            <QuestionAnswerRoundedIcon sx={{height: 20}} />
                            <Typography sx={{ mb: 1.5 }} color="text.primary">
                                {data.PostsCount} Posts
                            </Typography>
                        </Grid>
                        <Grid item xs={6} lg={3} sx={{textAlign: 'center'}}>
                            <AccessAlarmRoundedIcon sx={{height: 20}} />
                            <Typography sx={{ mb: 1.5 }} color="text.primary">
                                {formattedDate}
                            </Typography>
                        </Grid>
                    </Grid>
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