import "./App.css";
import { useState, useEffect } from "react";
import http from "./http";
import {
  Menu,
  MenuItem,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserContext from "./contexts/UserContext";

import Discounts from "./pages/Discounts";
import AddDiscount from "./pages/AddDiscount";
import EditDiscount from "./pages/EditDiscount";
import ViewDiscounts from "./pages/UserDiscounts";
import CarListings from "./pages/CarListings";
import AddCarListings from "./pages/AddCarListings";
import EditCarListings from "./pages/EditCarListings";
import ViewCarListings from "./pages/ViewCarListings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserTable from "./pages/UserTable";
import UpdateUser from "./pages/UpdateUser";
import AllFeedback from "./pages/AllFeedback";
import ContactUs from "./pages/ContactUs";
import Payment from "./pages/Payment";
import ReportGen from "./pages/ReportGeneration";
import Homepage from "./pages/Homepage";
import UserProfile from "./pages/UserProfile";
import UserUpdate from "./pages/UserUpdate";
import EnterEmail from "./pages/EnterEmail";
import ResetPassword from "./pages/ResetPassword";
import homepage_img from "./images/homepage_img.png";
// theme
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Comfortaa, sans-serif",
    fontWeightBold: 700,
    fontSize: 20
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
            <Toolbar>
      <Link to="/">
        <Typography variant="h6" component="div">
          Rental
        </Typography>
      </Link>
      {admin && (
        <>
          <Button
            aria-controls="management-menu"
            aria-haspopup="true"
            onClick={handleClick}

            sx={{
              textTransform: "none",
            }}
          >
            <Typography sx={{color: "red"}}>Management</Typography>
          </Button>
          <Menu
            id="management-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/cars" onClick={handleClose}>
              Car Listings (Admin)
            </MenuItem>
            <MenuItem component={Link} to="/reportgen" onClick={handleClose}>
              Report Generation
            </MenuItem>
            <MenuItem component={Link} to="/feedback" onClick={handleClose}>
              All feedback
            </MenuItem>
            <MenuItem component={Link} to="/usertable" onClick={handleClose}>
              User Table
            </MenuItem>
          </Menu>
        </>
      )}
      <Link to="/viewcars">
        <Typography>Car Listings (User)</Typography>
      </Link>
      {user && (
        <>
          <Link to="/contactus">
            <Typography>Contact Us</Typography>
          </Link>
          <Link to="/payment">
            <Typography>Payment</Typography>
          </Link>
          <Box
          sx={{ flexGrow: 1, textAlign: "right", marginTop: "4vh" }}>
          <Link to="/userprofile">
            <Typography>{user.name}</Typography>
          </Link>
          </Box>
        </>
      )}
      {!user && (
        <>
          <Button
            component={Link}
            to="/login"
            style={{
              backgroundColor: "#50C878",
              color: "white",
              width: "6rem",
              height: "2.5em",
              borderRadius: "0.5rem",
              paddingLeft: "20wh",
            }}
          >
            <Typography sx={{ textTransform: "none" }}>Login</Typography>
          </Button>
        </>
      )}
      <Box sx={{ flexGrow: 1 }}></Box>
    </Toolbar>
          </Container>
        </AppBar>
        <Routes>
          <Route path={"/cars"} element={<CarListings />} />
          <Route path={"/addcars"} element={<AddCarListings />} />
          <Route path={"/editcars/:id"} element={<EditCarListings />} />
          <Route path={"/viewcars"} element={<ViewCarListings />} />
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
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
