import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Statistics from './Statistics';
import '../style/admin.css';

const Admin = () => {
  return (
    <Container fluid className="admin-container">
      <h1 className="admin-title"></h1>

      <Row className="g-0">
        <Col md={3} className="admin-sidebar">
          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">
                Quản lý người dùng
              </Card.Title>
              <Link to="/admin/users">
                <Button className="btn_admin">Xem Người Dùng</Button>
              </Link>
            </Card.Body>
          </Card>

          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">
                Quản lý đơn hàng
              </Card.Title>
              <Link to="/admin/orders">
                <Button className="btn_admin" variant="primary">
                  Xem Đơn Hàng
                </Button>
              </Link>
            </Card.Body>
          </Card>

          {/* <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">
                Quản lý khuyến mãi
              </Card.Title>
              <Link to="/admin/discounts">
                <Button className="btn_admin" variant="primary">
                  Xem Khuyến Mãi
                </Button>
              </Link>
            </Card.Body>
          </Card> */}

          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">
                Quản lý sản phẩm
              </Card.Title>
              <Link to="/admin/products">
                <Button className="btn_admin" variant="primary">
                  Xem Sản Phẩm
                </Button>
              </Link>
            </Card.Body>
          </Card>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">
                Quản lý cửa hàng
              </Card.Title>
              <Link to="/admin/stores">
                <Button className="btn_admin" variant="primary">
                  Xem Cửa Hàng
                </Button>
              </Link>
            </Card.Body>
          </Card>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">
                Quản lý voucher
              </Card.Title>
              <Link to="/admin/vouchers">
                <Button className="btn_admin" variant="primary">
                  Xem Voucher
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9} className="admin-main-content">
          <Statistics />
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
