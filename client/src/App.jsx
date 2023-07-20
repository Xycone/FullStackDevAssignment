import './App.css';
import { useState, useEffect } from 'react';
import http from './http';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
import UserContext from './contexts/UserContext';

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
import Payment from './pages/PaymentRecords';
import AddPayment from './pages/MakePayment';

// theme
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
    palette: {
      primary: {
        main: '#1b5e20',
      },
      secondary: {
        main: '#66bb6a',
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
    <ThemeProvider theme={theme}>
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
                <Link to="/cars" >
                  <Typography>
                    Car Listings(Admin)
                  </Typography>
                </Link>
                <Link to="/apayment" >
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
                <Link to="/rg" >
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
              <Route path={"/cars"} element={<CarListings />} />
              <Route path={"/addcars"} element={<AddCarListings />} />
              <Route path={"/editcars/:id"} element={<EditCarListings />} />
              <Route path={"/viewcars"} element={<ViewCarListings />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/feedback"} element={<AllFeedback />} />
              <Route path={"/contactus"} element={<ContactUs />} />
              <Route path={"/apayment"} element={<AddPayment />} />
              <Route path={"/payment"} element={<Payment />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/usertable"} element={<UserTable />}></Route>
            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;