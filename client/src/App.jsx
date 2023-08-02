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
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
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
import CarItem from "./pages/CarItem";
import AddCarItem from "./pages/AddCarItem";
import EditCarItem from "./pages/EditCarItem";
import CreateBooking from "./pages/CreateBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserTable from "./pages/UserTable";
import UserUpdate from "./pages/UserUpdate";
import UserProfile from "./pages/UserProfile";
import EnterEmail from "./pages/EnterEmail";
import ResetPassword from "./pages/ResetPassword";
import UpdateUser from "./pages/UpdateUser";
import Homepage from "./pages/Homepage";
import AllFeedback from "./pages/AllFeedback";
import ContactUs from "./pages/ContactUs";
import Payment from "./pages/ReportsDetails";
import AddPayment from "./pages/MakePayment";
import PaymentPage from "./pages/PaymentPage";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import EditDiscounts from "./pages/EditDiscount";
const materialTheme = materialExtendTheme({
  typography: {
    fontFamily: "Comfortaa, sans-serif",
    fontWeightBold: 700,
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#FAFAFA",
        },
        primary: {
          main: "#1b5e20",
        },
        secondary: {
          main: "#66bb6a",
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const logout = () => {
    s
    localStorage.clear();
    window.location = "/";
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
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
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
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
                  <div>
                    <Button onClick={handleMenuOpen} style={{ color: "red" }}>
                      <Typography sx={{ textTransform: "none" }}>
                        Management
                      </Typography>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <Link
                        to="/cars"
                        style={{ textDecoration: "none", color: "grey" }}
                      >
                        <MenuItem onClick={handleMenuClose}>
                          <Typography>Cars</Typography>
                        </MenuItem>
                      </Link>

                      <Link
                        to="/listings"
                        style={{ textDecoration: "none", color: "grey" }}
                      >
                        <MenuItem onClick={handleMenuClose}>
                          <Typography>Listings</Typography>
                        </MenuItem>
                      </Link>

                      <Link
                        to="/discounts"
                        style={{ textDecoration: "none", color: "grey" }}
                      >
                        <MenuItem onClick={handleMenuClose}>
                          <Typography>Discounts</Typography>
                        </MenuItem>
                      </Link>

                      <Link
                        to="/feedback"
                        style={{ textDecoration: "none", color: "grey" }}
                      >
                        <MenuItem onClick={handleMenuClose}>
                          <Typography>All Feedback</Typography>
                        </MenuItem>
                      </Link>

                      <Link
                        to="/usertable"
                        style={{ textDecoration: "none", color: "grey" }}
                      >
                        <MenuItem onClick={handleMenuClose}>
                          <Typography>User Table</Typography>
                        </MenuItem>
                      </Link>

                      <Link
                        to="/paymentrecords"
                        style={{ textDecoration: "none", color: "grey" }}
                      >
                        <MenuItem onClick={handleMenuClose}>
                          <Typography>Payment Records</Typography>
                        </MenuItem>
                      </Link>

                    </Menu>
                  </div>
                )}

                {user && (
                  <>
                    <Link to="/contactus">
                      <Typography>Contact Us</Typography>
                    </Link>
                    <Link to="/viewcars">
                      <Typography>Car Listings(User)</Typography>
                    </Link>
                    <Link to="/viewdiscounts">
                      <Typography>User Discounts</Typography>
                    </Link>
                    <Link to="/feedback">
                      <Typography>Feedback</Typography>
                    </Link>
                  </>
                )}
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <Link to="/userprofile" style={{ float: "right" }}>
                    <Typography>{user.name}</Typography>
                  </Link>
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
                      }}
                    >
                      <Typography>login</Typography>
                    </Button>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          <Routes>
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
            <Route path={"/discounts"} element={<Discounts />} />
            <Route path={"/editdiscount/:id"} element={<EditDiscounts />} />
            <Route path={"/adddiscount"} element={<AddDiscount />} />
            <Route path={"/viewdiscounts"} element={<ViewDiscounts />} />
            <Route path="/" element={<Homepage />} />
            <Route path={"/listings"} element={<CarListings />} />
            <Route path={"/addlistings"} element={<AddCarListings />} />
            <Route path={"/editlistings/:id"} element={<EditCarListings />} />
            <Route path={"/viewlistings"} element={<ViewCarListings />} />
            <Route path={"/cars"} element={<CarItem />} />
            <Route path={"/addcars"} element={<AddCarItem />} />
            <Route path={"/editcars/:id"} element={<EditCarItem />} />
            <Route path={"/createbooking/:id"} element={<CreateBooking />} />
            <Route path={"/paymentrecords"} element={<Payment />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </MaterialCssVarsProvider >
  );
}

export default App;

