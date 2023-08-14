import React, { useState,useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Container, Button } from '@mui/material';
import http from '../http'; // Make sure to import your http module here
import '../css/Success.css';
import dayjs from 'dayjs';

function Success() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const carId = queryParams.get('carId');
    const productPrice = queryParams.get('productPrice');
    const productName = queryParams.get('productName');
    const startDate = dayjs(queryParams.get('startDate'));
    const endDate = dayjs(queryParams.get('endDate'));
    const currentLocation = queryParams.get('currentLocation')

    const navigate = useNavigate();
    const [postCompleted, setPostCompleted] = useState(false);

    // Check if necessary parameters are missing and redirect to home
    useEffect(() => {
        if (!carId || !productPrice || !productName || !startDate || !endDate || !currentLocation) {
            navigate('/home');
        }
    }, [carId, productPrice, productName, startDate, endDate, currentLocation, navigate]);

    // Function to handle the post request
    const handleReturnToHomepage = () => {
        if (!postCompleted) {
            const formData = {
                carId,
                productPrice,
                productName,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
            };

            // Make the post request
            http.post("/transactionrecord", formData)
                .then((response) => {
                    console.log("Transaction record created:", response.data);
                    // Set the postCompleted state to true
                    setPostCompleted(true);
                    // Modify the browser history to remove the current page
                    window.history.replaceState(null, null, '/home');
                    navigate('/home');
                })
                .catch((error) => {
                    console.error("Error creating transaction record:", error);
                });
        }
    };

    return (
        <div className="centered-card-wrapper">
            <Card className="centered-card">
                <CardContent>
                    <Typography variant="h5" componenet="h2">
                        Car ID: {carId}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Rental of the {productName} from {startDate.format('DD/MM/YYYY')} to {endDate.format('DD/MM/YYYY')} is successful.
                    </Typography>
                    <Typography variant="body2" component="p">
                        Thank you for using Rental electric car booking services!
                    </Typography>
                    <Typography variant="body2" component="p">
                        Show us the receipt sent to your email at our {currentLocation} branch to pick up the car. 
                    </Typography>
                    <Typography variant="body2" component="p">
                        Do email us at <a href="mailto:221658b@mymail.nyp.edu.sg">rental@gmail.com</a> if you have any questions.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleReturnToHomepage}>
                        Return to Homepage
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default Success;
