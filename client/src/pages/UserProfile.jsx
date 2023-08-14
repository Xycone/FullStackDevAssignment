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
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const data = [
  { label: "Manage Profile", top: "10vh", textDecorationLine: "underline" },
  { label: "Reset Password", top: "20vh", textDecorationLine: "none" },
  { label: "Update Profile", top: "30vh", textDecorationLine: "none" },
  { label: "Account Activities", top: "52vh", textDecorationLine: "underline" },
  { label: "Transaction History", top: "62vh", textDecorationLine: "none" },
  { label: "Discounts", top: "72vh", textDecorationLine: "none" },
];
const logout = () => {
  localStorage.clear();
  window.location = "/";
};
const CustomBox = ({ label, top, textDecorationLine }) => {
  return (
    <Box
      sx={{
        width: "45vw",
        height: "8vh",
        backgroundColor: "white", // Change this to your desired color
        position: "absolute",
        top,
        right: "10vw",
        zIndex: 1,
        borderRadius: "2rem",
      }}
    >
      <Typography
        sx={{ paddingLeft: "1.5rem", paddingTop: "0.7rem", textDecorationLine }}
      >
        {label}
      </Typography>
    </Box>
  );
};
function UserProfile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const Click = () => {
    console.log("Edit button pressed!");
    navigate(`/userupdate/${user.id}`);
  };

  const handleResetPassword = () => {
    if (!user) {
      setMessage("User not logged in");
      return;
    }

    const { email } = user;

    http
      .post("/user/forgotpassword", { email })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again later.");
      });
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);
  return (
    <Box sx={{ position: "relative", width: "100%", height: "91.5vh" }}>
      <Box
        sx={{
          width: "30vw",
          height: "70vh",
          backgroundColor: "white", // Change this to your desired color
          position: "absolute",
          top: "10vh",
          left: "10vw",
          zIndex: 1,
          borderRadius: "2rem",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            marginLeft: "7vh",
            marginTop: "8vh",
            textDecorationLine: "underline",
          }}
        >
          Profile
        </Typography>
        {user && (
          <Box
            sx={{
              marginLeft: "7vh",
              marginTop: "30vh",
            }}
          >
            <Typography>{user.name}</Typography>
            <Typography>{user.email}</Typography>
            <Typography>Phone number placeholder</Typography>
            <Button
              component={Link}
              onClick={logout}
              style={{
                backgroundColor: "black",
                width: "8rem",
                height: "7vh",
                marginLeft: "15vw",
                marginTop: "3vh",
                borderRadius: "1rem",
              }}
            >
              <Typography sx={{ textTransform: "none" }}>Log out</Typography>
            </Button>
          </Box>
        )}
      </Box>
      {data.map(({ label, top, textDecorationLine }, index) => (
        <CustomBox
          key={index}
          label={label}
          top={top}
          textDecorationLine={textDecorationLine}
        />
      ))}
      <Button
        component={Link}
        onClick={handleResetPassword}
        style={{
          backgroundColor: "#50C878",
          color: "white",
          width: "7vw",
          height: "6vh",
          top: "21vh",
          left: "80vw",
          zIndex: 2,
          borderRadius: "0.5rem",
        }}
      >
        <Typography
          sx={{
            paddingTop: "0.5vh",
            textTransform: "none",
          }}
        >
          Reset
        </Typography>
      </Button>
      {user && (
        <Button
          onClick={Click}
          style={{
            backgroundColor: "#50C878",
            color: "white",
            width: "7vw",
            height: "6vh",
            top: "31vh",
            left: "80vw",
            zIndex: 2,
            borderRadius: "0.5rem",
            position: "absolute",
            textDecoration: "none", 
          }}
        >
          <Typography
            sx={{
              paddingTop: "0.5vh",
              textTransform: "none",
            }}
          >
            Edit
          </Typography>
        </Button>
      )}
      <Button
        component={Link}
        to="/transactionhistory"
        style={{
          backgroundColor: "#50C878",
          color: "white",
          width: "7vw",
          height: "6vh",
          top: "63vh",
          left: "80vw",
          zIndex: 2,
          borderRadius: "0.5rem",
          position: "absolute",
        }}
      >
        <Typography
          sx={{
            paddingTop: "0.5vh",
            textTransform: "none",
          }}
        >
          View
        </Typography>
      </Button>
      <Button
        component={Link}
        to="/discounts"
        style={{
          backgroundColor: "#50C878",
          color: "white",
          width: "7vw",
          height: "6vh",
          top: "73vh",
          left: "80vw",
          zIndex: 2,
          borderRadius: "0.5rem",
          position: "absolute",
        }}
      >
        <Typography
          sx={{
            paddingTop: "0.5vh",
            textTransform: "none",
          }}
        >
          View
        </Typography>
      </Button>
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
    </Box>
  );
}

export default UserProfile;