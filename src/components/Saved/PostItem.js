import { Accordion, AccordionDetails, AccordionSummary, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Box } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';
import ServerMethods from '../../utils/Communicate';
import NotifyContext from '../../contexts/NotifyContext';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

const PostItem = ({ post, posts, setPosts }) => {
    const { Notify } = useContext(NotifyContext)

    const UnSave = async () => {
        try {
            await ServerMethods.RemoveSavedPost(post.id)
            setPosts(posts.filter(p => p.id !== post.id))
            Notify({
                type: 'success',
                message: 'Removed Succesfully'
            })
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `Couldnt Remove Post, server: ${e.response.data.error}`
            })
        }
    }

    let filtered = post.Text
    return (
        <Paper sx={{m: 1,p: 1}} elevation={3}>
            <ListItem>
                <ListItemText
                    primary={`${filtered}   (Posted By ${post.PostedBy.Name})`}
                    sx={{ width: '100%' }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                    <ListItemButton onClick={() => UnSave()}>
                        <BookmarkRemoveIcon />
                    </ListItemButton>
                </Box>
            </ListItem>


            <>
                <Accordion sx={{ width: { lg: '50%', md: '80%', xs: '95%' }, md: 2, pl: 5 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography sx={{ fontWeight: 'bold' }}>Comments ({post.Comments.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List component="div" sx={{ pl: '10%' }}>
                            {
                                post.Comments.map(c => <><Divider light /><ListItemText primary={c} /></>)
                            }
                        </List>
                    </AccordionDetails>
                </Accordion>
            </>
        </Paper>
    );
};

export default PostItem;