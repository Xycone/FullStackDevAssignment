import React from 'react'
import { useLocation } from 'react-router-dom';

function PaymentPage() {
    const location = useLocation();
    const formData = location.state;

    return (
        <div>
            <h2>Payment Details</h2>
            <p>Car id: {formData.carId}</p>
            <p>Car make: {formData.make}</p>
            <p>Car model: {formData.model}</p>
            <p>Car range: {formData.range}</p>
            <p>Price: S${formData.price}/day</p>
            <p>Total Amount: ${formData.totalAmount}</p>
        </div>
    )
}

export default PaymentPage