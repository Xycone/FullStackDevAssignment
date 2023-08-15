import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import http from "../http";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function EnterEmail() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
    }),
    onSubmit: async (data) => {
      try {
        data.email = data.email.trim();
        const response = await http.post("/user/forgotpassword", data);
        console.log(response.data);
        navigate("/");
      } catch (error) {
        console.error("Error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setEmailError(error.response.data.error);
          toast.error(error.response.data.error);
        } else {
          setEmailError("An error occurred while processing your request.");
          toast.error("An error occurred while processing your request.");
        }
      }
    },
  });
  const handleEmailChange = (event) => {
    formik.handleChange(event);
    const { name, value } = event.target;
    if (name === "email") {
      setEmailError(""); // Reset the error when the user changes the email
    }
  };
  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ my: 2 }}>
          Login
        </Typography>
        <Box
          component="form"
          sx={{ maxWidth: "500px" }}
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            margin="normal"
            autoComplete="off"
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={handleEmailChange} // Use custom email change handler
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email} // Display the validation error message
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            Submit
          </Button>
        </Box>
        <ToastContainer />
      </Box>
    </Container>
  );
}

export default EnterEmail;
