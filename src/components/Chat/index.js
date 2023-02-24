import { Avatar, Chip, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import NotifyContext from '../../contexts/NotifyContext';
import UserContext from '../../contexts/UserContext';
import { BaseUrl } from '../../utils/Communicate';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

const Chat = () => {
    const { user } = useContext(UserContext)
    const [socket, Setsocket] = useState()
    const [messages, setMessages] = useState([])

    const { Notify } = useContext(NotifyContext)
    const match = useMatch('/chat/:id')
    const OtherId = match.params.id

    const navigate = useNavigate()

    useEffect(() => {
        if (!OtherId) {
            return;
        }
        const s = io(`${BaseUrl}/`, { query: { token: user.token, ChatWith: OtherId } })
        Setsocket(s)
        return () => {
            s.disconnect()
        }
    }, [user, OtherId])

    const handleNewMessage = () => {
        if(document.querySelector('#newmessage-input').value==='' || document.querySelector('#newmessage-input').value===undefined || document.querySelector('#newmessage-input').value===null){
            return ;
        }
        const mesg = document.querySelector('#newmessage-input').value
        document.querySelector('#newmessage-input').value = null
        socket.emit('send', mesg)
        setMessages([...messages, { mesg: mesg, me: true }])
    }
    useEffect(() => {
        if (!socket || !Notify || !navigate) {
            return
        }
        socket.on('load_history', data => {
            setMessages(data.map(m => {
                return {mesg: m.mesg,me: (m.By === user.id.toString())}
            }))
        })
        socket.on('client_disconnect', data => {
            Notify({
                type: 'error',
                message: data.error
            })
            socket.disconnect()
            navigate('/profile')
        })

        socket.on('receive', (newMessage) => {
            setMessages([...messages, { mesg: newMessage, me: false }])
        })
    }, [socket, Notify, messages,user,navigate])

    useEffect(() => {
        const scrollBox = document.getElementById('scrollBox')
        scrollBox.scrollTop = scrollBox.scrollHeight
    },[messages])
    return (
        <Box style={{ padding: 30, width: '100%', minHeight: '90vh', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
            <Box style={{height: '70vh',overflowY: 'scroll'}} id='scrollBox'>
            {
                messages.map((m, index) => <Box key={index} style={{ margin: 10, textAlign: m.me === true ? 'right' : 'left' }}>
                    {
                        m.me === false &&
                        <Box
                        style={{ display: 'inline-block',marginRight: 5 }}
                        >

                            <Avatar
                                sx={{ width: 30, height: 30 }}

                                >
                                <PersonIcon />
                                </Avatar>
                        </Box>
                    }
                    <Chip label={m.mesg} />
                </Box>)
            }
            </Box>
            <FormControl sx={{ width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Message</InputLabel>
                <OutlinedInput
                    id="newmessage-input"
                    placeholder='Message....'
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleNewMessage}
                                edge="end"
                            >
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>
        </Box>
    );
};

export default Chat;