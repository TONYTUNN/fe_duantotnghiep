import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
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

    useEffect(() => {
        // Update email state if user email changes
        setEmail(user?.Email || '');

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/orders/user/${user.CustomerID}`);
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

        fetchOrders();
        fetchProducts();
        fetchUsers();
    }, [user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login'); // Chuyển hướng đến trang login sau khi đăng xuất
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            setChangePasswordError('Mật khẩu mới không khớp.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/custom/change-password', {
                Email: email,
                CurrentPassword: currentPassword,
                NewPassword: newPassword,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setChangePasswordSuccess(response.data.message);
            setChangePasswordError('');
            setShowModal(false); // Đóng modal sau khi đổi mật khẩu thành công
            toast.success('Đổi mật khẩu thành công.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error);
            setChangePasswordError(error.response?.data?.error || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.');
            setChangePasswordSuccess('');
            toast.error('Đổi mật khẩu thất bại.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const getProductName = (productId) => {
        const product = products.find(prod => prod.ProductID === productId);
        return product ? product.Name : 'Chưa xác định';
    };

    const getCustomerName = (customerId) => {
        const user = users.find(u => u.CustomerID === customerId);
        return user ? `${user.FirstName} ${user.LastName}` : 'Chưa xác định';
    };

    return (
        <Container style={{ maxWidth: '900px', marginTop: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem', color: '#333' }}>Profile</h1>
            {user ? (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '1.2rem', color: '#333' }}>CustomerID:</strong> {user.CustomerID}
                        </p>
                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '1.2rem', color: '#333' }}>FirstName:</strong> {user.FirstName}
                        </p>
                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '1.2rem', color: '#333' }}>LastName:</strong> {user.LastName}
                        </p>
                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '1.2rem', color: '#333' }}>Email:</strong> {user.Email}
                        </p>
                    </div>

                    <Button variant="danger" onClick={handleLogout} style={{ marginBottom: '20px' }}>Logout</Button>
                    <hr />
                    <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>Change Password</h2>
                    {changePasswordError && <Alert variant="danger">{changePasswordError}</Alert>}
                    {changePasswordSuccess && <Alert variant="success">{changePasswordSuccess}</Alert>}
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Change Password
                    </Button>

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Change Password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCurrentPassword">
                                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formNewPassword">
                                    <Form.Label>Mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formConfirmNewPassword">
                                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Xác nhận mật khẩu mới"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleChangePassword}>
                                    Change Password
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <hr />
                    <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>My Orders</h2>
                    {ordersError && <Alert variant="danger">{ordersError}</Alert>}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>OrderID</th>
                                <th>Customer Name</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Order Date</th>
                                <th>Ship Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map(order => (
                                <tr key={order.OrderID}>
                                    <td>{order.OrderID}</td>
                                    <td>{getCustomerName(order.CustomerID)}</td>
                                    <td>{getProductName(order.ProductID)}</td>
                                    <td>{order.Quantity}</td>
                                    <td>{order.TotalPrice}</td>
                                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                                    <td>{new Date(order.ShipDate).toLocaleDateString()}</td>
                                    <td>{order.Status}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>Không có đơn hàng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <Alert variant="info">Vui lòng đăng nhập để xem thông tin cá nhân.</Alert>
            )}

            <ToastContainer />
        </Container>
    );
};

export default Profile;
