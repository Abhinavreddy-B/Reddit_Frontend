import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, Collapse, Divider, FormControl, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import ServerMethods from '../../../utils/Communicate';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';

const CommentItem = ({ comment }) => {

    const [Children, setChildren] = useState()
    const [open, setOpen] = useState(false)
    const [reply, SetReply] = useState(false)

    const ReplyOpenHandler = (event) => {
        event.stopPropagation();
        SetReply(true)
    }

    const ReplyCloseHandler = (event) => {
        event.stopPropagation();
        SetReply(false)
    }
    const OpenHandler = () => {
        if (open) {
            setOpen(false)
        } else {
            setOpen(true)
            ServerMethods.GetCommentReplies(comment.id).then(res => {
                console.log(res)
                setChildren(res)
            })
        }
    }
    const ReplySubmitHandler = (event) => {
        event.preventDefault()
        const val = document.getElementById(`reply-input-${comment.id}`).value
        SetReply(false)
        ServerMethods.PostCommentReply(comment.id, val).then((res) => {
            setChildren(Children.concat(res))
        })
    }
    return (
        <Box style={{ width: '100%' }}>
            <Divider />
            {/* <ListItemText primary={comment.Text} /> */}
            <Accordion expanded={open}
                style={{
                    border: 'none',
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        margin: 0,
                    },
                }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    onClick={OpenHandler}
                >
                    <Typography sx={{ fontWeight: 'bold' }} style={{ flexGrow: 1 }}>{comment.Text}</Typography>
                    {
                        reply ?
                            <Collapse in={reply} orientation="horizontal" style={{ marginRight: 5 }}>
                                <FormControl sx={{ m: 1 }} fullWidth variant="outlined">
                                    <OutlinedInput
                                        id={`reply-input-${comment.id}`}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={ReplySubmitHandler}
                                                    edge="end"
                                                >
                                                    <DoneIcon color='success' />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={ReplyCloseHandler}
                                                    edge="end"
                                                >
                                                    <CloseIcon color='error' />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Collapse> :
                            <Button onClick={ReplyOpenHandler} style={{ flexGrow: 0 }}>
                                <ReplyIcon />
                            </Button>
                    }
                </AccordionSummary>
                <AccordionDetails>
                    {
                        (!open || !Children) &&
                        <CircularProgress />
                    }
                    {
                        open && Children &&
                        <Box sx={{ pl: 3, border: 0, borderLeft: 1 }}>
                            {
                                Children.map(c => <CommentItem key={c.id} comment={c} />)
                            }
                        </Box>
                    }
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}
export default CommentItem;