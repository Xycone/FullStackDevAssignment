import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditCarItem() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [cars, setCars] = useState({
        listingId: "",
        currentLocation: "",
        serviceStatus: true,
    });

    useEffect(() => {
        http.get(`/cars/${id}`).then((res) => {
            setCars(res.data);
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        initialValues: cars,
        enableReinitialize: true,

        validationSchema: yup.object().shape({
            listingId: yup
                .number()
                .min(0, "Please enter a valid id")
                .required("Please enter the listing id of the listing that this car belongs to"),
            currentLocation: yup
                .string()
                .trim()
                .min(3, "currentLocation of the car must be at least 3 characters")
                .max(100, "currentLocation of the car must be at most 100 characters")
                .required("currentLocation of the car is required"),
        }),

        onSubmit: (data) => {
            data.listingId = Number(data.listingId);
            data.currentLocation = data.currentLocation.trim()
            http.put(`/cars/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/cars");
            });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Car
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="Listing Id:"
                            name="listingId"
                            value={formik.values.listingId}
                            onChange={formik.handleChange}
                            error={formik.touched.make && Boolean(formik.errors.make)}
                            helperText={formik.touched.make && formik.errors.make}
                        />
                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="Current Location:"
                            name="currentLocation"
                            value={formik.values.currentLocation}
                            onChange={formik.handleChange}
                            error={formik.touched.make && Boolean(formik.errors.make)}
                            helperText={formik.touched.make && formik.errors.make}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Create Listing
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default EditCarItem