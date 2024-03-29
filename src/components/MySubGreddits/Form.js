import { Avatar, Box, Button, Chip, CircularProgress, Container, CssBaseline, FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ServerMethods from '../../utils/Communicate';
import NotifyContext from '../../contexts/NotifyContext';


const CreateSubGredditsForm = ({ data, setData, setEdit,edit }) => {

    const { Notify } = useContext(NotifyContext)

    const [inv1, setInv1] = useState(true)
    const [inv2, setInv2] = useState(true)
    const [inv3, setInv3] = useState(false)
    const [inv4, setInv4] = useState(false)
    const [Tags, setTags] = useState([])
    const [Banned, setBanned] = useState([])
    const [touched, setTouched] = useState({
        1: false,
        2: false
    })
    const [pinging, setPinging] = useState(false)


    const handleTagAdd = () => {
        const newTag = document.getElementById('Tag-Input').value
        document.getElementById('Tag-Input').value = null
        if (!newTag || Tags.find(t => t===newTag)) {
            return;
        }
        setTags([...Tags, newTag])
    }

    const handleBannedAdd = () => {
        const newWord = document.getElementById('Banned-Input').value
        document.getElementById('Banned-Input').value = null
        if (!newWord || Banned.find(t => t===newWord)) {
            return;
        }
        setBanned([...Banned, newWord])
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPinging(true)
        const formdata = new FormData(event.currentTarget);
        // const newSubGreddit = {
        //     Name: formdata.get('Name'),
        //     Description: formdata.get('Description'),
        //     Tags: JSON.stringify(Tags),
        //     Banned: JSON.stringify(Banned),
        // };
        const newSubGreddit = new FormData()
        newSubGreddit.append('Name',formdata.get('Name'))
        newSubGreddit.append('Description',formdata.get('Description'))
        newSubGreddit.append('Tags',JSON.stringify(Tags))
        newSubGreddit.append('Banned',JSON.stringify(Banned))
        newSubGreddit.append('image',formdata.get('SubGreddit-Image'))
        setTags([])
        setBanned([])
        document.getElementById('Post-Name-Input').value=''
        document.getElementById('Post-Description-Input').value=''
        setInv1(true)
        setInv2(true)

        
        try {
            const response = await ServerMethods.AddSubGreddit(newSubGreddit)
            setData([...data, response])
            Notify({
                type: 'success',
                message: `Added new SubGreddit '${response.Name}' Succcesfully`
            })
            setEdit(false)
            setPinging(false)
        } catch (e) {
            console.log(e)
            Notify({
                type: 'error',
                message: `Posting '${newSubGreddit.Name}' Failed`
            })
            setPinging(false)
            setEdit(false)
        }
    }

    const HandleCancel = () => {
        setTags([])
        setBanned([])
        document.getElementById('Post-Name-Input').value=''
        document.getElementById('Post-Description-Input').value=''
        setEdit(false)
    }
    return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AddIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create New Sub Greddit
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="SubGreddit Name"
                            name="Name"
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
                            id='Post-Name-Input'
                            />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Description"
                            label="Desciption..."
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
                                    setTouched({ ...touched, 2: true })
                                }
                            }}
                            id='Post-Description-Input'
                        />
                        <Typography sx={{ display: 'inline-block' }}>Tags:</Typography>
                        {
                            Tags.map((tag,index) => <Chip key={tag} label={tag} sx={{ ml: 1,mt:1 }} variant="outlined" 
                            onDelete={() => {
                                setTags(Tags.filter((f,i) => i!==index))
                            }}
                            ></Chip>)
                        }
                        <br></br>
                        <FormControl sx={{ my: 1 }} variant="outlined" fullWidth>
                            {/* <InputLabel htmlFor="outlined-adornment-password">Add Tag</InputLabel> */}
                            <OutlinedInput
                                id="Tag-Input"
                                placeholder='Add Tag'
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={handleTagAdd}
                                            sx={{ color: inv3 === true ? 'grey' : 'black' }}
                                            disabled={inv3}
                                        >
                                            <AddBoxIcon color='primary'/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{
                                    onChange: (event) => {
                                        if (event.target.value !== '' && (event.target.value.toLowerCase() !== event.target.value || event.target.value.search(" ") !== -1)) {
                                            setInv3(true)
                                        } else {
                                            setInv3(false)
                                        }
                                    }
                                }}
                                error={inv3}
                            />
                            {
                                inv3 === true &&
                                <FormHelperText error>Tags Must be Single Worded Lower Case</FormHelperText>
                            }
                        </FormControl>
                        <Typography sx={{ display: 'inline-block' }}>Banned Words:</Typography>
                        {
                            Banned.map((word,index) => <Chip key={word} label={word} sx={{ ml: 1,mt: 1 }} variant="outlined"
                            onDelete={() => {
                                setBanned(Banned.filter((f,i) => i!==index))
                            }}></Chip>)
                        }
                        <FormControl sx={{ my: 1 }} variant="outlined" fullWidth>
                            <OutlinedInput
                                id="Banned-Input"
                                placeholder='Add a Banned Word'
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={handleBannedAdd}
                                            sx={{ color: inv4 === true ? 'grey' : 'black' }}
                                            disabled={inv4}
                                        >
                                            <AddBoxIcon color='primary'/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{
                                    onChange: (event) => {
                                        if (event.target.value !== '' && (event.target.value.search(" ") !== -1)) {
                                            setInv4(true)
                                        } else {
                                            setInv4(false)
                                        }
                                    }
                                }}
                                error={inv4}
                            />
                            {
                                inv4 === true &&
                                <FormHelperText error>Banned Words Must be Single Worded</FormHelperText>
                            }
                        </FormControl>
                        <Typography>SubGreddit Image:</Typography>
                        <TextField 
                            type='file'
                            name="SubGreddit-Image"
                            inputProps={{accept:"image/*"}}
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
                                    "Create"
                            }
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={HandleCancel}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Container>
    );
};

export default CreateSubGredditsForm;