import './App.css';
import { useState, useEffect } from 'react';
import http from './http';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
from 'react-router-dom';

import Discounts from './pages/Discounts';
import AddDiscount from './pages/AddDiscount'
import EditDiscount from './pages/EditDiscount'
import ViewDiscounts from './pages/UserDiscounts'
import CarListings from './pages/CarListings';
import AddCarListings from './pages/AddCarListings';
import EditCarListings from './pages/EditCarListings';
import ViewCarListings from './pages/ViewCarListings';
import Login from './pages/Login';
import Register from './pages/Register';
import UserTable from './pages/UserTable';
import UpdateUser from './pages/UpdateUser';
import AllFeedback from './pages/AllFeedback';
import ContactUs from './pages/ContactUs';


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
                Rental
              </Typography>
            </Link>
            <Link to="/cars" >
              <Typography>
                Car Listings(Admin)
              </Typography>
            </Link>
            <Link to="/viewcars" >
              <Typography>
                Car Listing(User)
              </Typography>
            </Link>
            <Link to="/feedback" >
              <Typography>
                All feedback
              </Typography>
            </Link>
            <Link to="/contactus" >
              <Typography>
                Contact Us
              </Typography>
            </Link>
            <Link to="/usertable" >
              <Typography>
                User Table
              </Typography>
            </Link>
            <Link to="/discounts" >
              <Typography>
                Discounts
              </Typography>
            </Link>
            <Link to="/discountsview" >
              <Typography>
                Discounts (user view)
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
        <Route path={"/discounts"} element={<Discounts/>} />
        <Route path={"/adddiscount"} element={<AddDiscount/>} />
        <Route path={"/editdiscount/:id"} element={<EditDiscount/>} />
        <Route path={"/discountsview"} element={<ViewDiscounts/>} />

          <Route path={"/cars"} element={<CarListings />} />
          <Route path={"/addcars"} element={<AddCarListings /> }/>
          <Route path={"/editcars/:id"} element={<EditCarListings />} />
          <Route path={"/viewcars"} element={<ViewCarListings />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/feedback"} element={<AllFeedback />}/>
          <Route path={"/contactus"} element={<ContactUs />}/>
          <Route path={"/usertable"} element={<UserTable />} />
          <Route path={"/updateuser/:id"} element={<UpdateUser />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;