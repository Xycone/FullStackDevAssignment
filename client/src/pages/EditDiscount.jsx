import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function EditDiscounts() {
    const navigate = useNavigate();
    const { id } = useParams()

    const [discounts, setDiscounts] = useState({
            discount: "",
            disctype: "$",
            // reqtype: "",
            // minspend: "",
            // cartype: "",
            enddate: ""

        });

    useEffect(() => {
        http.get(`/discounts/${id}`).then((res) => {
            setDiscounts(res.data);
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        initialValues: discounts,
        enableReinitialize: true,


        validationSchema: yup.object().shape({
            discount: yup
                .number()
                .required('Discount is required')
                .when('disctype', {
                    is: '%',
                    then: yup.number().max(100, 'Discount cannot be more than 100%'),
                }),
            enddate: yup.string()
                .matches(
                    /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                    'Invalid date format. Please use dd/mm/yyyy.'
                )
                .required('Date is required.'),
        }),

        onSubmit: (data) => {

            data.discount = data.discount;
            data.disctype = data.disctype;
            // data.reqtype = data.reqtype;
            // data.minspend = data.minspend;
            // data.cartype = data.cartype;
            data.enddate = data.enddate;

            data.discount = Number(data.discount);
            // data.minspend = Number(data.minspend);

            http.put(`/discounts/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/discounts");
            });
        }
    });
    // const [selectedOption, setSelectedOption] = useState('');
    // const [secondDropdownVisible, setSecondDropdownVisible] = useState(false);

    // const handleOptionChange = (event) => {
    //     setSelectedOption(event.target.value);
    //     setSecondDropdownVisible(event.target.value === 'cartype');
    // };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Discount
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField margin="normal" autoComplete="off"
                            style={{ width: '75%' }}
                            label="Discount"
                            name="discount"
                            value={formik.values.discount}
                            onChange={formik.handleChange}
                            error={formik.touched.discount && Boolean(formik.errors.discount)}
                            helperText={formik.touched.discount && formik.errors.discount}
                        />

                        <FormControl margin="normal">
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                style={{ width: '200%' }}
                                value={formik.values.disctype}
                                onChange={formik.handleChange}
                            >
                                <MenuItem value="$">$</MenuItem>
                                <MenuItem value="%">%</MenuItem>
                            </Select>
                        </FormControl>

                        {/* <Box component="form" onSubmit={formik.handleSubmit}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="option-label">Requirement Type</InputLabel>
                                    <Select
                                        labelId="option-label"
                                        id="option-select"
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                    >
                                        <MenuItem value='null'>None</MenuItem>
                                        <MenuItem value="cartype">Car</MenuItem>
                                        <MenuItem value="minspend">Min Spend</MenuItem>
                                    </Select>
                                </FormControl>

                                {secondDropdownVisible ? (
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="second-option-label">Car Type:</InputLabel>
                                        <Select
                                            labelId="second-option-label"
                                            id="second-option-select"
                                            value={formik.values.secondOption}
                                            onChange={formik.handleChange}
                                        >
                                            <MenuItem value="tesla">Tesla</MenuItem>
                                            <MenuItem value="hyundai">Hyundai</MenuItem>
                                            <MenuItem value="mercedes">Mercedes</MenuItem>
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        autoComplete="off"
                                        label="MinSpend ($)"
                                        name="minspend"
                                        value={formik.values.minspend}
                                        onChange={formik.handleChange}
                                        error={formik.touched.minspend && Boolean(formik.errors.minspend)}
                                        helperText={formik.touched.minspend && formik.errors.minspend}
                                    />
                                )} */}
                        {/* </Box> */}

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField margin="normal" autoComplete="off"
                                style={{ width: '75%' }}
                                label="End Date(DD/MM/YYYY)"
                                name="enddate"
                                value={formik.values.enddate}
                                onChange={formik.handleChange}
                                error={formik.touched.enddate && Boolean(formik.errors.enddate)}
                                helperText={formik.touched.enddate && formik.errors.enddate}
                            />

                        </Grid>
                        <Box>
                            <Button variant="contained" type="submit">
                                Update discount
                            </Button>
                        </Box>
                    </Grid>

                </Grid>
            </Box >
            <ToastContainer />
        </Box >
    )
}

export default EditDiscounts