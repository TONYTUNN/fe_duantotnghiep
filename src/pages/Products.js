import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import các icon cần thiết
import ProductCard from '../compoments/ProductCard';
import '../style/Product.css';
import banner_product from '../compoments/images/image 101.png';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const productsPerPage = 6;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:4000/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(parseInt(category));
      setCurrentPage(1);
    }
  }, [location]);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.CategoryID === selectedCategory)
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCategoryClick = categoryId => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <Container fluid className="px-3">
      {location.pathname === '/products' && (
        <div className="banner-product mb-4">
          <Image src={banner_product} alt="Banner" fluid />
        </div>
      )}

      <h1 className="text-center my-4">Sản Phẩm </h1>

      <div className="d-flex flex-column flex-md-row text-center">
        <div
          className="C-L mb-4 mb-md-0"
          style={{ width: '100%', maxWidth: '200px' }}
        >
          <ul className="list-unstyled">
            <li className="py-2">
              <a href="#" onClick={() => handleCategoryClick(1)}>
                Kem ốc quế
              </a>
            </li>
            <li className="py-2">
              <a href="#" onClick={() => handleCategoryClick(2)}>
                Kem que
              </a>
            </li>
            <li className="py-2">
              <a href="#" onClick={() => handleCategoryClick(3)}>
                Kem Mochi
              </a>
            </li>
            <li className="py-2">
              <a href="#" onClick={() => handleCategoryClick(4)}>
                Kem hộp 85g
              </a>
            </li>
            <li className="py-2">
              <a href="#" onClick={() => handleCategoryClick(5)}>
                Kem hộp 450g
              </a>
            </li>
            <li className="py-2">
              <a href="#" onClick={() => handleCategoryClick(6)}>
                Kem tươi
              </a>
            </li>
          </ul>
        </div>
        <div className="C-R" style={{ width: '100%' }}>
          <Row className="g-4">
            {currentProducts.map(product => (
              <Col key={product.ProductID} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <div className="pagination-controls d-flex justify-content-center align-items-center mt-4 p-trang">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="mx-2"
              style={{ background: 'rgb(115,38,44)', color: 'white' }}
            >
              <FaArrowLeft />
            </Button>
            <span>
               {currentPage} page{' '}
              {Math.ceil(filteredProducts.length / productsPerPage)}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
              }
              className="mx-2"
              style={{ background: 'rgb(115,38,44)', color: 'white' }}
            >
              <FaArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Products;

// ----------------------------------------
