import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import NotifyContext from '../contexts/NotifyContext';
import ServerMethods from '../utils/Communicate';
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import RedditIcon from '@mui/icons-material/Reddit';


export default function SignUp({ setSignUp }) {
    const { Notify } = React.useContext(NotifyContext)

    const [inv1, setInv1] = React.useState(true)
    const [inv2, setInv2] = React.useState(true)
    const [inv3, setInv3] = React.useState(true)
    const [inv4, setInv4] = React.useState(true)
    const [inv5, setInv5] = React.useState(true)
    const [inv6, setInv6] = React.useState(true)
    const [inv7, setInv7] = React.useState(true)
    const [pinging, setPinging] = React.useState(false)
    const [touched, setTouched] = React.useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPinging(true)
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
            setPinging(false)
            setSignUp(false)
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `Sign Up Failed, ${e.response.data.error}`
            })
            setPinging(false)
        }
    };

    return (
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
                        <RedditIcon />
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
                                    error={touched[1] && inv1}
                                    helperText={touched[1] && inv1 ? 'First Name is a required field' : ''}
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
                                    inputProps={{
                                        onChange: (event) => {
                                            if (!event.target.value || event.target.value === null || event.target.value === '') {
                                                setInv2(true)
                                            } else {
                                                setInv2(false)
                                            }
                                        },
                                        onBlur: () => {
                                            setTouched({ ...touched, 2: true })
                                        }
                                    }}
                                    error={touched[2] && inv2}
                                    helperText={touched[2] && inv2 ? 'Last Name is a required field' : ''}
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
                            inputProps={{
                                onChange: (event) => {
                                    if (!event.target.value || event.target.value === null || event.target.value === '') {
                                        setInv3(true)
                                    } else {
                                        setInv3(false)
                                    }
                                },
                                onBlur: () => {
                                    setTouched({ ...touched, 3: true })
                                }
                            }}
                            error={touched[3] && inv3}
                            helperText={touched[3] && inv3 ? 'Username is a required field' : ''}
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
                            inputProps={{
                                onChange: (event) => {
                                    if (!event.target.value || event.target.value === null || event.target.value === '') {
                                        setInv4(true)
                                    } else {
                                        setInv4(false)
                                    }
                                },
                                onBlur: () => {
                                    setTouched({ ...touched, 4: true })
                                }
                            }}
                            error={touched[4] && inv4}
                            helperText={touched[4] && inv4 ? 'Password is a required field' : ''}
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
                                inputMode: 'email',
                                onChange: (event) => {
                                    if (!event.target.value || event.target.value === null || event.target.value === '') {
                                        setInv5(true)
                                    } else {
                                        setInv5(false)
                                    }
                                },
                                onBlur: () => {
                                    setTouched({ ...touched, 5: true })
                                }
                            }}
                            error={touched[5] && inv5}
                            helperText={touched[5] && inv5 ? 'Email is a required field' : ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Age"
                            label="Age"
                            name="Age"
                            type='number'
                            inputProps={{
                                onChange: (event) => {
                                    if (!event.target.value || event.target.value === null || event.target.value === '') {
                                        setInv6(true)
                                    } else {
                                        setInv6(false)
                                    }
                                },
                                onBlur: () => {
                                    setTouched({ ...touched, 6: true })
                                }
                            }}
                            error={touched[6] && inv6}
                            helperText={touched[6] && inv6 ? 'Age is a required field' : ''}
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
                                inputMode: 'tel',
                                onChange: (event) => {
                                    if (!event.target.value || event.target.value === null || event.target.value === '' || /^[0-9]{10}$/.test(event.target.value) === false) {
                                        setInv7(true)
                                    } else {
                                        setInv7(false)
                                    }
                                },
                                onBlur: () => {
                                    setTouched({ ...touched, 7: true })
                                }
                            }}
                            error={touched[7] && inv7}
                            helperText={touched[7] && inv7 ? 'Contact number  should be of the form xxxxxxxxxx' : ''}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={
                                inv1 || inv2 || inv3 || inv4 || inv5 || inv6 || inv7 || pinging
                            }
                        >
                            {
                                pinging === true ?
                                    <CircularProgress /> :
                                    "Sign Up"
                            }
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => setSignUp(false)}
                        >
                            Existing User? Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
    );
}