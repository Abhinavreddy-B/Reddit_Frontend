import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import NotifyContext from '../contexts/NotifyContext';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ServerMethods from '../utils/Communicate';
import { Grid } from '@mui/material';

const theme = createTheme();

export default function SignIn() {
    const navigate = useNavigate()
    const { Notify } = React.useContext(NotifyContext)

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const credentials = {
            firstName: data.get('First Name'),
            lastName: data.get('Last Name'),
            userName: data.get('userName'),
            password: data.get('password'),
            Email: data.get('email'),
            Age: data.get('Age'),
            ContactNumber: data.get('Contact Number')
        };
        try {
            await ServerMethods.signUp(credentials)
            Notify({
                type: 'success',
                message: 'Sign Up Successfull, Login to Continue'
            })
            navigate('/login')
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `Sign Up Failed, ${e.response.data.error}`
            })
        }
    };

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
                        <HowToRegIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="First Name"
                                    label="First Name"
                                    name="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="Last Name"
                                    label="Last Name"
                                    name="Last Name"
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="userName"
                            label="Username"
                            name="userName"
                            autoComplete="userName"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="email"
                            name="email"
                            autoComplete="email"
                            type='email'
                            inputProps={{
                                inputMode: 'email'
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Age"
                            label="Age"
                            name="Age"
                            type='number'
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Contact Number"
                            label="Contact Number"
                            name="Contact Number"
                            inputProps={{
                                type: 'tel',
                                pattern: "[0-9]{5}[0-9]{5}",
                                title: 'Should be of the format xxxxxxxxxx',
                                inputMode: 'tel'
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => navigate('/login')}
                        >
                            Existing User? Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}