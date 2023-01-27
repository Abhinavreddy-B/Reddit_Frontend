import { Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMatch } from 'react-router-dom';
import ServerMethods from '../../utils/Communicate';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import NotifyContext from '../../contexts/NotifyContext';

const Row = ({ report, Ignore, Block, DeleteReport }) => {
  const [timer, setTimer] = useState()
  const { Notify } = useContext(NotifyContext)

  let intervalRef = useRef();

  // if(timer !== undefined){
  //   if(timer <= 0){
  //     Block(report.id)
  //     // Block(report.id).then(() => {
  //       setTimer(undefined)
  //     // })
  //   }else{
  //     console.log("timer is",timer,"setting to ",timer-1)
  //     intervalRef.current = setTimeout(() => {setTimer(timer => timer-1)},1000)
  //   }
  // }

  useEffect(() => {
    if(report.id === undefined || Block === undefined){
      return
    }
    if (timer !== undefined) {
      if (timer <= 0) {
        Block(report.id)
        setTimer(undefined)
      } else {
        intervalRef.current = setTimeout(() => { setTimer(timer => timer - 1) }, 1000)
      }
    }
  }, [timer,Block,report])
  // const StartTimer = () => {
  //   intervalRef.current = setInterval(() => {
  //     console.log("Hi",timer)
  //     if(!timer){
  //       setTimer(4)
  //     }
  //     if(timer === 0){
  //       console.log("Blocking")
  //     }
  //     setTimer(timer => timer-1)
  //   }, 1000);
  //   // Ref.current = setInterval(() => {
  //   //   // console.log("Hi",Ref.current.timer)
  //   //   if(timer === 0){
  //   //     console.log("Blocking")
  //   //   }
  //   //   setTimer(timer-1)
  //   // },1000)
  // }

  const AbortBlock = () => {
    console.log("Aborting")
    clearTimeout(intervalRef.current);
    setTimer(undefined)
    Notify({
      type: 'info',
      message: 'Aborted the operation'
    })
  }

  return (
    <TableRow>
      <TableCell align='left' sx={{ flexGrow: 0 }}>{report.ReportedBy.firstName} {report.ReportedBy.lastName}</TableCell>
      <TableCell align="left" sx={{ flexGrow: 0 }}>{report.ReportedOn.firstName} {report.ReportedOn.lastName}</TableCell>
      <TableCell sx={{ flexGrow: 1 / 2 }}>{report.Concern}</TableCell>
      <TableCell align="left" sx={{ flexGrow: 1 / 2 }}>{report.Post.Text}</TableCell>
      <TableCell align="center" sx={{ flexGrow: 0 }}><Button sx={{ width: 'fit-content' }} onClick={timer ? AbortBlock : () => { setTimer(3) }} disabled={report.Ignored}>{timer ? `Cancel in ${timer}` : <BlockIcon />}</Button></TableCell>
      <TableCell align="center" sx={{ flexGrow: 0 }}><Button sx={{ width: 'fit-content' }} onClick={() => DeleteReport(report.id, report.Post.id)} disabled={report.Ignored}><DeleteIcon /></Button></TableCell>
      <TableCell align="center" sx={{ flexGrow: 0 }}><Button sx={{ width: 'fit-content' }} onClick={() => Ignore(report.id)}><CallMissedOutgoingIcon /></Button></TableCell>
    </TableRow>
  )
}
const Reports = () => {
  const [reports, setReports] = useState()

  const match = useMatch('/manage/:id')
  const SubGredditId = match.params.id

  useEffect(() => {
    if (!SubGredditId) {
      return;
    }
    ServerMethods.GetReports(SubGredditId).then(res => {
      setReports(res)
    })
  }, [SubGredditId])

  const { Notify } = useContext(NotifyContext)

  const HandleIgnore = async (id) => {
    try {
      await ServerMethods.IgnoreReport(id)
      setReports(reports.map(f => f.id === id ? { ...f, Ignored: true } : f))
      Notify({
        type: 'success',
        message: 'Report Ignored'
      })
    } catch (e) {
      console.log(e)
      Notify({
        type: 'error',
        message: e.response.data.error
      })
    }
  }

  const HandleBlock = async (id) => {
    console.log("Blocking")
    try {
      await ServerMethods.BlockReport(id)
      // setReports(reports.map(f => f.id === id? {...f,Ignored: true} : f))
      Notify({
        type: 'success',
        message: 'Blocked User'
      })
    } catch (e) {
      console.log(e)
      Notify({
        type: 'error',
        message: e.response.data.error
      })
    }
  }

  const HandleDelete = async (id, PostId) => {
    try {
      await ServerMethods.DeleteReport(id)
      console.log(PostId)
      setReports(reports.filter(f => f.Post.id !== PostId))
      Notify({
        type: 'success',
        message: 'Deleted Post'
      })
    } catch (e) {
      console.log(e)
      Notify({
        type: 'error',
        message: e.response.data.error
      })
    }
  }
  if (!reports) {
    return (
      <CircularProgress />
    )
  }

  return (
    <Box sx={{ display: 'flex', mt: 4, flexDirection: 'row', justifyContent: 'center' }}>
      <TableContainer component={Paper} sx={{ width: { md: '70%', xs: '95%' }, maxHeight: '75vh' }} elevation={5}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ flexGrow: 0 }}>Reported By</TableCell>
              <TableCell align="left" sx={{ flexGrow: 0 }}>Abuser</TableCell>
              <TableCell sx={{ flexGrow: 1 / 2 }}>Concern</TableCell>
              <TableCell align="left" sx={{ flexGrow: 1 / 2 }}>Post</TableCell>
              <TableCell align="center" sx={{ flexGrow: 0 }}>Block</TableCell>
              <TableCell align="center" sx={{ flexGrow: 0 }}>Delete</TableCell>
              <TableCell align="center" sx={{ flexGrow: 0 }}>Ignore</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((row) => (
              <Row key={row.id} report={row} Ignore={HandleIgnore} Block={HandleBlock} DeleteReport={HandleDelete} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Reports;