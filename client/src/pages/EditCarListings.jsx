import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid, Container } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AspectRatio from '@mui/joy//AspectRatio';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';

function EditCarListings() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageFile, setImageFile] = useState(null);

    const [listings, setListings] = useState({
        imageFile: "",
        make: "",
        model: "",
        range: "",
        price: "",
    });

    useEffect(() => {
        http.get(`/listings/${id}`).then((res) => {
            setListings(res.data);
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        initialValues: listings,
        enableReinitialize: true,

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
                .required('Price of the car is required')
        }),

        onSubmit: (data) => {
            data.imageFile = imageFile;
            data.make = data.make.trim();
            data.model = data.model.trim();
            data.range = Number(data.range);
            data.price = Number(data.price);
            http.put(`/listings/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/listings");
            });
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Container>
            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Edit Car Listing
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TextField
                                fullWidth margin="normal" autoComplete="off"
                                label="Make"
                                name="make"
                                value={formik.values.make}
                                onChange={formik.handleChange}
                                error={formik.touched.make && Boolean(formik.errors.make)}
                                helperText={formik.touched.make && formik.errors.make}
                            />
                            <TextField
                                fullWidth margin="normal" autoComplete="off"
                                multiline minRows={2}
                                label="Model"
                                name="model"
                                value={formik.values.model}
                                onChange={formik.handleChange}
                                error={formik.touched.model && Boolean(formik.errors.model)}
                                helperText={formik.touched.model && formik.errors.model}
                            />
                            <TextField type="number" fullWidth margin="normal" autoComplete="off"
                                label="Range (EPA est.):"
                                name="range"
                                value={formik.values.range}
                                onChange={formik.handleChange}
                                error={formik.touched.range && Boolean(formik.errors.range)}
                                helperText={formik.touched.range && formik.errors.range}
                            />
                            <TextField type="number" fullWidth margin="normal" autoComplete="off"
                                label="Price/day: S$"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Button variant="contained" type="submit">
                                    Update Listing
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box sx={{ textAlign: 'center', mt: 2 }} >
                                <Button variant="contained" component="label">
                                    Upload Image
                                    <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                                </Button>
                                {
                                    imageFile && (
                                        <JoyCssVarsProvider>
                                            <AspectRatio>
                                                <Box component="img" alt="tutorial"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                                </Box>
                                            </AspectRatio>
                                        </JoyCssVarsProvider>
                                    )
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <ToastContainer />
            </Box>
        </Container>
    )
}

export default EditCarListings