import { Avatar, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import React, { useContext, useState } from 'react';
import NotifyContext from '../../../contexts/NotifyContext';
import ServerMethods from '../../../utils/Communicate';
import ReportIcon from '@mui/icons-material/Report';

const ReportForm = ({ setReportBox, PostId }) => {

    const [inv1, setInv1] = useState(true)
    const [touched, setTouched] = useState({
        1: false
    })
    const [pinging, setPinging] = useState(false)

    const { Notify } = useContext(NotifyContext)

    const HandleSubmit = async (event) => {
        console.log(document.getElementById('Report-Form'))
        event.preventDefault();
        setPinging(true)
        console.log(document.querySelectorAll('#Report-Form'))
        const val = document.getElementById('Report-Form').value;
        try {
            console.log(val)
            await ServerMethods.PostReport(val, PostId)
            Notify({
                type: 'success',
                message: 'Reported Succesfully'
            })
            setPinging(false)
            setReportBox(false)
        } catch (e) {
            Notify({
                type: 'error',
                message: e.response.data.error
            })
            setPinging(false)
            setReportBox(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <ReportIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Report Post
                </Typography>
                <Box component="form" sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Your Concern...."
                        name="Text"
                        id='Report-Form'
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
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={inv1 === true || pinging === true}
                        onClick={HandleSubmit}
                    >
                        {
                            pinging === true ?
                                <CircularProgress /> :
                                "Create"
                        }
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => setReportBox(false)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default ReportForm;