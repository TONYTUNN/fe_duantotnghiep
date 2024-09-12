import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import '../style/statistic.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../style/statistics.css'; // Đảm bảo đường dẫn đến file CSS đúng

// Đăng ký các thành phần cần thiết với Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Statistics = () => {
  const [orderData, setOrderData] = useState([]);
  const [yearlySalesStats, setYearlySalesStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const orderResponse = await axios.get('http://localhost:4000/orders');
        setOrderData(orderResponse.data);

        const yearlySalesResponse = await axios.get(
          'http://localhost:4000/sales/yearly',
        );
        setYearlySalesStats(yearlySalesResponse.data);

        const revenueResponse = await axios.get(
          'http://localhost:4000/revenue-stats',
        );
        setRevenueStats(revenueResponse.data);

        const productResponse = await axios.get(
          'http://localhost:4000/product-stats',
        );
        setProductStats(productResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Lỗi khi lấy thông tin thống kê.');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Prepare data for the orders chart
  const orderDates = orderData.map(order =>
    new Date(order.OrderDate).toLocaleDateString(),
  );
  const orderCounts = orderDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const orderChartData = {
    labels: Object.keys(orderCounts),
    datasets: [
      {
        label: 'Số lượng đơn hàng theo ngày',
        data: Object.values(orderCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the revenue stats chart
  const revenueChartData = {
    labels: revenueStats.map(stat => stat.Name),
    datasets: [
      {
        label: 'Doanh thu theo sản phẩm',
        data: revenueStats.map(stat =>
          parseFloat(stat.TotalRevenue.replace(/,/g, '')),
        ), // Remove commas from TotalRevenue
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Ensure productStats is an object with properties
  const totalProducts = productStats.totalProducts || 0;
  const inStock = productStats.inStock || '0';
  const outOfStock = productStats.outOfStock || 0;

  // Prepare data for the yearly sales chart
  const yearlySalesChartData = {
    labels: yearlySalesStats.map(stat => stat.year),
    datasets: [
      {
        label: 'Doanh số hàng năm',
        data: yearlySalesStats.map(stat =>
          parseFloat(stat.totalSales.replace(/,/g, '')),
        ), // Remove commas from totalSales
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Số lượng hàng năm',
        data: yearlySalesStats.map(stat =>
          parseFloat(stat.totalQuantity.replace(/,/g, '')),
        ), // Remove commas from totalQuantity
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <Container>
      <h1 className="chart-title" style={{ marginLeft: '-23rem' }}>
        Thống Kê
      </h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="card-custom">
            <Card.Body>
              <Card.Title>Số lượng sản phẩm</Card.Title>
              <Card.Text>{totalProducts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-custom">
            <Card.Body>
              <Card.Title>Số lượng còn hàng</Card.Title>
              <Card.Text>{inStock}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-custom">
            <Card.Body>
              <Card.Title>Số lượng hết hàng</Card.Title>
              <Card.Text>{outOfStock}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <div className="chart-row">
            <h2 className="chart-title">Doanh thu theo sản phẩm</h2>
            <div className="chart-container" style={{ height: '300px' }}>
              <Doughnut data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="chart-row">
            <h2 className="chart-title">Số lượng đơn hàng theo ngày</h2>
            <div className="chart-container" style={{ height: '300px' }}>
              <Bar data={orderChartData} options={chartOptions} />
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="chart-row">
            <h2 className="chart-title">Doanh số và số lượng hàng năm</h2>
            <div className="chart-container" style={{ height: '300px' }}>
              <Bar data={yearlySalesChartData} options={chartOptions} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Statistics;
