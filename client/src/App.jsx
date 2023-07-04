import './App.css';
import { useState, useEffect } from 'react';
import http from './http';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
from 'react-router-dom';

import CarListings from './pages/CarListings';
import AddCarListings from './pages/AddCarListings';
import EditCarListings from './pages/EditCarListings';
import Login from './pages/Login';
import Register from './pages/Register';
import UserTable from './pages/UserTable';
import UpdateUser from './pages/UpdateUser';

function App() {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    // if (localStorage.getItem("accessToken")) {
    //   http.get('/user/auth').then((res) => {
    //     setUser(res.data.user);
    //     });
    // }
  }, []);
  const logout = () => {
    localStorage.clear();
    window.location = "/";
    };
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true}>
            <Link to="/">
              <Typography variant="h6" component="div">
                Learning
              </Typography>
            </Link>
            <Link to="/cars" >
              <Typography>
                Car Listings
              </Typography>
            </Link>
            <Link to="/usertable" >
              <Typography>
                User Table
              </Typography>
            </Link>
            <Box sx={{ flexGrow: 1 }}></Box>
              {user && (
                <>
                  <Typography>{user.name}</Typography>
                  <Button onClick={logout}>Logout</Button>
                </>
              )
              }
              {!user && (
                <>
                  <Link to="/login" ><Typography>Login</Typography></Link>
                </>
              )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/cars"} element={<CarListings />} />
          <Route path={"/addcars"} element={<AddCarListings /> }/>
          <Route path={"/editcars/:id"} element={<EditCarListings />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/usertable"} element={<UserTable />} />
          <Route path={"/updateuser/:id"} element={<UpdateUser />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;