import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import React, { useState } from 'react';
import { Box } from '@mui/system';
import LoginIcon from '@mui/icons-material/Login';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReportIcon from '@mui/icons-material/Report';
import Requests from './Requests';
import { PeopleRounded } from '@mui/icons-material';
import Users from './Users';
import Reports from './Reports';
import Stats from './Stats';

const ManageSubGreddit = () => {
    const [page, setPage] = useState('Users')

    return (
        <>
            <Box sx={{ width: '100%', position: 'fixed', bottom:  0, display: 'flex', justifyContent: 'center' }}>
                {/* <Paper elevation={5} sx={{ width: 'fit-content' }} square={false}> */}
                    <BottomNavigation component={Paper} elevation={5}
                        value={page}
                        onChange={(event, newValue) => {
                            setPage(newValue);
                        }}
                        sx={{ flexGrow: 0 }}
                    >
                        <BottomNavigationAction value="Users" label="Users" icon={< PeopleRounded />} />
                        <BottomNavigationAction value="Requests" label="Requests" icon={<LoginIcon />} />
                        <BottomNavigationAction value="Stats" label="Stats" icon={<BarChartIcon />} />
                        <BottomNavigationAction value="Reports" label="Reported" icon={<ReportIcon />} />
                    </BottomNavigation>
                {/* </Paper> */}
            </Box>
            {
                
                // () => {
                //     console.log(page)
                //     switch (page) {
                //         case 'Users': {
                //             return (
                //                 <Users />
                //             )
                //         }
                //         case 'Requests': {
                //             return (
                //                 <Requests />
                //             )
                //         }
                //         default: {
                //             return (<div>'lol'</div>)
                //         }
                //     }
                // }
            }
            {
                page === 'Users' && <Users />
            }
            {
                page === 'Requests' && <Requests />
            }
            {
                page === 'Stats' && <Stats />
            }
            {
                page === 'Reports' && <Reports />
            }
        </>
    );
};

export default ManageSubGreddit;