import { Accordion, AccordionDetails, AccordionSummary, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Box } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';
import ServerMethods from '../../utils/Communicate';
import NotifyContext from '../../contexts/NotifyContext';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import CommentItem from '../SingleSubGreddit/PostItem/CommentItem'

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
            <Accordion sx={{ width: '95%', md: 2, pl: 5, border: 0, borderLeft: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography sx={{ fontWeight: 'bold' }}>Comments ({post.Comments.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ pl: 3, border: 0, borderLeft: 1 }}>
                                {
                                    post.Comments.map(c => <CommentItem key={c.id} comment={c} />)
                                }
                            </Box>
                        </AccordionDetails>
                    </Accordion>
            </>
        </Paper>
    );
};

export default PostItem;