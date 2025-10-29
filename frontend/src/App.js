import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '' });


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };


  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

 const fetchProducts = async () => {
  try {
    console.log('Fetching products from:', `${API_BASE_URL}/products`);
    const response = await axios.get(`${API_BASE_URL}/products`);
    console.log('Products received:', response.data);
    setProducts(response.data);
    

    response.data.forEach(product => {
      console.log('Product:', product.name, 'Image URL:', product.image);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_BASE_URL}/cart`, { productId, quantity: 1 });
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/${cartItemId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/checkout`, checkoutForm);
      setReceipt(response.data);
      setShowCheckout(false);
      setShowCart(false);
      setCheckoutForm({ name: '', email: '' });
      fetchCart();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="App">

      <header className="app-header">
        <div className="container">
          <div className="logo">
            <div className="logo-icon">🛍️</div>
            <h1>BharatCart</h1>
          </div>
          <button 
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            <span className="cart-icon">🛒</span>
            Cart ({getCartItemCount()})
          </button>
        </div>
      </header>

     
      <main className="container">
        {!showCart ? (
          // Products Grid
          <section className="products-section">
            <div className="section-header">
              <h2>Featured Products</h2>
              <p>Best deals on electronics and gadgets</p>
            </div>
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-overlay">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product._id)}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">{formatPrice(product.price)}</span>
                      <span className="product-rating">⭐ 4.2</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // Cart View
          <section className="cart-section">
            <div className="cart-header">
              <button 
                className="back-button"
                onClick={() => setShowCart(false)}
              >
                ← Continue Shopping
              </button>
              <div className="cart-title">
                <h2>Your Shopping Cart</h2>
                <p>{cart.items.length} items in cart</p>
              </div>
            </div>

            {cart.items.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
                <button 
                  className="shop-now-btn"
                  onClick={() => setShowCart(false)}
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.items.map(item => (
                    <div key={item._id} className="cart-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="item-details">
                        <h4>{item.product.name}</h4>
                        <p className="item-price">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="item-quantity">
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="item-total">
                        {formatPrice(item.total)}
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary">
                  <div className="summary-card">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                    <button 
                      className="checkout-btn"
                      onClick={() => setShowCheckout(true)}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="modal checkout-modal">
            <div className="modal-header">
              <h2>Checkout</h2>
              <button 
                className="close-modal"
                onClick={() => setShowCheckout(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                />
              </div>
              <div className="checkout-summary">
                <h4>Order Summary</h4>
                {cart.items.map(item => (
                  <div key={item._id} className="checkout-item">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>{formatPrice(item.total)}</span>
                  </div>
                ))}
                <div className="checkout-total">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>
              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && (
        <div className="modal-overlay">
          <div className="modal receipt-modal">
            <div className="receipt-header">
              <div className="success-icon">✅</div>
              <h2>Order Confirmed!</h2>
              <p>Thank you for your purchase</p>
            </div>
            <div className="receipt-details">
              <div className="receipt-row">
                <span>Order ID:</span>
                <span>{receipt.orderId}</span>
              </div>
              <div className="receipt-row">
                <span>Customer:</span>
                <span>{receipt.customer.name}</span>
              </div>
              <div className="receipt-row">
                <span>Email:</span>
                <span>{receipt.customer.email}</span>
              </div>
              <div className="receipt-row">
                <span>Order Date:</span>
                <span>{new Date(receipt.timestamp).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="receipt-items">
                <h4>Order Items:</h4>
                {receipt.items.map((item, index) => (
                  <div key={index} className="receipt-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
              
              <div className="receipt-total">
                <span>Total Amount:</span>
                <span>{formatPrice(receipt.total)}</span>
              </div>
            </div>
            <button 
              className="continue-shopping-btn"
              onClick={() => setReceipt(null)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;