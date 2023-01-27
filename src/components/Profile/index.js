import * as React from 'react';
import NotifyContext from '../../contexts/NotifyContext';
import ServerMethods from '../../utils/Communicate';
import Details from './Details';
import Social from './Social';
import { CircularProgress, Grid } from '@mui/material';
import { Box } from '@mui/system';


const Profile = () => {

    const [userData, setUserData] = React.useState()
    const { Notify } = React.useContext(NotifyContext)

    const [pinging, setPinging] = React.useState(false)

    React.useEffect(() => {
        ServerMethods.GetUserData().then((data) => {
            setUserData(data)
        }).catch(e => {
            console.log(e)
        })
    }, [])

    if (!userData) {
        return (
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                alignItems: 'center'
            }}>
                <CircularProgress />
            </Box>
        )
    }
    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8} order={{ xs: 1 }}>
                    <Details pinging={pinging} setPinging={setPinging} Notify={Notify} userData={userData} setUserData={setUserData}></Details>
                </Grid>
                <Grid item xs={12} md={4} order={{ xs: 2 }}>
                    <Social userData={userData} setUserData={setUserData}></Social>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;