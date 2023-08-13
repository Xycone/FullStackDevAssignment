import React, { useEffect, useState } from "react";
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Container } from '@mui/material';
import http from '../http'; // Make sure to import your http module here
import '../css/Success.css';

function Success() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const carId = queryParams.get('carId');
    const productPrice = queryParams.get('productPrice');
    const productName = queryParams.get('productName');

    return (
        <div className="centered-card-wrapper">
            <Card className="centered-card">
                <CardContent>
                    <Typography variant="h5" componenet="h2">
                        Car ID: {carId}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Thanks for your order!
                    </Typography>
                    <Typography variant="body2" component="p">
                        Your rental of the {productName} is successful.
                    </Typography>
                    <Typography variant="body2" component="p">
                        We appreciate your business! If you have any questions, please email us at <a href="mailto:221658b@mymail.nyp.edu.sg">rental@gmail.com</a>.
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default Success;