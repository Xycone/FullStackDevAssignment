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
import AspectRatio from '@mui/joy/AspectRatio';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';

function CreateBooking() {
  const { id } = useParams();
  const [carList, setCarList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    http.get('/cars').then((res) => {
      setCarList(res.data);
    });
  }, []);

  const idAsNumber = parseInt(id, 10);
  const matchingCar = carList.find((car) => car.listingId === idAsNumber);
  const tomorrow = dayjs().add(1, 'day');

  const initialValues = {
    startDate: tomorrow.add(1, 'day'),
    endDate: tomorrow.add(2, 'day'),
    carId: "",
    make: "",
    model: "",
    range: "",
    totalAmount: 0, // Add totalAmount field to initialValues
  };

  const validationSchema = yup.object().shape({
    startDate: yup
      .date()
      .min(tomorrow.toDate(), "Car has to be booked in advance")
      .required("Start date is required"),
    endDate: yup
      .date()
      .min(tomorrow.add(1, 'day').toDate(), ({ min }) => `End date has to be at least one day after ${dayjs(min).format('DD/MM/YYYY')}`)
      .when('startDate', (startDate, schema) => { // Use 'when' to add a dependent validation
        return schema.min(dayjs(startDate).add(1, 'day').toDate(), 'End date has to be at least one day after the start date');
      })
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
        price: matchingCar.listing.price,
      };

      http.post("/listings", formData).then((res) => {
        console.log(res.data);
        navigate("/listings");
      });
    },
  });

  // Calculate the total amount whenever the form values for startDate or endDate change
  useEffect(() => {
    if (matchingCar) {
      const startDate = dayjs(formik.values.startDate);
      const endDate = dayjs(formik.values.endDate);
      const diffInDays = endDate.diff(startDate, 'day');
      const totalAmount = matchingCar.listing.price * diffInDays;
  
      // Update the total amount in the formik values, checking for NaN and setting it to 0 if needed
      formik.setFieldValue('totalAmount', isNaN(totalAmount) ? 0 : totalAmount);
    }
  }, [formik.values.startDate, formik.values.endDate, matchingCar]);

  return (
    <Box>
      {carList.length === 0 ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {matchingCar ? (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2} mb={10}>
                  <Grid item xs={12} md={6} lg={8}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8} mt={10}>
                          <Card>
                            {matchingCar.listing.imageFile && (
                              <JoyCssVarsProvider>
                                <AspectRatio>
                                  <Box component="img" src={`${import.meta.env.VITE_FILE_BASE_URL}${matchingCar.listing.imageFile}`} alt="listings" />
                                </AspectRatio>
                              </JoyCssVarsProvider>
                            )}
                            <CardContent sx={{ whiteSpace: 'pre-wrap' }}>
                              <Typography variant="h6">Car ID: {matchingCar.id}</Typography>
                              <Typography variant="h6">Make: {matchingCar.listing.make}</Typography>
                              <Typography variant="h6">Model: {matchingCar.listing.model}</Typography>
                              <Typography variant="h6">Range (EPA est.): {matchingCar.listing.range}km</Typography>
                              <Typography variant="h6">Total: S${formik.values.totalAmount}</Typography>
                              <DemoContainer components={['DateField', 'DateField']}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} mt={2}>
                                    <input type="hidden" name="carId" value={matchingCar.id} />
                                    <input type="hidden" name="make" value={matchingCar.listing.make} />
                                    <input type="hidden" name="model" value={matchingCar.listing.model} />
                                    <input type="hidden" name="range" value={matchingCar.listing.range} />
                                    <input type="hidden" name="price" value={matchingCar.listing.price} />
                                    <DateField
                                      label="Start Date"
                                      value={dayjs(formik.values.startDate)}
                                      onChange={(newValue) => formik.setFieldValue('startDate', newValue)}
                                      format="DD/MM/YYYY"
                                      error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                      helperText={formik.touched.startDate && formik.errors.startDate}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6} mt={2}>
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
          )}
        </>
      )}
    </Box>
  );
}

export default CreateBooking;