import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from 'react-router-dom';

function StripePayment() {
    const location = useLocation();
    const formData = location.state;
    const [carList, setCarList] = useState([]);
    const idAsNumber = parseInt(formData.carId, 10);
    const matchingCar = formData.carId;
    const makePayment = async () => {
        const stripe = await loadStripe("pk_test_51NGHyVLq1Rg4FQjeLKdp1qDL1lbEx30qHo5KgKbUXjdp7jLd324xodhshAqQdIiE7b6LInbIhRJEplaifFYINmAo00EKmjq5ye");
        const body = { product };
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
    const productName = `${formData.make} ${formData.model}`;
    const productDescription = `Range: ${formData.range}\nPrice per day: ${formData.price}\nLocation: ${formData.price}`;
    const [product, setProduct] = useState({
        name: productName,
        price: formData.totalAmount,
        description: productDescription,
        quantity: 1,
    });

    return (
        <Card style={{ width: "50%", height: "50%" }}>
            {/* {matchingCar.listing.imageFile && (
                <JoyCssVarsProvider>
                    <AspectRatio>
                        <Box component="img" src={`${import.meta.env.VITE_FILE_BASE_URL}${matchingCar.listing.imageFile}`} alt="listings" />
                    </AspectRatio>
                </JoyCssVarsProvider>
            )} */}
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Button variant="primary" onClick={makePayment}>
                    Buy Now for {product.price}
                </Button>
            </Card.Body>
        </Card>

    );
}
export default StripePayment;

