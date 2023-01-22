import { Button, Card, CardActions, CardContent, Chip, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubGredditCard = ({ data, HandleDelete }) => {
    const navigate = useNavigate()

    return (
        <Grid item xs={12} md={6}>
            <Card sx={{margin: 2,boxShadow: 3,borderRadius: 2}}>
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
                        data.Banned.map(word => <Chip variant="outlined" label={word} sx={{ ml: 1 }} />)
                    }
                </CardContent>
                <CardActions sx={{ display: 'inline-block' }}>
                    <Button size="small" variant='contained' onClick={() => navigate(`/subgreddit/${data.id}`)}>Open</Button>
                </CardActions>
                {/* <CardActions sx={{ display: 'inline-block' }}>
                    <Button size="small" variant='contained' color='error' onClick={() => HandleDelete(data.id)}>Delete</Button>
                </CardActions> */}
            </Card>
        </Grid>
    );
};

export default SubGredditCard;