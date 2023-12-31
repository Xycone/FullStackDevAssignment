import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, Button, Grid, Card, CardContent, Radio, RadioGroup, FormControlLabel, Container } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AspectRatio from '@mui/joy/AspectRatio';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { loadStripe } from "@stripe/stripe-js";

const makePayment = async (product, carId, startDate, endDate, currentLocation) => {
  const stripe = await loadStripe("pk_test_51NGHyVLq1Rg4FQjeLKdp1qDL1lbEx30qHo5KgKbUXjdp7jLd324xodhshAqQdIiE7b6LInbIhRJEplaifFYINmAo00EKmjq5ye");
  const body = { product, carId, startDate, endDate, currentLocation };
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(
    "http://localhost:3001/stripepayment/api/create-checkout-session",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    }
  );

  const session = await response.json();

  const result = stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    console.log(result.error);
  }
};

function CreateBooking() {
  const { id } = useParams();
  const [carList, setCarList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const navigate = useNavigate();
  const [selectedNumDays, setSelectedNumDays] = useState(1);
  useEffect(() => {


    http.get('/cars').then((res) => {
      setCarList(res.data);
    });

    http.get('/discounts').then((res) => {
      setDiscountList(res.data);
    });
  }, []);



  const [beforeDiscountTotal, setBeforeDiscountTotal] = useState(0);
  const idAsNumber = parseInt(id, 10);
  const matchingCar = carList.find((car) => car.listingId === idAsNumber && car.serviceStatus === false); // Adds first car found that is currently not in service
  const tomorrow = dayjs().add(1, 'day');

  const initialValues = {
    startDate: tomorrow,
    numDays: 1,
    carId: "",
    make: "",
    model: "",
    range: "",
    currentLocation: "",
    totalAmount: 0, // Add totalAmount field to initialValues
    selectedCoupon: "", // Add selectedCoupon field to initialValues
  };

  const validationSchema = yup.object().shape({
    numDays: yup
      .number()
      .min(1, "Number of days must be at least 1")
      .required('Number of days is required'),

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
        currentLocation: matchingCar.currentLocation,
        totalAmount: formik.values.totalAmount,
      };
      if (formData.totalAmount === 0 || formData.totalAmount >= 200000) {
        // Handle the case when the total amount is 0, e.g., show an error message or disable the button
        console.log("Total amount is 0, cannot proceed to checkout.");
        return;
      }
      const endDate = formik.values.startDate.add(data.numDays, 'day');
      const productName = `${formData.make} ${formData.model}`;
      const productDescription = `Range: ${formData.range}\nLocation: ${formData.currentLocation}`;
      const product = {
        name: productName,
        price: formData.totalAmount,
        description: productDescription,
        quantity: 1,
      };


      makePayment(product, matchingCar.id, formik.values.startDate, endDate, matchingCar.currentLocation)
      // Call navigate with the form data as state
      // navigate('/sp', { state: formData });
    }
  });

  useEffect(() => {
    // Update the selected number of days when formik values change
    setSelectedNumDays(formik.values.numDays);
  }, [formik.values.numDays]);

  // Add a state to track the filtered discount list
  const [filteredDiscountList, setFilteredDiscountList] = useState([]);
  // Calculate the total amount whenever the form values for startDate or endDate change
  useEffect(() => {

    if (matchingCar) {
      const startDate = dayjs(formik.values.startDate);
      const endDate = dayjs(formik.values.endDate);
      const diffInDays = endDate.diff(startDate, 'day');
      const basePrice = matchingCar.listing.price;
      let totalAmountBeforeDiscount = basePrice * formik.values.numDays;

      setBeforeDiscountTotal(totalAmountBeforeDiscount);

      let totalAmount = totalAmountBeforeDiscount;

      if (formik.values.selectedCoupon) {
        const selectedDiscount = discountList.find(
          (discount) => discount.id === formik.values.selectedCoupon
        );

        // Check if selected discount is valid and apply it

        if (selectedDiscount) {
          const { disctype, discount } = selectedDiscount;
          if (disctype === '%') {
            // If the discount type is '%', calculate the discounted amount as a percentage of the total
            const discountAmount = (totalAmountBeforeDiscount * discount) / 100;
            totalAmount = totalAmountBeforeDiscount - discountAmount;
          } else if (disctype === '$') {
            // If the discount type is '$', directly deduct the fixed amount from the total
            totalAmount = totalAmountBeforeDiscount - discount;


          }
        }
      }
      const filteredDiscounts = discountList
        .filter((discount) =>
        (discount.reqtype === 'null' ||
          (discount.reqtype === 'listingId' && parseInt(discount.listingId, 10) === parseInt(matchingCar.listingId, 10)) ||
          (discount.reqtype === 'minspend' && beforeDiscountTotal >= discount.minspend))
        );

      // Update the formik values if the currently selected discount is not valid for the new selectedNumDays
      if (!filteredDiscounts.find(discount => discount.id === formik.values.selectedCoupon)) {
        formik.setFieldValue('selectedCoupon', '');
      }

      // Set the filtered discount list
      setFilteredDiscountList(filteredDiscounts);

      // Prevent totalAmount from going below 0
      totalAmount = Math.max(totalAmount, 0);

      // Update the total amount in the formik values, checking for NaN and setting it to 0 if needed
      formik.setFieldValue('totalAmount', isNaN(totalAmount) ? 0 : totalAmount);
    }
  }, [formik.values.numDays, formik.values.selectedCoupon, matchingCar, discountList]);


  return (
    <Container>
      <Box height="100%">
        {carList.length === 0 ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {matchingCar ? (
              <>
                <Grid container spacing={2} mb={10} alignItems="flex-start">
                  <Grid item xs={12} md={6} lg={8}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={10} lg={8} mt={10}>
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
                                <Typography variant="h6">Total: ${formik.values.totalAmount}</Typography>
                                <Typography variant="h6">Pickup Location: {matchingCar.currentLocation}</Typography>
                                <Typography variant="h6">Pickup Date: {formik.values.startDate.format('DD/MM/YYYY')}</Typography>
                                <DemoContainer components={['DateField', 'DateField']}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} mt={2}>
                                      <input type="hidden" name="carId" value={matchingCar.id} />
                                      <input type="hidden" name="make" value={matchingCar.listing.make} />
                                      <input type="hidden" name="model" value={matchingCar.listing.model} />
                                      <input type="hidden" name="range" value={matchingCar.listing.range} />
                                      <input type="hidden" name="price" value={matchingCar.listing.price} />
                                      <Box>
                                        <Typography variant="subtitle1">Number of Days:</Typography>
                                        <input
                                          type="number"
                                          name="numDays"
                                          value={formik.values.numDays}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          min={1}
                                          style={{ width: '100%', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        />
                                        {formik.touched.numDays && formik.errors.numDays && (
                                          <Typography variant="body2" color="error">
                                            {formik.errors.numDays}
                                          </Typography>
                                        )}
                                      </Box>
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
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} mt={10}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Select Coupon:</Typography>
                        <RadioGroup
                          name="selectedCoupon"
                          value={formik.values.selectedCoupon}
                          onChange={(event) => formik.setFieldValue('selectedCoupon', parseInt(event.target.value, 10))}
                        >
                          <FormControlLabel value="" control={<Radio />} label="None" /> {/* Add a default option for no coupon selected */}
                          {discountList
                            .filter((discount) =>
                            (discount.reqtype === 'null' ||
                              (discount.reqtype === 'listingId' && parseInt(discount.listingId, 10) === parseInt(matchingCar.listingId, 10)) ||
                              (discount.reqtype === 'minspend' && beforeDiscountTotal >= discount.minspend))
                            )
                            .map((discounts) => (
                              <FormControlLabel
                                key={discounts.id}
                                value={discounts.id}
                                control={<Radio />}
                                label={
                                  `${discounts.disctype === '%' ? '' : '$'}${discounts.disctype === '%' ? parseFloat(discounts.discount).toFixed(0) + '%' : discounts.discount
                                  } discount`
                                }
                              />
                            ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Typography>Car Not Found</Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default CreateBooking