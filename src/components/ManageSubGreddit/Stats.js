import React, { useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';
import ServerMethods from '../../utils/Communicate';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, BarElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
import { Grid, Paper } from '@mui/material';
ChartJS.register(
    Title, Tooltip, BarElement, Legend,
    CategoryScale, LinearScale, PointElement, Filler
)

function ChartPlot(params) {

    // console.log("entry", params)

    const data = {
        title: {
            text: params.title
        },
        labels: params.labels,
        datasets: [
            {
                data: params.data,
                tension: 0,
                fill: true,
                pointBorderColor: '#00000090',
                pointBackgroundColor: '#00000090',
                showLine: true,
                radius: 0.5,
                borderColor: "#000000",
                linecolor: "black",
            },
        ]
    }
    const options = {
        plugins: {
            title: {
                display: true,
                text: params.title,
                padding: 15,
                font: {
                    size: 20
                }
            },
            legend: {
                display: false
            }
        },
        maintainAspectRatio: true
    }

    options.scales = null;


    return (
        <Bar data={data} options={options} ></Bar>
    );
}



const Stats = () => {

    const match = useMatch('/manage/:id')
    const SubGredditId = match.params.id

    const [Growth, setGrowth] = useState()
    const [PostVsDate,setPostVsDate] = useState()
    const [VisitorsVsDate,setVisitorsVsDate] = useState()
    const [ReportedVsDeleted,setReportedVsDeleted] = useState()


    useEffect(() => {
        if (!SubGredditId) {
            return;
        }
        ServerMethods.GetStatsGrowth(SubGredditId).then(res => {
            setGrowth(res)
        })
    }, [SubGredditId])

    useEffect(() => {
        if (!SubGredditId) {
            return;
        }
        ServerMethods.GetPostVsDate(SubGredditId).then(res => {
            setPostVsDate(res)
        })
    }, [SubGredditId])

    useEffect(() => {
        if (!SubGredditId) {
            return;
        }
        ServerMethods.GetVisitorsVsDate(SubGredditId).then(res => {
            setVisitorsVsDate(res)
        })
    }, [SubGredditId])

    useEffect(() => {
        if (!SubGredditId) {
            return;
        }
        ServerMethods.GetReporedVsDeleted(SubGredditId).then(res => {
            setReportedVsDeleted(res)
        })
    }, [SubGredditId])
    // const config = {
    //     type: 'bar',
    //     data: {
    //         labels: Growth.map(f => f[0]),
    //         dataset: [{
    //             data: Growth.map(f => f[1])
    //         }]
    //     },
    //     options: {
    //       scales: {
    //         y: {
    //           beginAtZero: true
    //         }
    //       }
    //     },
    //   };
    if (Growth === undefined || PostVsDate === undefined || VisitorsVsDate === undefined || ReportedVsDeleted === undefined) {
        return <></>
    }

    return (
        // <GrowthChart chartData={{
        //     labels: Growth.map(f => f[0]),
        //     dataset: [{
        //         label: 'Hi',
        //         data: Growth.map(f => f[1])
        //     }]
        // }} />
        <Grid container>
            <Grid item md={6} lg={4} xs={12} sx={{p: 2}}>
                <Paper sx={{ backgroundColor: 'white' }}>
                    <ChartPlot labels={Growth.map(f => f[0])} title="Growth of the sub greddiit" data={Growth.map(f => f[1])}></ChartPlot>
                </Paper>
            </Grid>
            <Grid item md={6} lg={4} xs={12} sx={{p: 2}}>
                <Paper sx={{ backgroundColor: 'white' }}>
                    <ChartPlot labels={PostVsDate.map(f => f[0])} title="daily posts vs date" data={PostVsDate.map(f => f[1])}></ChartPlot>
                </Paper>
            </Grid>
            <Grid item md={6} lg={4} xs={12} sx={{p: 2}}>
                <Paper sx={{ backgroundColor: 'white' }}>
                    <ChartPlot labels={VisitorsVsDate.map(f => f[0])} title="Number of daily visitors vs date" data={VisitorsVsDate.map(f => f[1])}></ChartPlot>
                </Paper>
            </Grid>
            <Grid item md={6} lg={4} xs={12} sx={{p: 2}}>
                <Paper sx={{ backgroundColor: 'white' }}>
                    <ChartPlot labels={ReportedVsDeleted.map(f => f[0])} title="reported posts vs actually deleted posts" data={ReportedVsDeleted.map(f => f[1])}></ChartPlot>
                </Paper>
            </Grid>
        </Grid>

    );
};

export default Stats;