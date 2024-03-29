import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import ServerMethods from '../utils/Communicate';
import NotifyContext from '../contexts/NotifyContext';
import { CircularProgress } from '@mui/material';
import SignUp from "./SignUp";
import RedditIcon from '@mui/icons-material/Reddit';


export default function SignIn() {
    const navigate = useNavigate()

    const { setUser } = React.useContext(UserContext)
    const { Notify } = React.useContext(NotifyContext)
    const [signUp,setSignUp] = React.useState(false)

    const [inv1, setInv1] = React.useState(true)
    const [inv2, setInv2] = React.useState(true)
    const [pinging, setPinging] = React.useState(false)
    const [touched, setTouched] = React.useState({
        1: false,
        2: false,
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPinging(true)
        const data = new FormData(event.currentTarget);
        const credentials = {
            userName: data.get('userName'),
            password: data.get('password'),
        };
        try {
            const resp = await ServerMethods.signIn(credentials)
            window.localStorage.setItem('Greddit:token', JSON.stringify(resp))
            ServerMethods.setToken(resp)
            setUser(resp)
            Notify({
                type: 'success',
                message: 'Succesfull Login'
            })
            setPinging(false)
            navigate('/')
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `${e.response.data.error}`
            })
            setPinging(false)
        }
    };

    if(signUp === true){
        return (
            <SignUp setSignUp={setSignUp}/>
        )
    }

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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="userName"
                            label="Username"
                            name="userName"
                            autoComplete="userName"
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
                                    setTouched({...touched,1: true})
                                }
                            }}
                            helperText={touched[1] && inv1 ? 'Username is a required field' : ''}
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
                            error={touched[2] && inv2}
                            inputProps={{
                                onChange: (event) => {
                                    if (!event.target.value || event.target.value === null || event.target.value === '') {
                                        setInv2(true)
                                    } else {
                                        setInv2(false)
                                    }
                                },
                                onBlur: () => {
                                    setTouched({...touched,2: true})
                                }
                            }}
                            helperText={touched[2] && inv2 ? 'password is a required field' : ''}
                            />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={inv1 === true || inv2 === true || pinging === true}
                        >
                            {
                                pinging === true ?
                                    <CircularProgress /> :
                                    "Sign In"
                            }
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => setSignUp(true)}
                        >
                            New User? Sign Up
                        </Button>
                    </Box>
                </Box>
            </Container>
    );
}