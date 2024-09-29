import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import '../style/login.css'
import '../style/Logins.css';
import ReactFacebookLogin from 'react-facebook-login';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Xử lý phản hồi từ Facebook
  const responseFacebook = async response => {
    const { accessToken, userID, email, name, picture } = response;

    try {
      // Gửi yêu cầu đăng nhập Facebook lên backend
      const result = await axios.post('http://localhost:4000/facebook-login', {
        accessToken,
        userID,
        email,
        name,
        picture,
      });

      const { token } = result.data;

      // Lưu token vào localStorage
      localStorage.setItem('token', token);

      // Gọi API để lấy thông tin người dùng
      const userResponse = await axios.get('http://localhost:4000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cập nhật Redux state với thông tin người dùng và token
      dispatch(login({ user: userResponse.data, token }));

      // Hiển thị thông báo thành công
      toast.success('Đăng nhập bằng Facebook thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập bằng Facebook:', error);
      setError('Đăng nhập bằng Facebook thất bại. Vui lòng thử lại.');
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', {
        Email: email,
        Password: password,
      });
      const { token } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem('token', token);

      // Gọi API để lấy thông tin người dùng
      const userResponse = await axios.get('http://localhost:4000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cập nhật Redux state với thông tin người dùng và token
      dispatch(login({ user: userResponse.data, token }));

      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    }
  };

  const loginBackground = {
    background: `url('/images/image 83.png') no-repeat center center/cover`,
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 0,
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '8rem', // Tăng padding để form lớn hơn
    borderRadius: '8px',
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '50%', // Tăng kích thước tối đa của form
    margin: '0 auto',
  };

  return (
    <div style={loginBackground} className="conainer-login">
      <div style={overlayStyle}></div>
      <Container style={formStyle}>
        <h1 style={{ textAlign: 'center' }}>Đăng nhập</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label style={{ fontWeight: '600' }}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label style={{ fontWeight: '600', margin: '10px 0' }}>
              Mật khẩu
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="btn-login"
            style={{ background: '#73262C', color: '#fff' }}
          >
            Đăng nhập
          </Button>
        </Form>

        <p className="mt-3">
          Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
        </p>
        <hr />
        <ReactFacebookLogin
          className="DNfacebook"
          appId="1028108995645454" //
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
        />
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
