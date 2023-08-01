import './App.css';
import { useState, useEffect } from 'react';
import http from './http';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";
import UserContext from './contexts/UserContext';

import Discounts from './pages/Discounts';
import AddDiscount from './pages/AddDiscount'
import EditDiscount from './pages/EditDiscount'
import ViewDiscounts from './pages/UserDiscounts'
import CarListings from './pages/CarListings';
import AddCarListings from './pages/AddCarListings';
import EditCarListings from './pages/EditCarListings';
import ViewCarListings from './pages/ViewCarListings';
import CarItem from './pages/CarItem';
import AddCarItem from './pages/AddCarItem';
import EditCarItem from './pages/EditCarItem';
import CreateBooking from './pages/CreateBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import UserTable from './pages/UserTable';
import UpdateUser from './pages/UpdateUser';
import AllFeedback from './pages/AllFeedback';
import ContactUs from './pages/ContactUs';
import PaymentRecords from './pages/PaymentRecords';
import StripePayment from './pages/StripePayment';
import Success from './pages/Success';

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';

const materialTheme = materialExtendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#F5F5F5',
        },
        primary: {
          main: '#1b5e20',
        },
        secondary: {
          main: '#66bb6a',
        },
      },
    },
  },
});


function App() {

  const [user, setUser] = useState(null);
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Learning
                  </Typography>
                </Link>
                <Link to="/listings" >
                  <Typography>
                    Car Listings(Admin)
                  </Typography>
                </Link>
                <Link to="/viewlistings" >
                  <Typography>
                    Car Listings(User)
                  </Typography>
                </Link>
                <Link to="/sp" >
                  <Typography>
                    Checkout
                  </Typography>
                </Link>
                <Link to="/usertable" >
                  <Typography>
                    User Table
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
                <Link to="/report" >
                  <Typography>
                    Report
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Typography>
                      <Button style={{ color: "white", marginLeft: "20px" }} onClick={logout}>Logout</Button>
                    </Typography>
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
              <Route path={"/listings"} element={<CarListings />} />
              <Route path={"/addlistings"} element={<AddCarListings />} />
              <Route path={"/editlistings/:id"} element={<EditCarListings />} />
              <Route path={"/viewlistings"} element={<ViewCarListings />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/feedback"} element={<AllFeedback />} />
              <Route path={"/contactus"} element={<ContactUs />} />
              <Route path={"/sp"} element={<StripePayment />} />
              <Route path={"/paymentrecords"} element={<PaymentRecords />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/usertable"} element={<UserTable />}/>
              <Route path={"/createbooking/:id"} element={<CreateBooking />}/>
              <Route path={"/updateuser"} element={<UpdateUser />}/>
              <Route path={"/caritem"} element={<CarItem />}/>
              <Route path={"/addcars"} element={<AddCarItem />}/>
              <Route path={"/editcars"} element={<EditCarItem />}/>
              <Route path={"/success"} element={<Success />}/>
              <Route path={"/discounts"} element={<Discounts />}/>
              <Route path={"/adddiscount"} element={<AddDiscount />}/>
              <Route path={"/editdiscount"} element={<EditDiscount />}/>
              <Route path={"/viewdiscounts"} element={<ViewDiscounts />}/>
            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </MaterialCssVarsProvider>
  );
}

export default App;