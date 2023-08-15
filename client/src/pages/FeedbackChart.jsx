import React from 'react';
import { Bar } from 'react-chartjs-2';

function FeedbackChart({ data }) {
    const { labels, values } = data;

    const chartData = {
        labels: labels, // Array of rating values, e.g., ['1', '2', '3', '4', '5']
        datasets: [
            {
                label: 'Number of Ratings',
                data: values, // Array of counts for each rating value
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust the color as needed
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Ratings', // X-axis label
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Ratings', // Y-axis label
                },
            },
        },
    };

    return <Bar data={chartData} options={chartOptions} />;
}

export default FeedbackChart;