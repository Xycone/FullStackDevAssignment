import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid, Select, FormControl, InputLabel, MenuItem, Container  } from '@mui/material';
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

    const [assignmentList, setAssignmentList] = useState([]);

    const getListings = () => {
        http.get('/listings').then((res) => {
            setAssignmentList(res.data);
        });
    };

    useEffect(() => {
        getListings();
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
                .required("Listing Id is required"),
            currentLocation: yup
                .string()
                .trim()
                .min(3, "Current location of the car must be at least 3 characters")
                .max(100, "Current location of the car must be at most 100 characters")
                .required("Current location of the car is required"),
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
        <Container>
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Car
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                    <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Listing Id:</InputLabel>
                            <Select
                                label="Listing Id:"
                                name="listingId"
                                value={formik.values.listingId}
                                onChange={formik.handleChange}
                                error={formik.touched.listingId && Boolean(formik.errors.listingId)}
                            >
                                {assignmentList.map((listings) => (
                                <MenuItem key={listings.id} value={listings.id}>{listings.id}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="Current Location:"
                            name="currentLocation"
                            value={formik.values.currentLocation}
                            onChange={formik.handleChange}
                            error={formik.touched.currentLocation && Boolean(formik.errors.currentLocation)}
                            helperText={formik.touched.currentLocation && formik.errors.currentLocation}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Edit Car Item
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
        </Container>
    )
}

export default EditCarItem