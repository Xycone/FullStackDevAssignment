import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useFormik } from 'formik';
import * as yup from 'yup';

function CreateBooking() {
  const { id } = useParams();
  const [carList, setCarList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    http.get('/cars').then((res) => {
      setCarList(res.data);
    });
  }, []);

  // Convert id to a number after fetching carList with listingId as numbers
  const idAsNumber = parseInt(id, 10);

  // Find the first car with matching listingId
  const matchingCar = carList.find((car) => car.listingId === idAsNumber);
  const tomorrow = dayjs().add(1, 'day');

  const initialValues = {
    startDate: tomorrow.add(1, 'day'),
    endDate: tomorrow.add(2, 'day'),
    carId: "",
    make: "",
    model: "",
    range: "",
  };

  const validationSchema = yup.object().shape({
    startDate: yup
      .date()
      .min(tomorrow.toDate(), "Car has to be booked in advance")
      .required("Start date is required"),
    endDate: yup
      .date()
      .min(tomorrow.add(1, 'day').toDate(), ({ min }) => `End date has to be at least one day after ${dayjs(min).format('DD/MM/YYYY')}`)
      .required("End date is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (data) => {
      const formData = {
        ...data,
        carId: matchingCar.id,
        make: matchingCar.listing.make,
        model: matchingCar.listing.model,
        range: matchingCar.listing.range,
      };
      // Handle form submission here
      http.post("/listings", formData).then((res) => {
        console.log(res.data);
        navigate("/listings");
      });
    },
  });

  return (
    <Box>
      {carList.length === 0 ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {matchingCar ? (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={8}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8} mt={10}>
                          <Card>
                            <CardContent sx={{ whiteSpace: 'pre-wrap' }}>
                              <Typography variant="h5" textAlign="center" sx={{ mb: 1 }}>{matchingCar.listing.make} {matchingCar.listing.model}</Typography>
                              <Typography variant="h6">Car ID: {matchingCar.id}</Typography>
                              <Typography variant="h6">Make: {matchingCar.listing.make}</Typography>
                              <Typography variant="h6">Model: {matchingCar.listing.model}</Typography>
                              <Typography variant="h6">Range (EPA est.): {matchingCar.listing.range}km</Typography>
                              <DemoContainer components={['DateField', 'DateField']}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <input type="hidden" name="carId" value={matchingCar.id} />
                                    <input type="hidden" name="make" value={matchingCar.listing.make} />
                                    <input type="hidden" name="model" value={matchingCar.listing.model} />
                                    <input type="hidden" name="range" value={matchingCar.listing.range} />
                                    <DateField
                                      label="Start Date"
                                      value={dayjs(formik.values.startDate)}
                                      onChange={(newValue) => formik.setFieldValue('startDate', newValue)}
                                      format="DD/MM/YYYY"
                                      error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                      helperText={formik.touched.startDate && formik.errors.startDate}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <DateField
                                      label="End Date"
                                      value={dayjs(formik.values.endDate)}
                                      onChange={(newValue) => formik.setFieldValue('endDate', newValue)}
                                      format="DD/MM/YYYY"
                                      error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                      helperText={formik.touched.endDate && formik.errors.endDate}
                                    />
                                  </Grid>
                                </Grid>
                              </DemoContainer>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Button variant="contained" type="submit" sx={{ flexGrow: 1, height: '150%' }}>
                                  Proceed To Checkout
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </>
          ) : (
            <Typography>Car Not Found</Typography>
          )
          }
        </>
      )}
    </Box >
  );
}

export default CreateBooking