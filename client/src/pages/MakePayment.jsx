import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

function Payment() {
    const navigate = useNavigate();
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    const [assignmentList, setAssignmentList] = useState([]);
    const getCars = () => {
        http.get('/cars').then((res) => {
            setAssignmentList(res.data);
        });
    };
    const formik = useFormik({
        initialValues: {
            car_id: "",
            make: "",
            model: "",
            price: "",
            cardno: "",
            cvc: "",
            expirydate: "",
            date: date
        },


        validationSchema: yup.object().shape({
            car_id: yup.string().trim()
                .required('Id is required'),
            make: yup.string().trim()
                .min(3, 'Make of the car must be at least 3 characters')
                .max(100, 'Make of the car must be at most 100 characters')
                .required('Make of the car is required'),
            model: yup.string().trim()
                .min(1, 'Model of the car must be at least 1 character')
                .max(150, 'Model of the car must be at most 150 characters')
                .required('Model of the car is required'),
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
                .min(5, 'Expiry date cannot be less than 4 digits')
                .max(5, 'Expiry date cannot be more than 4 digits')
                .required('Expiry date is needed')
                .matches(
                    /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[0-2])/,
                    'Invalid date format. Please use mm/yy.'
                )
        }),

        onSubmit: (data) => {
            data.car_id = data.car_id.trim();
            data.make = data.make.trim();
            data.model = data.model.trim();
            data.price = Number(data.price);
            data.date = data.date.trim();
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
                            label="Car_id:"
                            name="car_id"
                            value={formik.values.car_id}
                            onChange={formik.handleChange}
                            error={formik.touched.car_id && Boolean(formik.errors.car_id)}
                            helperText={formik.touched.car_id && formik.errors.car_id}
                        />
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