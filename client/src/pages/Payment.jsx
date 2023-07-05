import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Datetime from 'react-datetime';

function Payment() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            make: "",
            model: "",
            price: "",
            cardno: "",
            cvc: "",
            expirydate: ""
        },


        validationSchema: yup.object().shape({
            make: yup.string().trim()
                .min(3, 'Make of the car must be at least 3 characters')
                .max(100, 'Make of the car must be at most 100 characters')
                .required('Make of the car is required'),
            model: yup.string().trim()
                .min(1, 'Model of the car must be at least 1 character')
                .max(150, 'Model of the car must be at most 150 characters')
                .required('Model of the car is required'),
            range: yup.number()
                .min(0, 'Range of the car must be at least 0km')
                .required('Range of the car is required'),
            price: yup.number()
                .min(0.01, 'Price of the car must be at least S$0.01/day')
                .required('Price of the car is required'),
            cardno: yup.string().trim()
                .min(16, 'Card number cannot be less than 16 digits')
                .max(16, 'Card number cannot be more than 16 digits')
                .required('Card number is needed'),
            cvc: yup.string().trim()
                .min(3, 'CVC number cannot be less than 3 digits')
                .max(3, 'CVC number cannot be more than 3 digits')
                .required('CVC number is needed'),
            expirydate: yup.string().trim()
                .min(4, 'Expiry date cannot be less than 4 digits')
                .max(4, 'Expiry date cannot be more than 4 digits')
                .required('Expiry date is needed')
        }),

        onSubmit: (data) => {
            data.make = data.make.trim();
            data.model = data.model.trim();
            data.price = Number(data.price);
            data.date = data.date;
            http.post("/payment", data).then((res) => {
                console.log(res.data);
                navigate("/payment");
            });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Checkout
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="Make:"
                            name="make"
                            value={formik.values.make}
                            onChange={formik.handleChange}
                            error={formik.touched.make && Boolean(formik.errors.make)}
                            helperText={formik.touched.make && formik.errors.make}
                        />
                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="Model:"
                            name="model"
                            value={formik.values.model}
                            onChange={formik.handleChange}
                            error={formik.touched.model && Boolean(formik.errors.model)}
                            helperText={formik.touched.model && formik.errors.model}
                        />
                        <TextField type="number" fullWidth margin="normal" autoComplete="off"
                            label="Price/day: S$"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="CardNo:"
                            name="cardno"
                            value={formik.values.cardno}
                            onChange={formik.handleChange}
                            error={formik.touched.cardno && Boolean(formik.errors.cardno)}
                            helperText={formik.touched.cardno && formik.errors.cardno}
                        />
                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="CVC:"
                            name="cvc"
                            value={formik.values.cvc}
                            onChange={formik.handleChange}
                            error={formik.touched.cvc && Boolean(formik.errors.cvc)}
                            helperText={formik.touched.cvc && formik.errors.cvc}
                        />
                        <TextField fullWidth margin="normal" autoComplete="off"
                            label="Expirydate:"
                            name="expirydate"
                            value={formik.values.expirydate}
                            onChange={formik.handleChange}
                            error={formik.touched.expirydate && Boolean(formik.errors.expirydate)}
                            helperText={formik.touched.expirydate && formik.errors.expirydate}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Checkout
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <ToastContainer />
        </Box>
    )
}
export default Payment