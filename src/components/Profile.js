import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NotifyContext from '../contexts/NotifyContext';
import ServerMethods from '../utils/Communicate';
import { Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
// import { useNavigate } from 'react-router-dom';

const theme = createTheme();

const Social = () => {
    return (
        <>
            <Card
                sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Followers
                    </Typography>
                    <Typography>
                        This is a media card. You can use this section to describe the
                        content.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">View</Button>
                </CardActions>
            </Card>
            <Card
                sx={{ display: 'flex', flexDirection: 'column',margin: 2 }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Following
                    </Typography>
                    <Typography>
                        This is a media card. You can use this section to describe the
                        content.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">View</Button>
                </CardActions>
            </Card>
        </>
    )
}


const Profile = () => {

    const [userData, setUserData] = React.useState()
    const { Notify } = React.useContext(NotifyContext)
    const [editable, setEditable] = React.useState(false)
    // const navigate = useNavigate()

    React.useEffect(() => {
        ServerMethods.GetUserData().then((data) => {
            setUserData(data)
            console.log(data)
        }).catch(e => {
            console.log(e)
        })
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const credentials = {
            firstName: data.get('First Name'),
            lastName: data.get('Last Name'),
            password: data.get('password'),
            Email: data.get('email'),
            Age: data.get('Age'),
            ContactNumber: data.get('Contact Number')
        };
        setEditable(false)
        try {
            const responseData = await ServerMethods.UpdateUserData(credentials)
            setUserData(responseData)
            Notify({
                type: 'success',
                message: 'Updates Successfull'
            })
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `Update Failed, ${e.response.data.error}`
            })
        }
    };

    if (!userData) {
        return (
            <div>HowToReg</div>
        )
    }
    return (
        <ThemeProvider theme={theme}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={5} order={{xs: 2,md: 1}}>
                    <Social></Social>
                </Grid>

                <Grid item xs={12} md={7} order={{xs: 1, md: 2}}>
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
                                <PersonIcon></PersonIcon>
                            </Avatar>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>

                                        <TextField
                                            margin="normal"
                                            fullWidth
                                            id="First Name"
                                            label="First Name"
                                            name="First Name"
                                            autoFocus
                                            defaultValue={userData.firstName}
                                            disabled={editable === false ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="normal"
                                            fullWidth
                                            id="Last Name"
                                            label="Last Name"
                                            name="Last Name"
                                            defaultValue={userData.lastName}
                                            disabled={editable === false ? true : false}
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="userName"
                                    label="Username"
                                    name="userName"
                                    autoComplete="userName"
                                    defaultValue={userData.userName}
                                    disabled
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="password"
                                    label="New Password(Optional)"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    defaultValue={userData.password}
                                    disabled={editable === false ? true : false}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="email"
                                    label="email"
                                    name="email"
                                    autoComplete="email"
                                    type='email'
                                    inputProps={{
                                        inputMode: 'email'
                                    }}
                                    defaultValue={userData.Email}
                                    disabled={editable === false ? true : false}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="Age"
                                    label="Age"
                                    name="Age"
                                    type='number'
                                    defaultValue={userData.Age}
                                    disabled={editable === false ? true : false}
                                />
                                <TextField
                                    margin="normal"
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
                                    defaultValue={userData.ContactNumber}
                                    disabled={editable === false ? true : false}
                                />
                                <Button
                                    sx={{ mt: 3, mb: 2, display: editable === true ? 'none' : 'block' }}
                                    onClick={() => setEditable(true)}
                                >
                                    <EditIcon></EditIcon>
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, display: editable === false ? 'none' : 'block' }}
                                    onClick={() => {
                                        setEditable(false)
                                        window.location.reload()
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, display: editable === false ? 'none' : 'block' }}
                                >
                                    Update
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Profile;