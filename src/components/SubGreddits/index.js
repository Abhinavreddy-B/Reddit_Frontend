import { Chip, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import ServerMethods from '../../utils/Communicate';
import SubGredditCard from './SubGredditCard';

const NameAscCmp = (a, b) => {
    if (a.Name < b.Name) {
        return -1
    } else if (a.Name > b.Name) {
        return 1
    }
    return 0
}

const NameDescCmp = (a, b) => {
    if (a.Name > b.Name) {
        return -1
    } else if (a.Name < b.Name) {
        return 1
    }
    return 0
}

const FollowerCmp = (a, b) => {
    if (a.PeopleCount > b.PeopleCount) {
        return -1
    } else if (a.PeopleCount < b.PeopleCount) {
        return 1
    }
    return 0
}

const CreationCmp = (a, b) => {
    if (new Date(a.CreatedAt) > new Date(b.CreatedAt)) {
        return -1
    } else if (new Date(a.CreatedAt) < new Date(b.CreatedAt)) {
        return 1
    }
    return 0
}
const MySubGreddits = () => {
    const [data, setData] = useState()
    const [pinging, setPinging] = useState(false)
    const [search, setSearch] = useState()
    const [Tags, setTags] = useState([])

    useEffect(() => {
        ServerMethods.GetAllSubGreddits().then((response) => {
            // console.log(response.slice().sort(NameAscCmp))
            setData(response.slice().sort(NameAscCmp))
            const tagArrays = response.map(e => e.Tags)
            let tags = []
            tagArrays.forEach(arr => {
                tags = [...new Set([...tags, ...arr])]
            })
            setTags(tags.map(e => { return { Tag: e, selected: false } }))
        })
    }, [])

    const HandleSort = (event) => {
        switch (event.target.value) {
            case 'NameAsc': {
                setData(data.slice().sort(NameAscCmp))
                break;
            }
            case 'NameDesc': {
                setData(data.slice().sort(NameDescCmp))
                break;
            }
            case 'Followers': {
                setData(data.slice().sort(FollowerCmp))
                break;
            }
            case 'Creation': {
                setData(data.slice().sort(CreationCmp))
                break;
            }
            default: {
                console.log('hello')
            }
        }
    }

    const FilteredData = data ? ((search !== undefined && search !== '' && search !== null) ? data.filter(f => f.Name.toLowerCase().includes(search.toLowerCase())) : data) : []


    const TagFiltered = FilteredData ? (Tags.filter(t => t.selected === true).length > 0 ? FilteredData.filter(fdat => {
        for (let i = 0; i < Tags.length; i++) {
            if (Tags[i].selected === true && fdat.Tags.find(val => val === Tags[i].Tag)) {
                return true;
            }
        }
        return false;
    }) : FilteredData) : []

    const ToggleTagSelect = (index) => {
        setTags(Tags.map((e, i) => {
            if (i === index) {
                return { ...e, selected: !e.selected }
            } else {
                return e
            }
        }))
    }

    // const HandleDelete = async (id) => {
    //     setPinging(true)
    //     try {
    //         await ServerMethods.DeleteSubGreddit(id)
    //         setData(data.filter(f => f.id !== id))
    //         Notify({
    //             type: 'success',
    //             message: `Deleted SubGreddit`
    //         })
    //         setPinging(false)
    //     } catch (e) {
    //         console.log(e)
    //         Notify({
    //             type: 'error',
    //             message: `Couldnt Delete`
    //         })
    //         setPinging(false)
    //     }
    // }
    // console.log(Tags.map((tag) => "<Chip key={tag} label={tag} sx={{ ml: 1 }} variant=\"outlined\"></Chip>"))

    return (
        <Box xs={12} sx={{ px: 2, height: '90vh' }}>
            <h1>Your SubGreddits:</h1>
            <TextField id="outlined-basic" label="Search" variant="outlined" value={search} onChange={(event) => setSearch(event.target.value)}
                sx={{ mb: 2 }}
            />
            <br></br>
            Filters:
            {
                Tags.length >= 1 &&
                Tags.map((tag, index) => {
                    if (tag.selected === true) {
                        return (
                            <Chip key={tag.Tag} label={tag.Tag} sx={{ ml: 1 }} onDelete={() => ToggleTagSelect(index)}></Chip>
                        )
                    } else {
                        return (
                            <Chip key={tag.Tag} label={tag.Tag} sx={{ ml: 1 }} variant='outlined' onClick={() => ToggleTagSelect(index)}></Chip>
                        )
                    }
                })
            }
            <br></br>
            <FormControl>
                {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                Sorting:
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={'NameAsc'}
                    onChange={HandleSort}
                >
                    <FormControlLabel value="NameAsc" control={<Radio />} label="Name(Ascending)" />
                    <FormControlLabel value="NameDesc" control={<Radio />} label="Name(Descending)" />
                    <FormControlLabel value="Followers" control={<Radio />} label="Followers" />
                    <FormControlLabel value="Creation" control={<Radio />} label="Creation Date" />
                    {/* <FormControlLabel
                        value="disabled"
                        disabled
                        control={<Radio />}
                        label="other"
                    /> */}
                </RadioGroup>
            </FormControl>
            {
                data && pinging === false ?
                    <Box sx={{
                        display: 'block',
                        height: '80%',
                        overflowY: 'scroll',
                    }}>
                        <Grid container xs={12}>
                            {
                                TagFiltered.map(e => <SubGredditCard key={e.id} data={e} />)
                            }
                        </Grid>
                    </Box> :
                    <CircularProgress />
            }
        </Box>
    )
};

export default MySubGreddits;