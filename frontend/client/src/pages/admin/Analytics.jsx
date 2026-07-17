import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import "../../css/adminAnalytics.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/stats/analytics');
            setAnalyticsData(res.data);
        } catch (error) {
            console.error("Error fetching analytics", error);
        }
        setLoading(false);
    };

    if (loading || !analyticsData) return <div className="loading">Loading Analytics...</div>;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Bar Chart Data
    const barData = {
        labels: analyticsData.monthlySales.map(item => monthNames[item._id - 1]),
        datasets: [
            {
                label: 'Monthly Sales',
                data: analyticsData.monthlySales.map(item => item.totalSales),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Pie Chart Data
    const pieData = {
        labels: analyticsData.categorySales.map(item => item._id),
        datasets: [
            {
                label: 'Sales by Category',
                data: analyticsData.categorySales.map(item => item.totalSales),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Line Chart Data
    const lineData = {
        labels: analyticsData.revenueGrowth.map(item => item._id),
        datasets: [
            {
                label: 'Revenue growth (Last 30 Days)',
                data: analyticsData.revenueGrowth.map(item => item.dailyRevenue),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 0.4)',
                tension: 0.1
            },
        ],
    };

    return (
        <div className="admin-analytics-container">
            <header className="analytics-header">
                <h1>Store Analytics</h1>
                <p>Visual trends for your business performance</p>
            </header>

            <div className="analytics-grid">
                <div className="chart-card bar-chart">
                    <h3>Monthly Sales Performance</h3>
                    <div className="chart-body">
                        <Bar data={barData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' }
                            }
                        }} />
                    </div>
                </div>

                <div className="chart-card pie-chart">
                    <h3>Sales Distribution by Category</h3>
                    <div className="chart-body">
                        <Pie data={pieData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom' }
                            }
                        }} />
                    </div>
                </div>

                <div className="chart-card line-chart">
                    <h3>Revenue Growth (Daily)</h3>
                    <div className="chart-body">
                        <Line data={lineData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
