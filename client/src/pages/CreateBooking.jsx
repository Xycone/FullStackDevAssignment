import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid, Select, FormControl, InputLabel, MenuItem  } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';

function CreateBooking() {
    const { id } = useParams();
  return (
    <div>CreateBooking</div>
  )
}

export default CreateBooking