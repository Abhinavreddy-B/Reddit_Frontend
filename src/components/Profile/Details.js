import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ServerMethods from '../../utils/Communicate';
import { CircularProgress, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

const Details = ({ pinging, setPinging, setUserData, Notify, userData }) => {
    const [editable, setEditable] = React.useState(false)
    const [inv1, setInv1] = React.useState(false)
    const [inv2, setInv2] = React.useState(false)
    const [inv3, setInv3] = React.useState(false)
    const [inv4, setInv4] = React.useState(false)
    const [inv5, setInv5] = React.useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPinging(true)
        const data = new FormData(event.currentTarget);
        const credentials = {
            firstName: data.get('First Name'),
            lastName: data.get('Last Name'),
            password: data.get('password'),
            Email: data.get('email'),
            Age: parseInt(data.get('Age')),
            ContactNumber: parseInt(data.get('Contact Number'))
        };
        setEditable(false)
        try {
            const responseData = await ServerMethods.UpdateUserData(credentials)
            setUserData(responseData)
            Notify({
                type: 'success',
                message: 'Updates Successfull'
            })
            setPinging(false)
            setEditable(false)
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `Update Failed, ${e.response.data.error}`
            })
            setPinging(false)
        }
    };
    if(pinging===true){
        return (<CircularProgress />)
    }
    if (editable === false) {
        return (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 3,
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
                                    defaultValue={userData.firstName}
                                    disabled={true}
                                    variant='filled'
                                    label="First Name"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Last Name"
                                    variant='filled'
                                    defaultValue={userData.lastName}
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            variant='filled'
                            margin="normal"
                            fullWidth
                            label="Username"
                            defaultValue={userData.userName}
                            disabled
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="email"
                            type='email'
                            defaultValue={userData.Email}
                            disabled={true}
                            variant='filled'
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Age"
                            type='number'
                            defaultValue={userData.Age}
                            disabled={true}
                            variant='filled'
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Contact Number"
                            defaultValue={userData.ContactNumber}
                            variant='filled'
                            disabled
                        />
                        <Button
                            sx={{ mt: 3, mb: 2, display: editable === true ? 'none' : 'block' }}
                            onClick={() => setEditable(true)}
                        >
                            <EditIcon></EditIcon>
                        </Button>
                    </Box>
                </Box>
            </Container>
        )
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 3,
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
                                error={inv1}
                                inputProps={{
                                    onChange: (event) => {
                                        if (!event.target.value || event.target.value === null || event.target.value === '') {
                                            setInv1(true)
                                        } else {
                                            setInv1(false)
                                        }
                                    },
                                }}
                                helperText={inv1 ? 'First Name is a required field' : ''}
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
                                error={inv2}
                                inputProps={{
                                    onChange: (event) => {
                                        if (!event.target.value || event.target.value === null || event.target.value === '') {
                                            setInv2(true)
                                        } else {
                                            setInv2(false)
                                        }
                                    },
                                }}
                                helperText={inv2 ? 'Last Name is a required field' : ''}
                            />
                        </Grid>
                    </Grid>
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
                            inputMode: 'email',
                            onChange: (event) => {
                                if (!event.target.value || event.target.value === null || event.target.value === '') {
                                    setInv3(true)
                                } else {
                                    setInv3(false)
                                }
                            },
                        }}
                        defaultValue={userData.Email}
                        disabled={editable === false ? true : false}
                        error={inv3}
                        helperText={inv3 ? 'Email is a required field' : ''}
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
                        error={inv4}
                        inputProps={{
                            onChange: (event) => {
                                if (!event.target.value || event.target.value === null || event.target.value === '' || event.target.value <= 0 || event.target.value >= 100) {
                                    setInv4(true)
                                } else {
                                    setInv4(false)
                                }
                            },
                        }}
                        helperText={inv4 ? 'Age must be between 1 and 100' : undefined}
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
                            inputMode: 'tel',
                            onChange: (event) => {
                                if (!event.target.value || event.target.value === null || event.target.value === '' || /[0-9]{10}/.test(event.target.value) === false) {
                                    setInv5(true)
                                } else {
                                    setInv5(false)
                                }
                            },
                        }}
                        defaultValue={userData.ContactNumber}
                        disabled={editable === false ? true : false}
                        error={inv5}
                        helperText={inv5 ? 'Should be of the format xxxxxxxxxx' : undefined}
                    />
                    <Button
                        sx={{ mt: 3, mb: 2, display: editable === true ? 'none' : 'block' }}
                        onClick={() => setEditable(true)}
                    >
                        <EditIcon></EditIcon>
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, display: editable === false ? 'none' : 'block' }}
                        disabled={inv1 || inv2 || inv3 || inv4 || inv5 || pinging}
                    >
                        {
                            pinging === true ?
                                <CircularProgress /> :
                                "Update"
                        }
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, display: editable === false ? 'none' : 'block' }}
                        onClick={() => {
                            setEditable(false)
                        }}
                        disabled={pinging}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Details;