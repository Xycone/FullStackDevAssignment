import React from "react";
import { useLocation } from 'react-router-dom';

function Success() {
    const location = useLocation();
    const formData = location.state;
    const savePayment = (data) => {
        data.carId = data.carId.trim();
        data.make = data.make.trim();
        data.model = data.model.trim();
        data.price = Number(data.price);
        data.date = data.date.trim();
        http.post("/payment", data).then((res) => {
            console.log(res.data);
        });
    };
    savePayment(formData);
    return (
        <>
            <h2>Thanks for your order!</h2>
            <h4>Your payment is successful.</h4>
            <p>
                We appreciate your business! If you have any questions, please email us
                at
                <a href="mailto:221658b@mymail.nyp.edu.sg">rental@gmail.com</a>.
            </p>
            <div>
            </div>
        </>
    );
}

export default Success;
