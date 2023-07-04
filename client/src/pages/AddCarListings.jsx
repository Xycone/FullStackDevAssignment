import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";

function AddCarListings() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      make: "",
      model: "",
      range: "",
      price: "",
      status: false,
    },

    validationSchema: yup.object().shape({
      make: yup
        .string()
        .trim()
        .min(3, "Make of the car must be at least 3 characters")
        .max(100, "Make of the car must be at most 100 characters")
        .required("Make of the car is required"),
      model: yup
        .string()
        .trim()
        .min(1, "Model of the car must be at least 1 character")
        .max(150, "Model of the car must be at most 150 characters")
        .required("Model of the car is required"),
      range: yup
        .number()
        .min(0, "Range of the car must be at least 0km")
        .required("Range of the car is required"),
      price: yup
        .number()
        .min(0.01, "Price of the car must be at least S$0.01/day")
        .required("Price of the car is required"),
    }),

    onSubmit: (data) => {
      data.make = data.make.trim();
      data.model = data.model.trim();
      data.range = Number(data.range);
      data.price = Number(data.price);
      http.post("/assignment", data).then((res) => {
        console.log(res.data);
        navigate("/cars");
      });
    },
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Car Listing
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Make:"
          name="make"
          value={formik.values.make}
          onChange={formik.handleChange}
          error={formik.touched.make && Boolean(formik.errors.make)}
          helperText={formik.touched.make && formik.errors.make}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Model:"
          name="model"
          value={formik.values.model}
          onChange={formik.handleChange}
          error={formik.touched.model && Boolean(formik.errors.model)}
          helperText={formik.touched.model && formik.errors.model}
        />
        <TextField
          type="number"
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Range (EPA est.):"
          name="range"
          value={formik.values.range}
          onChange={formik.handleChange}
          error={formik.touched.range && Boolean(formik.errors.range)}
          helperText={formik.touched.range && formik.errors.range}
        />
        <TextField
          type="number"
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Price/day: S$"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Create Listing
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddCarListings;
