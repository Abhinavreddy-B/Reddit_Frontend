import { CircularProgress, Dialog, Fab, Grid, Slide } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import ServerMethods from '../../utils/Communicate';
import CreateSubGredditsForm from './Form';
import SubGredditCard from './SubGredditCard';
import AddIcon from '@mui/icons-material/Add';
import NotifyContext from '../../contexts/NotifyContext';

const style = {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    width: { xs: '80%', md: 500 },
    // Height: '60%',
    margin: 0,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,

    borderRadius: 2,
    // display: 'block',
    // overflowY: "scroll"
};


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const MySubGreddits = () => {
    const [data, setData] = useState()
    const [pinging, setPinging] = useState(false)
    const [edit, setEdit] = useState(false)

    const { Notify } = useContext(NotifyContext)

    useEffect(() => {
        ServerMethods.GetOwnedSubGreddits().then((response) => {
            setData(response)
        })
    }, [])


    const HandleDelete = async (id) => {
        setPinging(true)
        try {
            await ServerMethods.DeleteSubGreddit(id)
            setData(data.filter(f => f.id !== id))
            Notify({
                type: 'success',
                message: `Deleted SubGreddit`
            })
            setPinging(false)
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `Couldnt Delete`
            })
            setPinging(false)
        }
    }
    return (
        <Box>
            <Dialog
                open={edit === true}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <Box sx={style}>
                    <CreateSubGredditsForm data={data} setData={setData} setEdit={setEdit} />
                </Box>
            </Dialog>
            {
                edit === false &&
                    <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
                        <Fab color="primary" aria-label="add" sx={{ bottom: 0, left: 0 }} onClick={() => setEdit(true)}>
                            <AddIcon />
                        </Fab>
                    </Box>
            }
            <Box sx={{ px: 2, height: '85vh' }}>
                <h1>Your SubGreddits:</h1>
                {
                    data && pinging === false ?
                        <Box sx={{
                            display: 'block',
                            height: '90%',
                            overflowY: 'scroll',
                        }}>
                            <Grid container>
                                {
                                    data.map(e => <SubGredditCard HandleDelete={HandleDelete} key={e.id} data={e} />)
                                }
                            </Grid>
                        </Box> :
                        <CircularProgress />
                }
            </Box>
        </Box>
    )
};

export default MySubGreddits;