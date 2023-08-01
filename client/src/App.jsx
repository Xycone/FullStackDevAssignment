import './App.css';
import { useState, useEffect } from 'react';
import http from './http';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import CssBaseline from "@mui/material/CssBaseline";
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
import CarItem from './pages/CarItem';
import AddCarItem from './pages/AddCarItem';
import EditCarItem from './pages/EditCarItem';
import CreateBooking from './pages/CreateBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import UserTable from './pages/UserTable';
import UserUpdate from './pages/UserUpdate';
import EnterEmail from './pages/EnterEmail';
import Reset from './pages/Password';
import UpdateUser from './pages/UpdateUser';
import AllFeedback from './pages/AllFeedback';
import ContactUs from './pages/ContactUs';
import Payment from './pages/PaymentRecords';
import AddPayment from './pages/MakePayment';

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { Create } from '@mui/icons-material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    fontFamily: "Comfortaa, sans-serif",
    fontWeightBold: 700,
    fontSize: 20,
  },
  palette: {
    primary: { main: "#FFFFFF" },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
        notbold: {
          fontWeight: "normal",
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const admin = user && user.admin == true;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  Learning
                </Typography>
              </Link>
              <Link to="/cars">
                <Typography>Car Listings(Admin)</Typography>
              </Link>
              <Link to="/viewcars">
                <Typography>Car Listings(User)</Typography>
              </Link>
              <Link to="/reportgen">
                <Typography>Report Generation</Typography>
              </Link>
              <Link to="/feedback">
                <Typography>All feedback</Typography>
              </Link>
              <Link to="/contactus">
                <Typography>Contact Us</Typography>
              </Link>
              <Link to="/payment">
                <Typography>Payment</Typography>
              </Link>
              <Box sx={{ flexGrow: 1 }}></Box>
              {user && (
                <>
                  <Typography>{user.name}</Typography>
                  <Typography>
                    <Button
                      style={{ color: "white", marginLeft: "20px" }}
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </Typography>
                </>
              )}
              {!user && (
                <>
                  <Link to="/login">
                    <Typography>Login</Typography>
                  </Link>
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
            <Route path={"/createbooking/:id"} element={<CreateBooking />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/feedback"} element={<AllFeedback />} />
            <Route path={"/contactus"} element={<ContactUs />} />
            <Route path={"/usertable"} element={<UserTable />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/userprofile"} element={<UserProfile />} />
            <Route path={"/updateuser/:id"} element={<UpdateUser />} />
            <Route path={"/userupdate/:id"} element={<UserUpdate />} />
            <Route path={"/enteremail"} element={<EnterEmail />} />
            <Route path={"/resetpassword/:token"} element={<ResetPassword />} />
            <Route path={"/apayment"} element={<AddPayment />} />
            <Route path={"/payment"} element={<Payment />} />
            <Route path={"/adddiscount"} element={<AddDiscount />} />
              <Route path={"/viewdiscount"} element={<ViewDiscounts />} />
            <Route path="/" element={<Homepage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
