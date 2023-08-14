import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

function FeedbackChart({ feedbackList }) {
    useEffect(() => {
        if (feedbackList.length > 0) {
            // Data preparation for the chart
            const labels = feedbackList.map((feedback) => feedback.rating);
            const data = feedbackList.map((feedback) => feedback.responded);

            // Set up the chart
            const ctx = document.getElementById('feedbackChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Responded',
                            data: data,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [feedbackList]);

    return (
        <div>
            <canvas id="feedbackChart" width="400" height="200"></canvas>
        </div>
    );
}

export default FeedbackChart;
