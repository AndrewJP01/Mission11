import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info text-center">Your cart is empty.</div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ul className="list-group">
              {cart.map((item: CartItem) => (
                <li
                  key={item.bookId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.title}</strong> <br />
                    <span className="text-muted">
                      Qty: {item.quantity} | ${item.price.toFixed(2)} each
                    </span>
                  </div>
                  <div>
                    <span className="fw-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="btn btn-danger btn-sm ms-3"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Total Section */}
      <div className="text-center mt-4">
        <h3 className="fw-bold">Total: ${totalAmount.toFixed(2)}</h3>
      </div>

      {/* Buttons */}
      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg me-3">✅ Checkout</button>
        <button
          className="btn btn-outline-primary btn-lg"
          onClick={() => navigate('/')}
        >
          🔍 Continue Browsing
        </button>
      </div>
    </div>
  );
}

export default CartPage;
