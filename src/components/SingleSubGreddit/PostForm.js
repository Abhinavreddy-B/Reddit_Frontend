import { Avatar, Box, Button, CircularProgress, Container, createTheme, CssBaseline, TextField, ThemeProvider, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import NotifyContext from '../../contexts/NotifyContext';
import ServerMethods from '../../utils/Communicate';

const theme = createTheme()

const PostForm = ({ data, setData, setEdit }) => {

    const { Notify } = useContext(NotifyContext)

    const [inv1, setInv1] = useState(true)
    const [touched, setTouched] = useState({
        1: false,
    })
    const [pinging, setPinging] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPinging(true)

        try {
            console.log(data.Posts)
            const res = await ServerMethods.AddPost(data.id, document.getElementById('Post-Form').value)
            setData({ ...data, Posts: [...data.Posts,res] })
            setPinging(false)
            setEdit(false)
        }catch(e){
            setPinging(false)
            console.log(e)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AddIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Post
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Post Here...."
                            name="Text"
                            id='Post-Form'
                            error={touched[1] && inv1}
                            inputProps={{
                                onChange: (event) => {
                                    if (!event.target.value || event.target.value === null || event.target.value === '') {
                                        setInv1(true)
                                    } else {
                                        setInv1(false)
                                    }
                                },
                                onBlur: () => {
                                    setTouched({ ...touched, 1: true })
                                }
                            }}

                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => setEdit(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={inv1 === true || pinging === true}
                        >
                            {
                                pinging === true ?
                                    <CircularProgress /> :
                                    "Create"
                            }
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default PostForm;