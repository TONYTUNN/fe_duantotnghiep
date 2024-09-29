// ----------------------------------------------------------------------------------------------
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../style/Cart.css';
import {
  removeFromCart,
  updateQuantity,
  updateDiscount,
} from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import banner_shoppingCart from '../compoments/images/image 104.png';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState('');

  const handleRemoveFromCart = ProductID => {
    dispatch(removeFromCart(ProductID));
  };

  const handleQuantityChange = (ProductID, quantity) => {
    dispatch(updateQuantity({ ProductID, quantity }));
  };

  const handleAddDiscount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/discounts/${discount}`,
      );
      const isExistProduct = cartItems.find(
        item => item.ProductID === response.data.ProductID,
      );
      if (isExistProduct) {
        dispatch(updateDiscount(response.data));
        toast.success('Mã giảm giá áp dụng thành công.', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Mã giảm giá không thể áp dụng cho các sản phẩm này.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('Mã giảm giá không tồn tại.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (total, item) => total + Number(item.Price) *1000* item.quantity,
      0,
    );
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(total);
  };

  return (
    <div className="cart-container">
      <div className="banner_shoppingCart">
        <img src={banner_shoppingCart} alt="Shopping Cart Banner" />
      </div>
      <div className="cart-header">
        <h2>Giỏ Hàng</h2>
      </div>
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <p>Giỏ hàng của bạn trống</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.ProductID} className="cart-item">
                  <img src={item.ImagePath} alt={item.Name} />
                  <div className="cart-item-details">
                    <h4>{item.Name}</h4>
                    <p>{item.Description}</p>
                    <div className="item-actions">
                      <input min="1"
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          handleQuantityChange(
                            item.ProductID,
                            parseInt(e.target.value),
                          )
                        }
                      />
                      <button
                        className="btn-delete-cartItem"
                        onClick={() => handleRemoveFromCart(item.ProductID)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    <p>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(item.Price * 1000 * item.quantity)}
                    </p>
                  </div>

                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Tổng Thanh Toán</h3>
              <p>Tổng giá sản phẩm: {calculateTotal()}</p>
              <input
                type="text"
                placeholder="Mã giảm giá"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              />
              <button onClick={handleAddDiscount} className="btn-magiamgia">
                Áp dụng mã giảm giá
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="checkout-button"
              >
                Thanh Toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
