import React from 'react';
import { Container, Row, Col, Carousel, Image, Button } from 'react-bootstrap';
import ProductList from '../compoments/ProductList';
import { Link } from 'react-router-dom'; // Thêm import Link
import '../style/home.css';

const Home = () => {
  return (
    <>
    
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={`${process.env.PUBLIC_URL}/images/Frame 4.png`}
            alt="First slide"
          />
          <Carousel.Caption>
           
            <p>Mùa hè mát lạnh </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={`${process.env.PUBLIC_URL}/images/image 101.png`}
            alt="Second slide"
          />
          <Carousel.Caption>
            
          <p>Mùa hè mát lạnh </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={`${process.env.PUBLIC_URL}/images/image 152.png`}
            alt="Third slide"
          />
          <Carousel.Caption>
            
          <p>Mùa hè mát lạnh </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container className="my-4">
      <div className="banner_home_1">
          <div className="banner_home_1_box1">
          <img src={`${process.env.PUBLIC_URL}/images/image 70.png`} alt="Khuyến mãi 1"  width="100%"/>
          </div>
          <div className="banner_home_1_box2">
            <div className='banner_home_1_box2_child'>
              <h2>Haagen-Dazs</h2>
              <h1>Hương Vị Của Tình Yêu</h1>
              <h4>Cheesecake New York, Chocolate Cookie Crumble và nhiều hương vị hơn nữa </h4>
              <Button className='button_details'>Xem Chi Tiết</Button>
            </div>
          </div>
        </div>
        
        <Row>
          <Col>
            <h2>Sản phẩm mới </h2>
            <ProductList />
          </Col>
        </Row>

        <div className="banner_home_2">
        <Image src={`${process.env.PUBLIC_URL}/images/image 99.png`} fluid />
        </div>

        <Row className="promotion-container my-4" >
          <Col md={8} style={{ display:'flex'}}>
            <Image src={`${process.env.PUBLIC_URL}/images/image 60.png`} style={{ width:'48%', marginRight:'25px'}} fluid />
            <Image src={`${process.env.PUBLIC_URL}/images/image 64.png`} style={{ width:'48%'}} fluid />
          </Col>
          <Col md={4} className="promotion-text">
            <h1>Exciting Promotions</h1>
            <p>Check out our latest offers and discounts on a wide range of products. Don’t miss out!</p>
            <Link to="/promotion">
              <Button className="button_promotion">See Promotions</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
