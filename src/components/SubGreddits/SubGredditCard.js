import { Button, Card, CardActions, CardContent, Chip, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubGredditCard = ({ data, UserSubGreddits, handleLeave }) => {
    const navigate = useNavigate()

    const meta = UserSubGreddits.find(f => f.id.id === data.id)

    return (
        <Grid item xs={12} md={6}>
            <Card sx={{ margin: 2, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
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
                </CardContent>
                {
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
                                alert('You Already Left this Sub Greddit, Do You want to join again?')
                            } else {
                                alert('hi')
                            }
                        }}>
                            <Button size="small" variant='contained' color='success'>Join</Button>
                        </CardActions>
                }
            </Card>
        </Grid>
    );
};

export default SubGredditCard;