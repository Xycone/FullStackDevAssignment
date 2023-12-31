
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

function EditDiscounts() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignmentList, setAssignmentList] = useState([]);
    const minEndDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

    const getListings = () => {
        http.get("/listings").then((res) => {
            setAssignmentList(res.data);
        });
    };

    useEffect(() => {
        getListings();
    }, []);

    const [discounts, setDiscounts] = useState({
        discount: "",
        disctype: "",
        reqtype: "null",
        minspend: 0,
        listingId: 0,
        enddate: "",
    });
    const [selectedOption, setSelectedOption] = useState(discounts.reqtype);
    const [secondDropdownVisible, setSecondDropdownVisible] = useState(
        discounts.reqtype === "listingId"
    );
    useEffect(() => {
        http.get(`/discounts/${id}`).then((res) => {
            setDiscounts(res.data);
            setSelectedOption(res.data.reqtype);
            setSecondDropdownVisible(res.data.reqtype === "listingId");
            formik.setValues(res.data);
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        initialValues: discounts,
        enableReinitialize: true,

        validationSchema: yup.object().shape({
            discount: yup.number().required("Discount is required"),
            disctype: yup.string().required("required."),
            reqtype: yup.string().required("Requirement Type is required"),
            listingId: yup
                .number()
                .test(
                    "Please select a Car Type when Requirement Type is 'Car'",
                    function (value) {
                        const { reqtype } = this.parent;
                        if (reqtype === "listingId") {
                            return value !== undefined && value !== "";
                        }
                        return true;
                    }
                ),
            minspend: yup.number(),
            enddate: yup
                .string()
                .test('future-date', 'End date must be in the future', (value) => {
                    if (!value) return false; // Return false if value is empty
                    return dayjs(value, 'DD/MM/YYYY').isAfter(dayjs(), 'day');
                })
                .required('Date is required.'),
        }),

        onSubmit: (data) => {

            data.discount = data.discount;
            data.disctype = data.disctype;
            data.reqtype = data.reqtype;
            data.minspend = data.minspend;
            data.listingId = data.listingId;
            data.enddate = data.enddate;
            data.discount = Number(data.discount);
            data.minspend = Number(data.minspend);

            http.put(`/discounts/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/discounts");
            });
        },
    });
    // const [selectedOption, setSelectedOption] = useState('');
    // const [secondDropdownVisible, setSecondDropdownVisible] = useState(false);

    // const handleOptionChange = (event) => {
    //     setSelectedOption(event.target.value);
    //     setSecondDropdownVisible(event.target.value === 'cartype');
    // };


    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);

        // If the selected value is "null", set cartype to an empty string
        if (selectedValue === "null") {
            formik.setFieldValue("listingId", 0); // Assigning a number directly

            formik.setFieldValue("minspend", 0);
        }

        // Update reqtype in formik values
        formik.setFieldValue("reqtype", selectedValue);
        setSecondDropdownVisible(selectedValue === "listingId");
    };

    return (
        <Container>
            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Edit iscount
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TextField
                                margin="normal"
                                autoComplete="off"
                                type="number"
                                style={{ width: "75%" }}
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
                                    name="disctype"
                                    style={{ width: "200%" }}
                                    value={formik.values.disctype}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.disctype && Boolean(formik.errors.disctype)
                                    }
                                >
                                    <MenuItem value="$">$</MenuItem>
                                    <MenuItem value="%">%</MenuItem>
                                </Select>
                                {formik.touched.disctype &&
                                    formik.errors.disctype && ( // Show the Formik error message for disctype field
                                        <Typography variant="caption" color="error">
                                            {formik.errors.disctype}
                                        </Typography>
                                    )}
                            </FormControl>

                            <Box onSubmit={formik.handleSubmit}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="option-label">Requirement Type</InputLabel>
                                    <Select
                                        labelId="option-label"
                                        id="option-select"
                                        name="reqtype"
                                        value={formik.values.reqtype}
                                        onChange={handleOptionChange}
                                        error={
                                            formik.touched.reqtype && Boolean(formik.errors.reqtype)
                                        }
                                    >
                                        <MenuItem value="null">None</MenuItem>
                                        <MenuItem value="listingId">Listing</MenuItem>
                                        <MenuItem value="minspend">Min Spend</MenuItem>
                                    </Select>
                                    {formik.touched.reqtype &&
                                        formik.errors.reqtype && ( // Show the Formik error message for reqtype field
                                            <Typography variant="caption" color="error">
                                                {formik.errors.reqtype}
                                            </Typography>
                                        )}
                                </FormControl>

                                {secondDropdownVisible ? (
                                    <FormControl fullWidth margin="normal">
                                        {/* <InputLabel id="second-option-label">Car Type:</InputLabel>
                  <Select
                    labelId="second-option-label"
                    id="second-option-select"
                    name="cartype"
                    value={formik.values.cartype}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="tesla">Tesla</MenuItem>
                    <MenuItem value="hyundai">Hyundai</MenuItem>
                    <MenuItem value="mercedes">Mercedes</MenuItem>
                  </Select>
                  {formik.errors.cartype &&
                    formik.touched.cartype && ( // Show the error message only when the field is touched and has an error
                      <Typography variant="caption" color="error">
                        {formik.errors.cartype}
                      </Typography>
                    )} */}

                                        <InputLabel id="demo-simple-select-label">
                                            Listing Id:
                                        </InputLabel>
                                        <Select
                                            labelId="second-option-label"
                                            id="second-option-select"
                                            label="Listing Id:"
                                            name="listingId"
                                            value={formik.values.listingId}
                                            onChange={formik.handleChange}
                                            error={
                                                formik.touched.listingId &&
                                                Boolean(formik.errors.listingId)
                                            }
                                        >
                                            {assignmentList.map((listings) => (
                                                <MenuItem key={listings.id} value={listings.id}>
                                                    {listings.id}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        margin="normal"
                                        autoComplete="off"
                                        label="MinSpend ($)"
                                        name="minspend"
                                        value={formik.values.minspend}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.minspend && Boolean(formik.errors.minspend)
                                        }
                                        helperText={formik.touched.minspend && formik.errors.minspend}
                                    />
                                )}
                            </Box>

                            <Grid item xs={12} md={6} lg={4}>
                                <TextField
                                    margin="normal"
                                    autoComplete="off"
                                    style={{ width: "75%" }}
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
                                    Create Listing
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <ToastContainer />
            </Box>
        </Container >
    );
}

export default EditDiscounts;