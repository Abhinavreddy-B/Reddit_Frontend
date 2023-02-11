import { CircularProgress, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import MySubGreddits from "./components/MySubGreddits";
import NavBar from "./components/NavBar";
import NotifyPane from "./components/Notify";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import NotifyContext from "./contexts/NotifyContext";
import UserContext from "./contexts/UserContext";
import ServerMethods from "./utils/Communicate";
import SubGreddits from "./components/SubGreddits"
import SingleSubGredditPage from "./components/SingleSubGreddit";
import ManageSubGreddit from "./components/ManageSubGreddit";
import SavedPostsPage from "./components/Saved";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const LightTheme = createTheme()

function App() {
  const [user, setUser] = useState()
  const [notification, Notify] = useState();
  const [deciding, setDeciting] = useState(true)
  const [theme,setTheme] = useState('light')

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem('Greddit:token'))
    
    if (saved) {
      ServerMethods.verifyToken(`Bearer ${saved.token}`).then(() => {
        setUser(saved)
        ServerMethods.setToken(saved)
        setDeciting(false)
      }).catch((err) => {
        Notify({type: 'error',message: 'Something went wrong'})
        setDeciting(false)
      })
    }else{
      setDeciting(false)
    }
  }, [])
  
  useEffect(() => {
    setTheme(window.localStorage.getItem('Greddit:theme') ? window.localStorage.getItem('Greddit:theme')  : 'light')
  },[])

  return (
    <ThemeProvider theme={ theme === 'dark' ? darkTheme: LightTheme}>
      <CssBaseline /> 
      <NotifyContext.Provider value={{ notification, Notify }}>
        <UserContext.Provider value={{ user, setUser }}>
          <BrowserRouter>
            <NotifyPane></NotifyPane>
            <NavBar theme={theme} setTheme={setTheme}></NavBar>
            <Box sx={{ height: '100%' }}>

              {
                deciding === true &&
                <Routes>
                  <Route path="*" element={<CircularProgress />}></Route>
                </Routes>
              }
              {
                deciding === false &&
                <Routes>
                  {
                    !user &&
                    <>
                      <Route exact path='/login' element={<Login></Login>}></Route>
                      <Route exact path="/signup" element={<SignUp></SignUp>}></Route>
                      <Route path='*' element={<Navigate replace to='/login'></Navigate>}></Route>
                    </>
                  }
                  {
                    user &&
                    <>
                      <Route exact path="/profile" element={<Profile></Profile>}></Route>
                      <Route exact path="/saved" element={<SavedPostsPage />}></Route>
                      <Route exact path="/mysubgreddits" element={<MySubGreddits />}></Route>
                      <Route exact path="/subgreddits" element={<SubGreddits />}></Route>
                      <Route exact path="/subgreddit/:id" element={<SingleSubGredditPage />}></Route>
                      <Route exact path="/manage/:id" element={<ManageSubGreddit />}></Route>
                      <Route exact path="*" element={<Navigate replace to='/profile'></Navigate>}></Route>
                    </>
                  }
                </Routes>
              }
            </Box>
          </BrowserRouter>
        </UserContext.Provider>
      </NotifyContext.Provider>
    </ThemeProvider>
  );
}

export default App;
