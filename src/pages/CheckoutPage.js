import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Card,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PaypalSubscriptionButton from './PaypalSubscriptionButton';
import { clearCart } from '../redux/slices/cartSlice';
import banner_checkout from '../compoments/images/image 104.png';
import '../style/Checkout.css';
import checkMark from '../compoments/images/Check Mark.png';
import { useToast } from '../hooks/useToast';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const [formValues, setFormValues] = useState({
    Address: '',
    City: '',
    Zip: '',
    StoreID: '',
  });
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [stores, setStores] = useState([]);
  const { errorToast, successToast } = useToast();
  const [showQRCodeModal, setShowQRCodeModal] = useState(false); // State for QR Code modal
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showError, setShowError] = useState(false);
  // test
  // 

  const generateQRCode = async (text) => {
    try {
      const response = await axios.get('http://localhost:4000/generate-qr', {
        params: { text }
      });
      setQrCodeUrl(response.data.qrCodeUrl);
      setShowQRCodeModal(true); // Show QR code modal after generating QR code
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleGenerateQRCode = () => {
    const text = 'Some text to encode in QR code'; // Replace with dynamic content as needed
    generateQRCode(text);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storeResponse = await axios.get('http://localhost:4000/stores');
        setStores(storeResponse.data);
      } catch (err) {
        errorToast('Lỗi khi lấy thông tin cửa hàng.');
      }
    };
    fetchStores();
  }, [errorToast]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      errorToast('Vui lòng đăng nhập để tiếp tục.');
      navigate('/login');
    } else {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch('http://localhost:4000/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Không thể lấy thông tin người dùng.');
          }
          const data = await response.json();
          setUser(data);
        } catch (error) {
          errorToast(`Lỗi: ${error.message}`);
          navigate('/login');
        }
      };
      fetchUserProfile();
    }
  }, [errorToast, navigate]);

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (total, item) => total + Number(item.Price) * 1000 * item.quantity,
      0,
    );
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(total);
  };
  // const handlePlaceOrder = async e => {
  //   e.preventDefault();
  //   setShowModal(true);
  // };

  const handlePlaceOrder = async e => {
    e.preventDefault();
    if (formValues.Address && formValues.City && formValues.Zip && formValues.StoreID) {
      setShowModal(true);
    } else {
      setShowError(true);
    }
  };


  const handlePaymentMethodSelect = async method => {
    setShowModal(false);

    const orderDetails = {
      CustomerID: user?.CustomerID,
      ProductID: cartItems[0].ProductID,
      OrderDate: new Date().toISOString().split('T')[0],
      ShipDate: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .split('T')[0],
      Status: 'Chờ Thanh Toán',
      Quantity: cartItems.reduce((total, item) => total + item.quantity, 0),
      TotalPrice: calculateTotal(),
      PaymentMethod: method === 'paypal' ? 'PayPal' : 'Thanh toán khi nhận hàng',
      Address: formValues.Address,
      City: formValues.City,
      Zip: formValues.Zip,
      StoreID: formValues.StoreID,
    };

    console.log(orderDetails); // Debugging: log the order details

    try {
      const response = await axios.post('http://localhost:4000/orders', orderDetails);

      if (response.status !== 201) {
        throw new Error('Đặt hàng thất bại.');
      }

      setOrderPlaced(true);
      setShowSuccessModal(true);
      dispatch(clearCart());
    } catch (error) {
      errorToast(`Đặt hàng thất bại: ${error.message}`);
    }
  };

  const handlePayPalSuccess = (details, data) => {
    console.log('Payment approved by PayPal:', details, data);
    dispatch(clearCart());
    setShowSuccessModal(true);
  };

  const handleChange = e => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const formatNumber = (num) => {
    return num.toLocaleString('vi-VN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  };
  return (
    <Container className="checkout-container" style={{ background: '#fff' }}>
      <div className="banner_Checkout">
        <img src={banner_checkout} alt="Checkout Banner" className="img-fluid" />
      </div>

      <h1 className="checkout-title">Thanh Toán</h1>

      {orderPlaced ? (
        <div className="order-success">
          <div>
            <p>Đặt hàng thành công! Cảm ơn bạn đã mua hàng.</p>
            <img style={{ margin: 'auto' }} src={checkMark} className="checlMask" />
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <p className="empty-cart-message">Giỏ hàng của bạn đang trống</p>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={8}>
              <h4 style={{ padding: '20px 0' }}>Địa chỉ giao hàng</h4>
              <Form onSubmit={handlePlaceOrder}>
                <Form.Group controlId="formStoreID">
                  <Form.Label style={{ fontWeight: '600' }}>Cửa Hàng</Form.Label>
                  <Form.Control
                    as="select"
                    name="StoreID"
                    value={formValues.StoreID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn Cửa Hàng</option>
                    {stores.map(store => (
                      <option key={store.StoreID} value={store.StoreID}>
                        {store.StoreName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label style={{ fontWeight: '600', margin: '10px 0' }}>
                    Địa chỉ
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập địa chỉ"
                    name="Address"
                    value={formValues.Address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCity">
                  <Form.Label style={{ fontWeight: '600', margin: '10px 0' }}>
                    Thành phố
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập thành phố"
                    name="City"
                    value={formValues.City}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicZip">
                  <Form.Label style={{ fontWeight: '600', margin: '10px 0' }}>
                    Số điện thoại
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại"
                    name="Zip"
                    value={formValues.Zip}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <button
                  variant="custom"
                  type="submit"
                  className="w-100"
                  style={{ background: '#73262C', color: '#fff' }}
                >
                  Đặt hàng
                </button>
              </Form>
            </Col>
            <Col md={4} style={{ background: '#fff' }}>
              <div className="cart-box">
                <h4 className="text-center mb-3">Giỏ hàng của bạn</h4>
                {cartItems.map(item => (
                  <Card key={item.ProductID} className="cart-item-card mb-3">
                    <Card.Body style={{ background: '#fff' }}>
                      <Card.Title>{item.Name}</Card.Title>
                      <hr />
                      <Card.Text>
                        <strong>Số lượng:</strong> {item.quantity}
                      </Card.Text>
                      <hr />
                      <Card.Text>
                        <strong>Giá:</strong> {formatNumber(item.Price * item.quantity)} VND
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
                <div className="total-price text-center mt-3">
                  <p>Tổng giá sản phẩm: {calculateTotal()}</p>
                </div>
              </div>
            </Col>
          </Row>
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col xs={6}>
                  <Button
                    variant="custom"
                    onClick={() => handlePaymentMethodSelect('creditCard')}
                    className="w-100 payment-button"
                    style={{ background: '#73262C', color: '#fff' }}
                  >
                    Thanh toán khi nhận hàng
                  </Button>
                </Col>
                <Col xs={6} className="d-flex justify-content-end">
                  <div className="paypal-button-container">
                    <PaypalSubscriptionButton onSuccess={handlePayPalSuccess} />
                  </div>
                </Col>
                {/* <Col xs={6}>
                  <Button
                    variant="custom"
                    className="w-100 payment-button"
                    style={{ background: '#73262C', color: '#fff' }}
                  >
                    Thanh toán QR zalopay
                  </Button>
                </Col> */}
                <Col xs={6}>
                  <Button
                    variant="custom"
                    className="w-100 payment-button"
                    style={{ background: '#73262C', color: '#fff' }}
                    onClick={handleGenerateQRCode} // Thêm sự kiện onClick để gọi API tạo mã QR
                  >
                    Thanh toán QR ZaloPay
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
          {/* Success Modal */}
          {/* QR Code Modal */}
          <Modal
            show={showQRCodeModal}
            onHide={() => setShowQRCodeModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Zalo Pay QR Code</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {qrCodeUrl ? (
                <div>
                  <h3 className='zalo-pay'>Zalo Pay QR Code:</h3>
                  <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%' }} />
                </div>
              ) : (
                <div>
                  <img style={{ margin: 'auto' }} src="data:image/png;base64,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" alt="ZaloPay QR Code" />
                </div>
              )}
            </Modal.Body>
          </Modal>

          <Modal
            show={showSuccessModal}
            onHide={() => setShowSuccessModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Đơn Hàng Của Bạn Đã Đặt Thành Công</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <h5>Chúng tôi sẽ giao hàng cho bạn trong thời gian sớm nhất.</h5>
              <p style={{ color: '#d9534f', marginTop: '10px' }}>
                <strong>Chú ý:</strong> Vui lòng kiểm tra lại số điện thoại của bạn để chúng tôi có thể liên hệ dễ dàng nếu cần thiết.
              </p>
              <Button
                variant="custom"
                onClick={() => setShowSuccessModal(false)}
                style={{ background: '#73262C', color: '#fff' }}
              >
                Đóng
              </Button>
            </Modal.Body>
          </Modal>

        </>
      )}
    </Container>
  );
};

export default CheckoutPage;


// // // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


