import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import NotifyPane from "./components/Notify";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import NotifyContext from "./contexts/NotifyContext";
import UserContext from "./contexts/UserContext";
import ServerMethods from "./utils/Communicate";


function App() {
  const [user, setUser] = useState()
  const [notification, Notify] = useState();

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem('Greddit:token'))
    if (saved) {
      setUser(saved)
      ServerMethods.setToken(saved)
    }
  }, [])
  return (
    <NotifyContext.Provider value={{ notification, Notify }}>
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <NotifyPane></NotifyPane>
          <NavBar></NavBar>
          <Routes>
            {
              !user &&
              <>
                <Route exact path='/login' element={<Login></Login>}></Route>
                <Route exact path="/signup" element={<SignUp></SignUp>}></Route>
              </>
            }
            {
              !user &&
              <Route path='*' element={<Navigate replace to='/login'></Navigate>}></Route>
            }
            {
              user &&
              <>
                <Route exact path="/profile" element={<Profile></Profile>}></Route>
                <Route path="*" element={<Navigate replace to='/profile'></Navigate>}></Route>
              </>
            }
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </NotifyContext.Provider>
  );
}

export default App;
