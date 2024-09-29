import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/profile.css';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState(user?.Email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState('');
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState('');
  const [stores, setStores] = useState([]);
  const [storesError, setStoresError] = useState('');

  const firstLoad = useRef(true);

  useEffect(() => {
    if (user && firstLoad.current) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/orders/user/${user.CustomerID}`,
          );
          setOrders(response.data);
        } catch (err) {
          setOrdersError('Lỗi khi lấy thông tin đơn hàng.');
        }
      };

      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:4000/products');
          setProducts(response.data);
        } catch (err) {
          setProductsError('Lỗi khi lấy thông tin sản phẩm.');
        }
      };

      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:4000/users');
          setUsers(response.data);
        } catch (err) {
          setUsersError('Lỗi khi lấy thông tin khách hàng.');
        }
      };

      const fetchStores = async () => {
        try {
          const response = await axios.get('http://localhost:4000/stores');
          setStores(response.data);
        } catch (err) {
          setStoresError('Lỗi khi lấy thông tin cửa hàng.');
        }
      };

      fetchOrders();
      fetchProducts();
      fetchUsers();
      fetchStores();
      firstLoad.current = false;
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    firstLoad.current = true;
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setChangePasswordError('Mật khẩu mới không khớp.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/custom/change-password',
        {
          Email: email,
          CurrentPassword: currentPassword,
          NewPassword: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );

      setChangePasswordSuccess(response.data.message);
      setChangePasswordError('');
      setShowModal(false);
      toast.success('Đổi mật khẩu thành công.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      setChangePasswordError(
        error.response?.data?.error ||
        'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.',
      );
      setChangePasswordSuccess('');
      toast.error('Đổi mật khẩu thất bại.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const getProductName = productId => {
    const product = products.find(prod => prod.ProductID === productId);
    return product ? product.Name : 'Chưa xác định';
  };

  const getCustomerName = customerId => {
    const user = users.find(u => u.CustomerID === customerId);
    return user ? `${user.FirstName} ${user.LastName}` : 'Chưa xác định';
  };

  const getStoreName = storeId => {
    const store = stores.find(store => store.StoreID === storeId);
    return store ? store.StoreName : 'Chưa xác định';
  };

  return (
    <Container
      style={{ maxWidth: '900px', marginTop: '20px', padding: '50px' }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '2rem',
          color: '#333',
        }}
      >
        Thông tin cá nhân
      </h1>
      {user ? (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* <th>CustomerID:</th> */}
                <th>Họ:</th>
                <th>Tên:</th>
                <th>Email:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* <td>{user.CustomerID}</td> */}
                <td>{user.FirstName}</td>
                <td>{user.LastName}</td>
                <td>{user.Email}</td>
              </tr>
            </tbody>
          </Table>

          <hr />
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>
            Đổi mật khẩu
          </h2>
          {changePasswordError && <Alert variant="danger">{changePasswordError}</Alert>}
          {changePasswordSuccess && <Alert variant="success">{changePasswordSuccess}</Alert>}
          <Button style={{ background: '#73262C' }} variant="primary" onClick={() => setShowModal(true)}>
          Đổi mật khẩu
          </Button>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              {/* <Modal.Title>Change Password</Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCurrentPassword">
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmNewPassword">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button style={{ background: '#73262C' }} variant="primary" onClick={handleChangePassword}>
                Đổi mật khẩu
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn-dong"
                style={{ background: '#73262C', color: '#fff' }}
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>

          <hr />
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>
            Đơn hàng 
          </h2>
          {ordersError && <Alert variant="danger">{ordersError}</Alert>}
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* <th>OrderID</th> */}
                <th>Tên khách hàng</th>
                <th>Sản phẩm </th>
                <th>Số lượng</th>
                <th>Tổng đơn hàng</th>
                <th>Ngày đặt</th>
                <th>Ngày giao</th>
                <th>Trạng thái</th>
                <th>Cửa hàng</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.OrderID}>
                    {/* <td>{order.OrderID}</td> */}
                    <td>{getCustomerName(order.CustomerID)}</td>
                    <td>{getProductName(order.ProductID)}</td>
                    <td>{order.Quantity}</td>
                    <td>{order.TotalPrice}</td>
                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                    <td>{new Date(order.ShipDate).toLocaleDateString()}</td>
                    <td>{order.Status}</td>
                    <td>{getStoreName(order.StoreID)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="warning">Vui lòng đăng nhập để xem thông tin cá nhân.</Alert>
      )}
      <ToastContainer />
    </Container>
  );
};

export default Profile;
