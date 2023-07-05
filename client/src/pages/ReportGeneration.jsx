import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function ReportGeneration() {
  const navigate = useNavigate();

  const formik = useFormik({
    validationSchema: yup.object().shape({
      date: yup.string().required().min(10).max(10)
    }),
    onSubmit: (data) => {
      data.date = data.date;
      http.get("/payment", data)
        .then((res) => {
          console.log(res.data);
          navigate("/payment");
        });
    }
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Generate Report
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Choose date" 
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}/>
          </DemoContainer>
        </LocalizationProvider>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Generate Report
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ReportGeneration;