import * as React from 'react';
import Alert from '@mui/material/Alert';
import NotifyContext from '../contexts/NotifyContext';
import { Slide, Snackbar } from '@mui/material';


function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function NotifyPane() {
  //   const [open, setOpen] = React.useState(false);
  const { notification, Notify } = React.useContext(NotifyContext)
  const [temp,setTemp] = React.useState()

  React.useEffect(() => {
    if(notification){
      setTemp(notification)
    }else{
      setTimeout(() => setTemp(undefined),1500)
    }
  },[notification])
  // setTimeout(() => {
  //   Notify(undefined)
  // }, 5000)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    Notify(undefined);
  };

  return (
    // <Box position='fixed' sx={{ width: '100%', marginTop: 2, display: 'flex', justifyContent: 'center', top: 0, left: 0, zIndex: '10'}}>
    //   <Collapse in={notification !== undefined}>
    <Snackbar open={notification !== undefined} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
      TransitionComponent={SlideTransition}
    autoHideDuration={1500} onClose={handleClose}>
      <Alert
        severity={(temp && temp.type)}
        color={(temp && temp.type)}
      >
        {(temp && temp.message) || ''}
      </Alert>
    </Snackbar>
    //   </Collapse>
    // </Box>
  );
}