import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import NotifyContext from '../contexts/NotifyContext';

export default function NotifyPane() {
//   const [open, setOpen] = React.useState(false);

  const {notification,Notify} = React.useContext(NotifyContext)

  setTimeout(() => {
    Notify(undefined)
  },3000)

  return (
    <Box position='fixed' sx={{ width: '100%', marginTop: 2, display: 'flex', justifyContent: 'center', top: 0, left: 0, zIndex: '10'}}>
      <Collapse in={notification !== undefined}>
        <Alert
          sx={{ mb: 2 }}
          severity={(notification && notification.type) || 'error'}
        >
          {(notification && notification.message) || ''}
        </Alert>
      </Collapse>
    </Box>
  );
}