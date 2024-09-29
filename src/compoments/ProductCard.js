import React, { useState, useEffect } from 'react';
import { Card, Modal, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../style/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const { user, token } = useSelector(state => state.auth);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.Name} đã được thêm vào giỏ hàng`, {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // api best seller
  const [bestSellers, setBestSellers] = useState([]);
// 
const handleShow = (product) => {
  setSelectedProduct(product);  
  setShow(true);              
};
useEffect(() => {
  const fetchBestSellers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/latest-sales');
      setBestSellers(response.data);
    } catch (err) {
      setError('Không thể lấy danh sách sản phẩm bán chạy. Vui lòng thử lại sau.');
    }
  };

  if (show) {
    fetchBestSellers();
  }
}, [show]);

  // 
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/comments/${product.ProductID}`,
        );
        setComments(response.data.filter(comment => !comment.IsHidden));
      } catch (err) {
        setError('Không thể lấy comments. Vui lòng thử lại sau.');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        const usersData = response.data.reduce((acc, user) => {
          acc[user.CustomerID] = {
            FirstName: user.FirstName,
            LastName: user.LastName,
          };
          return acc;
        }, {});
        setUsers(usersData);
      } catch (err) {
        setError('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
      }
    };

    fetchComments();
    fetchUsers();
  }, [product.ProductID]);

  const handleHideComment = async commentId => {
    try {
      if (user && user.admin) {
        await axios.post(
          `http://localhost:4000/comments/hide/${commentId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setComments(
          comments.filter(comment => comment.CommentID !== commentId),
        );
        toast.success('Bình luận đã được ẩn thành công');
      } else {
        toast.error('Bạn không có quyền để ẩn bình luận.');
      }
    } catch (err) {
      toast.error('Không thể ẩn bình luận. Vui lòng thử lại sau.');
    }
  };

  const handleReplyChange = e => setReplyText(e.target.value);

  const handleReplySubmit = async e => {
    e.preventDefault();
    if (replyToCommentId && replyText) {
      if (!user || !user.CustomerID) {
        toast.warn('Bạn cần đăng nhập để gửi bình luận trả lời.');
        return;
      }
      try {
        await axios.post(
          `http://localhost:4000/comments/reply/${replyToCommentId}`,
          {
            ProductID: product.ProductID,
            CustomerID: user.CustomerID,
            Comment: replyText,
            Rating: 0,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setComments([
          ...comments,
          {
            CommentID: Date.now(),
            CustomerID: user.CustomerID,
            Comment: replyText,
            Rating: 0,
            CommentDate: new Date(),
            ParentCommentID: replyToCommentId,
          },
        ]);
        setReplyText('');
        setReplyToCommentId(null);
        toast.success('Trả lời bình luận thành công');
      } catch (err) {
        toast.error('Không thể gửi bình luận trả lời. Vui lòng thử lại sau.');
      }
    } else {
      toast.warn(
        'Vui lòng nhập nội dung bình luận và chọn bình luận để trả lời.',
      );
    }
  };
  const handleProductClick = (item) => {
    setSelectedProduct(item);
    handleShow(); // Show modal when product is clicked
  };

  const handleNewCommentChange = e => setNewCommentText(e.target.value);

  const handleNewCommentSubmit = async e => {
    e.preventDefault();
    if (newCommentText) {
      if (!user || !user.CustomerID) {
        toast.warn('Bạn cần đăng nhập để gửi bình luận.');
        return;
      }
      try {
        await axios.post(
          'http://localhost:4000/comments',
          {
            ProductID: product.ProductID,
            CustomerID: user.CustomerID,
            Comment: newCommentText,
            Rating: 0,
            CommentDate: new Date(),
            IsHidden: false,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setComments([
          ...comments,
          {
            CommentID: Date.now(),
            CustomerID: user.CustomerID,
            Comment: newCommentText,
            Rating: 0,
            CommentDate: new Date(),
            ParentCommentID: null,
          },
        ]);
        setNewCommentText('');
        toast.success('Bình luận đã được thêm thành công');
      } catch (err) {
        toast.error('Không thể gửi bình luận. Vui lòng thử lại sau.');
      }
    } else {
      toast.warn('Vui lòng nhập nội dung bình luận.');
    }
  };

  return (
    <>
      <Card
        className={`product-card ${product.Stock === 0 ? 'out-of-stock' : ''}`}
      >
        <div className="img-container">
          <Card.Img variant="top" src={product.ImagePath} />
          {product.Stock === 0 && (
            <div className="out-of-stock-overlay">Hết hàng</div>
          )}
          <div
            className="overlay"
            style={{ backgroundColor: 'rgba(0, 0, 0,0.2)' }}
          >
            <button
              style={{ background: '#F1D7B6' }}
              className="btn-xemchitiet"
              onClick={handleShow}
            >
              Xem Chi Tiết
            </button>
          </div>
        </div>
        <Card.Body>
          <Card.Title style={{ padding: '15px 0' }}>{product.Name}</Card.Title>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <Card.Text style={{ fontWeight: '600', fontSize: '15px' }}>
              {product.Price*1000} VND
            </Card.Text>
            <button
              className="btn-product-cart-body"
              onClick={handleAddToCart}
              disabled={product.Stock === 0}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleClose}
          >
            <span
              style={{ fontSize: '40px', position: 'relative', top: '-20px' }}
            >
              &#215;
            </span>
          </button>
          <Modal.Title style={{ position: 'absolute' }}>
            {product.Name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '92px',
              background: '#FFF9E5',
              borderRadius: '10px',
            }}
          >
            <div style={{ flex: '1', paddingRight: '10px' }}>
              <img
                src={product.ImagePath}
                alt={product.Name}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              />
            </div>
            <div style={{ flex: '1', paddingLeft: '10px', marginTop: '115px' }}>
              <h2 style={{ textAlign: 'center', fontSize: '26px' }}>
                {product.Name}
              </h2>
              <h2 style={{ textAlign: 'center', fontSize: '18px' }}>
                {product.Description}
              </h2>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: '10px',
                  padding: '10px',
                }}
              >
                {product.Price} VND
              </p>
              <Button
                onClick={handleAddToCart}
                style={{
                  backgroundColor: '#73262C',
                  color: '#fff',
                  width: '100%',
                  marginTop: '1rem',
                }}
                disabled={product.Stock === 0}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
          <div style={{ marginTop: '2rem' }}>
            {/*  */}
            <div className="best-sellers-container">
              <h2>Sản phẩm bán chạy:</h2>
              {bestSellers.length > 0 ? (
                <ul className="best-sellers-list">
                  {bestSellers.slice(0, 5).map((item, index) => (
                    <li key={index} className="best-sellers-item" onClick={() => handleProductClick(item)}>
                      <img src={item.ImagePath} alt={item.Name} />
                      <div className="product-name">{item.Name}</div>
                      <button className='btn-best-saleller' onClick={() => handleProductClick(item)}></button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có sản phẩm bán chạy.</p>
              )}
            </div>
            <hr />
            {/*  */}
            <h5>bình luận:</h5>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <p>không có bình luận.</p>
            )}
            {comments.length > 0 &&
              comments.map(comment => (
                <div key={comment.CommentID} className="comment">
                  <p>
                    <strong>
                      {users[comment.CustomerID]?.FirstName}{' '}
                      {users[comment.CustomerID]?.LastName}
                    </strong>
                    <span>
                      {' '}
                      ({new Date(comment.CommentDate).toLocaleDateString()})
                    </span>
                  </p>
                  <p>{comment.Comment}</p>
                  {user && user.isAdmin && (
                    <button
                      onClick={() => handleHideComment(comment.CommentID)}
                    >
                      Ẩn
                    </button>
                  )}
                  <Form onSubmit={handleReplySubmit}>
                    <Form.Control
                      type="text"
                      placeholder="Trả lời..."
                      value={replyText}
                      onChange={handleReplyChange}
                      onClick={() => setReplyToCommentId(comment.CommentID)} 
                    />
                    <Button id='btn-tl' type="submit">Trả lời</Button>
                  </Form>
                </div>
              ))}
            <Form
              onSubmit={handleNewCommentSubmit}
              style={{ marginTop: '1rem' }}
            >
              <Form.Group controlId="newComment">
                <Form.Label>Viết bình luận của bạn:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập bình luận của bạn..."
                  value={newCommentText}
                  onChange={handleNewCommentChange}
                />
              </Form.Group>
              <Button
                type="submit"
                style={{ marginTop: '0.5rem', background: '#73262C' }}
              >
                Gửi bình luận
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductCard;
