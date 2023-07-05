import { useState, useEffect } from "react";
import http from "../http";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import homepage_img from "../images/homepage_img.png";

function Homepage() {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "91.5vh" }}>
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#D2D2D2", // Replace with your desired shade of grey
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    ></Box>
    <Typography
      sx={{
        marginLeft: "10vh",
        marginTop: "15vh",
        float: "left",
      }}
    >
      Hassle Free Rental Services
    </Typography>
    <Typography
      sx={{
        position: "relative",
        width: "65%",
        height: "71.5vh",
        marginBottom: "10vh",
        marginTop: "10vh",
        borderTopLeftRadius: "1rem",
        borderBottomLeftRadius: "1rem",
        backgroundImage: `url(${homepage_img})`,
        float: "right",
      }}
    >
      <img
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </Typography>
  </Box>
  );
}

export default Homepage;
