import React from "react";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import "react-toastify/dist/ReactToastify.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState, useEffect } from 'react';

function ContactUs() {
  const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
      try {
          if (localStorage.getItem('accessToken')) {
              http.get('/user/auth').then((res) => {
                  setUser(res.data.user);
                  });
          } else {
            setAuthorized(false);
          }
        } catch (error) {
          console.error(error);
          setAuthorized(false);
        }
    }, []);
  const formik = useFormik({
    initialValues: {
      rating: "",
      description: "",
      status: false,
    },
    validationSchema: yup.object().shape({
      rating: yup.string().trim().min(1).required("Rating is required"),
      description: yup
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters")
        .max(500, "Description must be at most 500 characters")
        .required("Description is required"),
    }),
    onSubmit: (data) => {
      data.rating = data.rating.trim();
      data.description = data.description.trim();
      data.userId = user.id;
      http.post("/feedback", data).then((res) => {
        console.log(res.data);
        navigate("/home");
      });
    },
  });
  return (
    <Container>
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Send Feedback
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="rating"
            label="Rating"
            value={formik.values.rating}
            onChange={formik.handleChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
          </RadioGroup>
          {formik.touched.rating && formik.errors.rating && (
            <Typography variant="body2" color="error">
              {formik.errors.rating}
            </Typography>
          )}
          <TextField
            fullWidth
            margin="normal"
            autoComplete="off"
            multiline
            minRows={2}
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
export default ContactUs;