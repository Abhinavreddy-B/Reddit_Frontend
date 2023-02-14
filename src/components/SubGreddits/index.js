import { Chip, CircularProgress, FormControl, FormControlLabel, FormGroup, Grid, Paper, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import ServerMethods from '../../utils/Communicate';
import SubGredditCard from './SubGredditCard';

const MySubGreddits = () => {
    const [data, setData] = useState()
    const [pinging, setPinging] = useState(false)
    const [search, setSearch] = useState()
    const [Tags, setTags] = useState()
    const [UserSubGreddits, setUserSubGredits] = useState()
    const [fuzzy, setFuzzy] = useState(false)
    const [Page, setPage] = useState(1)
    const [NoOfPages, setNoOfPages] = useState(1)
    const [sort, setSort] = useState('NameAsc')
    const [LoadingNew, setLoadingNew] = useState(false)


    const TagRef = useRef()
    const SearchRef = useRef()
    const FuzzyRef = useRef()
    const SortRef = useRef()
    const DataRef = useRef()
    const PageRef = useRef()
    const LoadingNewRef = useRef()
    const PingingRef = useRef()


    TagRef.current = Tags
    SearchRef.current = search
    FuzzyRef.current = fuzzy
    SortRef.current = sort
    DataRef.current = data
    PageRef.current = Page
    LoadingNewRef.current = LoadingNew
    PingingRef.current = pinging


    // Inital loading, loading tags , loading inital data
    useEffect(() => {
        ServerMethods.GetAllSubGreddits().then((response) => {
            setData(response.items)
            setNoOfPages(response.totalPages)
        })
        ServerMethods.GetJoinedSubGreddits().then((response) => {
            setUserSubGredits(response)
        })
        ServerMethods.GetAllTags().then((response) => {
            console.log("Hey", response)
            setTags(response.map(e => { return { Tag: e, selected: false } }))
        }).catch((e) => {
            console.log(e)
        })
    }, [])


    // Ping server when any of search, selected tags, fuzzy(enable/disable) , sort option changes
    useEffect(() => {
        if (!Tags) {
            return;
        }
        setPinging(true)
        setPage(1)
        ServerMethods.GetAllSubGreddits({
            search,
            Tags: Tags.filter(m => m.selected === true).map(m => m.Tag),
            sort,
            fuzzy,
            page: 1,
        }).then(res => {
            console.log(res)
            setNoOfPages(res.totalPages)
            setData(res.items)
            setPinging(false)
        })
    }, [search, Tags, fuzzy, sort])


    // Ping server for new data (on reaching end of page)
    useEffect(() => {
        if (!TagRef.current || !DataRef.current) {
            return;
        }
        setLoadingNew(true)
        ServerMethods.GetAllSubGreddits({
            search: SearchRef.current,
            Tags: TagRef.current.filter(m => m.selected === true).map(m => m.Tag),
            sort: SortRef.current,
            fuzzy: FuzzyRef.current,
            page: Page,
        }).then(res => {
            console.log(res)
            setNoOfPages(res.totalPages)
            setData(DataRef.current.concat(res.items))
            setLoadingNew(false)
        })
    }, [Page])

    // change page number on reaching end of scrolling, changes whenever NoOfPages changes
    useEffect(() => {
        if(!DataRef.current){
            return;
        }
        const handleScroll = () => {
            if(!DataRef.current || PingingRef.current === true || LoadingNewRef.current === true){
                return
            }
            const windowHeight = document.body.scrollHeight-document.body.clientHeight
            const scrolledDistance = window.scrollY
            console.log(document.body.scrollHeight-document.body.clientHeight,window.scrollY)
            if (windowHeight - scrolledDistance < 1 && LoadingNewRef.current !== true) {
                if(PageRef.current < NoOfPages){
                    setPage(PageRef.current + 1)
                    console.log("Scrolling")
                }
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [NoOfPages])

    const HandleSort = (event) => {
        setSort(event.target.value)
    }

    const handleLeave = async (id) => {
        try {
            await ServerMethods.LeaveSubGreddit(id)
            setUserSubGredits(UserSubGreddits.map(f => f.id.id !== id ? f : { ...f, role: 'left' }))
        } catch (e) {
            console.log(e)
        }
    }

    if (!data || !Tags) {
        return (
            <Box>
                <h1>All SubGreddits:</h1>
                <CircularProgress />
            </Box>
        )
    }


    const ToggleTagSelect = (index) => {
        setTags(Tags.map((e, i) => {
            if (i === index) {
                return { ...e, selected: !e.selected }
            } else {
                return e
            }
        }))
    }


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
            <Paper style={{ width: 'fit-content', padding: 5 }}>
                <Typography sx={{ fontSize: 22, textAlign: 'center' }}>Scroll to see Infinite Loading</Typography>
                {/* <Button onClick={() => setPage(Page - 1)} disabled={Page === 1} style={{ display: 'inline-block' }}>-</Button> */}
                {/* <Typography style={{ display: 'inline-block' }}>{Page}/{NoOfPages}</Typography> */}
                {/* <Button onClick={() => setPage(Page + 1)} disabled={Page === NoOfPages} style={{ display: 'inline-block' }}>+</Button> */}
            </Paper>
            {
                data && pinging === false ?
                    <Box sx={{
                        display: 'block',
                    }}>
                        <Grid container>
                            {
                                data.map(e => <SubGredditCard handleLeave={handleLeave} key={e.id} data={e} UserSubGreddits={UserSubGreddits} />)
                            }
                        </Grid>
                    </Box> :
                    <Box>
                        <CircularProgress />
                    </Box>
            }
            {
                LoadingNew === true &&
                <Box>
                    <CircularProgress />
                </Box>
            }
            {
                LoadingNew === false && Page === NoOfPages &&
                <Typography style={{textAlign: 'center'}}>End of Records</Typography>
            }
        </Box>
    )
};

export default MySubGreddits;