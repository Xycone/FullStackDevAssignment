import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid, Select, FormControl, InputLabel, MenuItem, Card, CardContent } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

function CreateBooking() {
  const { id } = useParams();
  const [carList, setCarList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    http.get('/cars').then((res) => {
      ;
      setCarList(res.data);
    });
  }, []);

  // Convert id to a number after fetching carList with listingId as numbers
  const idAsNumber = parseInt(id, 10);

  // Find the first car with matching listingId
  const matchingCar = carList.find((car) => car.listingId === idAsNumber);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null
    },

    validationSchema: yup.object().shape({
      startDate: yup
        .date()
        .min(tomorrow, "Please enter a valid date")
        .required("Start date is required"),
      endDate: yup
        .date()
        .min(tomorrow, "Booking has to be at least one day")
        .required("End date is required"),
    }),

    onSubmit: (data) => {;
      http.post("/listings", data).then((res) => {
        console.log(res.data);
        navigate("/listings");
      });
    }
  });


  return (
    <Box>
      {carList.length === 0 ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {matchingCar ? (
            <>
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
                            <TextField fullWidth margin="normal" autoComplete="off"
                              label="Start Date:"
                              name="startDate"
                              value={formik.values.startDate}
                              onChange={formik.handleChange}
                              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                              helperText={formik.touched.startDate && formik.errors.startDate}
                            />
                            <TextField fullWidth margin="normal" autoComplete="off"
                              label="End Date:"
                              name="endDate"
                              value={formik.values.endDate}
                              onChange={formik.handleChange}
                              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                              helperText={formik.touched.endDate && formik.errors.endDate}
                            />
                            <Box sx={{ mt: 2 }}>
                              <Button variant="contained" type="submit">
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
            </>
          ) : (
            <Typography>Car Not Found</Typography>
          )
          }
        </>
      )
      }
    </Box >
  )

}

export default CreateBooking