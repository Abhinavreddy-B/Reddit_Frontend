import { Box, CircularProgress, List, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ServerMethods from '../../utils/Communicate';
import PostItem from './PostItem';

const SavedPostsPage = () => {
    const [posts, setPosts] = useState()


    useEffect(() => {
        ServerMethods.GetSavedPosts().then(res => {
            setPosts(res)
        })
    }, [])

    if (!posts) {
        return (
            <CircularProgress />
        )
    }
    return (
        <Box sx={{ px: '10%' }}>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                Saved Posts
            </Typography>
            <Box sx={{height: '80vh',overflowY: 'scroll'}}>
                <List>
                    {
                        posts.map(post => <PostItem post={post} posts={posts} setPosts={setPosts} />)
                    }
                </List>
            </Box>
        </Box>
        // <PostItem />
    );
};

export default SavedPostsPage;