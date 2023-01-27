import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useState } from 'react';
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import ServerMethods from '../utils/Communicate';
import AdjustIcon from '@mui/icons-material/Adjust';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { DarkMode, LightMode } from '@mui/icons-material';

function NavBar({theme,setTheme}) {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const settings = [{
    name: 'Profile',
    action: () => {handleCloseUserMenu(); navigate('/profile')},
    icon: ManageAccountsIcon
  }, {
    name: 'Log Out',
    action: logout,
    icon: LogoutIcon
  }];

  const pages = [{
    name: 'My Sub Greddiits',
    action: () => navigate('/mysubgreddits'),
    icon: AdjustIcon
  }, {
    name: 'All Sub Greddits',
    action: () => navigate('/subgreddits'),
    icon: EqualizerIcon
  },{
    name: 'Saved',
    action: () => navigate('/saved'),
    icon: BookmarkIcon
  }];

  function logout() {
    handleCloseUserMenu()
    window.localStorage.removeItem('Greddit:token')
    setUser(undefined)
    ServerMethods.resetToken()
    navigate('/login')
  }

  const toggleTheme = () => {
    if(theme === 'light'){
      window.localStorage.setItem('Greddit:theme','dark')
      setTheme('dark')
    }else{
      window.localStorage.setItem('Greddit:theme','light')
      setTheme('light')
    }
  }

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <AppBar position="sticky" sx={{ zIndex: '5' }}>
      <Container >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Greddit
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={page.action}>
                  <Box>
                    <page.icon />
                    <Typography textAlign="center">{page.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Greddit
          </Typography>
          <Box sx={{flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={page.action}
                sx={{ color: 'white', display: 'block',margin: 0,padding: 0,ml: 2 }}
              >
                <Box>
                  <page.icon sx={{height: 10}} />
                  <Typography textAlign="center" sx={{fontSize: 11}}>{page.name}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
          {
            user &&
            <Box sx={{ flexGrow: 0 }}>
              <Button onClick={toggleTheme}>
                {theme === 'light' ? <DarkMode sx={{color: 'black'}} /> : <LightMode sx={{color: 'white'}}/>}      
              </Button>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" >
                    {/* <PersonRoundedIcon /> */}
                    {user.Name[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={setting.action}>
                    <Typography textAlign="center"><setting.icon /> {setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;