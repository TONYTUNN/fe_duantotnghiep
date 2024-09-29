// src/components/CustomNavbar.js
import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';
import '../style/CustomNavbar.css';
import axios from 'axios'; // Import axios để lấy danh mục
import '../style/Navbar.css';

const CustomNavbar = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const { user, token } = useSelector(state => state.auth); // Lấy thông tin người dùng và token từ Redux
  const dispatch = useDispatch();
  const [categories, setCategories] = React.useState([]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token'); // Xóa token khỏi localStorage
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/categories');
        setCategories(response.data || []); // Đảm bảo categories luôn là mảng
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container className="navbar">
        <LinkContainer to="/">
          <Navbar.Brand className="me-auto" style={{ marginRight: 'auto' }}>
            <img
              className="d-block w-100 logo"
              src={`${process.env.PUBLIC_URL}/images/image 11.png`}
              alt="Second slide"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/products">
              <Nav.Link>Sản Phẩm</Nav.Link>
            </LinkContainer>
            <NavDropdown
              title="Danh mục"
              id="basic-nav-dropdown"
              className="custom-dropdown"
              style={{
                '--bs-dropdown-link-active-bg':
                  'transparent' /* Ghi đè màu nền cho mục đã chọn */,
                '--bs-dropdown-link-active-color':
                  'black' /* Màu chữ của mục đã chọn */,
              }}
            >
              {categories.length > 0 ? (
                categories.map(category => (
                  <LinkContainer
                    className="category-btnv1"
                    key={category.CategoryID}
                    to={{
                      pathname: '/products',
                      search: `?category=${category.CategoryID}`,
                    }}
                  >
                    <NavDropdown.Item
                      style={{ backgroundColor: 'transparent' }}
                    >
                      {category.Name}
                    </NavDropdown.Item>
                  </LinkContainer>
                ))
              ) : (
                <NavDropdown.Item disabled>Không có danh mục</NavDropdown.Item>
              )}
            </NavDropdown>
            <LinkContainer to="/about">
              <Nav.Link>Giới Thiệu</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact">
              <Nav.Link>Liên Hệ</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/Promotion">
              <Nav.Link>Khuyễn Mãi</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav className="ms-auto">
            <LinkContainer to="/search">
              <Nav.Link>
                <FaSearch />
              </Nav.Link>
            </LinkContainer>
            {user && token ? ( // Kiểm tra nếu có user và token
              <NavDropdown title={<FaUser />} id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <strong>
                    {user.FirstName} {user.LastName}
                  </strong>{' '}
                  {/* Hiển thị tên người dùng */}
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <LinkContainer to="/profile">
                    <Nav.Link>Trang cá nhân</Nav.Link>
                  </LinkContainer>
                </NavDropdown.Item>
                {user.Role === 'admin' && ( // Hiển thị menu Admin nếu vai trò là admin
                  <NavDropdown.Item>
                    <LinkContainer to="/admin">
                      <Nav.Link>Admin</Nav.Link>
                    </LinkContainer>
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item>
                  <Button
                    variant=""
                    className="btn-logout"
                    style={{ background: '#73262C', color: '#fff' }}
                    onClick={handleLogout}
                  >
                    Thoát
                  </Button>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>
                  <FaUser />
                </Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/cart">
              <Nav.Link>
                <FaShoppingCart />
                {cartItems.length > 0 && (
                  <span className="badge bg-secondary ms-1">
                    {cartItems.length}
                  </span>
                )}
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
