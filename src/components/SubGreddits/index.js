import { Chip, CircularProgress, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import ServerMethods from '../../utils/Communicate';
import SubGredditCard from './SubGredditCard';
import Fuse from 'fuse.js'

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
    const [UserSubGreddits, setUserSubGredits] = useState()
    const [fuzzy, setFuzzy] = useState(false)

    useEffect(() => {
        setPinging(true)
        ServerMethods.GetAllSubGreddits().then((response) => {
            setData(response.slice().sort(NameAscCmp))
            const tagArrays = response.map(e => e.Tags)
            let tags = []
            tagArrays.forEach(arr => {
                tags = [...new Set([...tags, ...arr])]
            })
            setTags(tags.map(e => { return { Tag: e, selected: false } }))
            setPinging(false)
        })
        ServerMethods.GetJoinedSubGreddits().then((response) => {
            setUserSubGredits(response)
        })
    }, [])

    const JoinedCmp = (a, b) => {
        const f1 = UserSubGreddits.find(p => p.id.id === a.id)
        const f2 = UserSubGreddits.find(p => p.id.id === b.id)
        const e1 = f1 && f1.role !== 'left'
        const e2 = f2 && f2.role !== 'left'

        if (e1 && !e2) {
            return -1
        } else if (!e1 && e2) {
            return 1
        }
        return 0
    }
    const FuzzyCmp = (a, b) => {
        if (a.refIndex < b.refIndex) {
            return -1
        } else if (a.refIndex > b.refIndex) {
            return 1
        }
        return 0
    }

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

    const handleLeave = async (id) => {
        try {
            await ServerMethods.LeaveSubGreddit(id)
            setUserSubGredits(UserSubGreddits.map(f => f.id.id !== id ? f : { ...f, role: 'left' }))
        } catch (e) {
            console.log(e)
        }
    }

    if (!UserSubGreddits || !data || pinging === true) {
        return (
            <>
                <h1>Your SubGreddits:</h1>
                <CircularProgress />
            </>
        )
    }

    if (!data) {
        return (
            <Box>
                <h1>All SubGreddits:</h1>
                <CircularProgress />
            </Box>
        )
    }
    // const FilteredData = data ? ((search !== undefined && search !== '' && search !== null) ? data.filter(f => f.Name.toLowerCase().includes(search.toLowerCase())) : data) : []
    const fuse = new Fuse(data, {
        keys: ['Name']
    })

    const FilteredData = (search !== undefined && search !== '' && search !== null) ? (fuzzy? fuse.search(search) : data.filter(f => f.Name.toLowerCase().includes(search.toLowerCase())).map(f => {return {item: f,refIndex: 1}})) : data.map(f => { return { item: f, refIndex: 1 } })

    const TagFiltered = FilteredData ? (Tags.filter(t => t.selected === true).length > 0 ? FilteredData.filter(fdat => {
        for (let i = 0; i < Tags.length; i++) {
            if (Tags[i].selected === true && fdat.item.Tags.find(val => val === Tags[i].Tag)) {
                return true;
            }
        }
        return false;
    }) : FilteredData) : []
    
    console.log("Hi", TagFiltered)
    const FuzzyData = TagFiltered.slice().sort(FuzzyCmp).map(f => f.item)
    const SortedData = UserSubGreddits ? FuzzyData.slice().sort(JoinedCmp) : TagFiltered.slice()
    

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
        <Box sx={{ px: 2 }}>
            <h1>All SubGreddits:</h1>
            <FormGroup onChange={() => setFuzzy(!fuzzy)}>
                <FormControlLabel control={<Switch />} label="Fuzzy Search" />
            </FormGroup>
            <br></br>
            <TextField id="outlined-basic" sx={{ width: { md: '40%', xs: '95%' }, mb: 2 }} label="Search" variant="outlined" value={search} onChange={(event) => setSearch(event.target.value)}

            />
            <br></br>
            <Typography component='h2' sx={{ fontSize: 22 }}> Filters: </Typography>
            {
                Tags.length >= 1 &&
                Tags.sort((a, b) => {
                    if (a.selected === true && b.selected === false) {
                        return -1
                    } else if (a.selected === false && b.selected === true) {
                        return 1
                    }
                    if (a.Tag < b.Tag) {
                        return -1
                    } else {
                        return 1
                    }
                }).map((tag, index) => {
                    if (tag.selected === true) {
                        return (
                            <Chip key={tag.Tag} label={tag.Tag} sx={{ ml: 1, mt: 1 }} onDelete={() => ToggleTagSelect(index)}></Chip>
                        )
                    } else {
                        return (
                            <Chip key={tag.Tag} label={tag.Tag} sx={{ ml: 1, mt: 1 }} variant='outlined' onClick={() => ToggleTagSelect(index)}></Chip>
                        )
                    }
                })
            }
            <br></br>
            <br></br>
            <FormControl>
                {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                <Typography sx={{ display: 'inline-block', fontSize: 22 }}>Sorting:</Typography>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={'NameAsc'}
                    onChange={HandleSort}
                    sx={{ display: 'inline-block' }}
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
                    }}>
                        <Grid container>
                            {
                                SortedData.map(e => <SubGredditCard handleLeave={handleLeave} key={e.id} data={e} UserSubGreddits={UserSubGreddits} />)
                            }
                        </Grid>
                    </Box> :
                    <CircularProgress />
            }
        </Box>
    )
};

export default MySubGreddits;