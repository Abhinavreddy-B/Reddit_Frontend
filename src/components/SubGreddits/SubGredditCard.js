import { Button, Card, CardActions, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ServerMethods from '../../utils/Communicate';
import NotifyContext from '../../contexts/NotifyContext';

const SubGredditCard = ({ data, UserSubGreddits, handleLeave }) => {
    const navigate = useNavigate()
    const [pinging, setPinging] = useState(false)

    const meta = UserSubGreddits.find(f => f.id.id === data.id)

    const { Notify } = useContext(NotifyContext)


    const HandleJoinRequest = () => {
        setPinging(true)
        ServerMethods.SendJoinRequest(data.id).then(() => {
            Notify({
                type: 'success',
                message: 'Send Request succesfully'
            })
            setPinging(false)
        }).catch(err => {
            console.log(err)
            Notify({
                type: 'error',
                message: `${err.response.data.error}`
            })
            setPinging(false)
        })
    }

    return (
        <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ margin: 2, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 25 }} gutterBottom>
                        {data.Name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary" fontSize={15}>
                        {data.Description}
                    </Typography>
                    <Grid container>
                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                            <PeopleRoundedIcon sx={{ height: 20 }} />
                            <Typography sx={{ mb: 1.5 }} color="text.primary">
                                {data.PeopleCount}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                            <QuestionAnswerRoundedIcon sx={{ height: 20 }} />
                            <Typography sx={{ mb: 1.5 }} color="text.primary">
                                {data.PostsCount} Posts
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                            <AccessAlarmRoundedIcon sx={{ height: 20 }} />
                            <Typography sx={{ mb: 1.5 }} color="text.primary">
                                {data.CreatedAt}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography sx={{ mb: 1.5, display: 'inline-block' }} color="text.secondary">
                        Banned:
                    </Typography>
                    {
                        data.Banned.map(word => <Chip key={word} variant="outlined" label={word} sx={{ ml: 1 }} />)
                    }
                </CardContent>
                {
                    pinging ?
                        <CircularProgress /> :
                        (
                            meta && meta.role !== 'left' ?
                                <>
                                    <CardActions sx={{ display: 'inline-block' }}>
                                        <Button size="small" variant='contained' onClick={() => navigate(`/subgreddit/${data.id}`)}>Open</Button>
                                    </CardActions>
                                    <CardActions sx={{ display: 'inline-block' }}>
                                        <Button size="small" variant='contained' color='error' disabled={meta.role === 'mod'} onClick={() => handleLeave(data.id)}>Leave</Button>
                                    </CardActions>
                                </>
                                :
                                <CardActions sx={{ display: 'inline-block' }} onClick={() => {
                                    if (meta && meta.role === 'left') {
                                        alert('You Already Left this Sub Greddit, You Cant join again')
                                    } else {
                                        HandleJoinRequest()
                                    }
                                }}>
                                    <Button size="small" variant='contained' color='success'>Join</Button>
                                </CardActions>
                        )

                }
            </Card>
        </Grid>
    );
};

export default SubGredditCard;