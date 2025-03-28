import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext'; // Fixed typo in CartContext import
import { CartItem } from '../types/CartItem';

function PurchasePage() {
  const navigate = useNavigate();
  const { title, bookId } = useParams();
  const location = useLocation();
  const price = location.state?.price; // Get price from state
  const { addToCart } = useCart();

  // State to hold the quantity and modal visibility
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'No Title Found',
      price,
      quantity,
    };
    addToCart(newItem);

    // Show the modal
    setShowModal(true);
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value)); // Ensure quantity is at least 1
    setQuantity(value);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Go to cart after confirmation
  const goToCart = () => {
    setShowModal(false);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBand />
      <div className="container text-center mt-4">
        <h2 className="mb-4">Purchase {title}</h2>

        {price !== undefined ? (
          <div>
            <p>
              <strong>Price:</strong> ${price.toFixed(2)}
            </p>
          </div>
        ) : (
          <p>Price not available.</p>
        )}

        {/* Quantity input */}
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
          />
        </div>

        {/* Total price */}
        <div className="mb-3">
          <p>
            <strong>Total:</strong> ${(price * quantity).toFixed(2)}
          </p>
        </div>

        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/')}
        >
          Return to Shopping
        </button>

        {/* Modal for confirmation */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: 'block' }}
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Item Added to Cart
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {title} has been added to your cart. Would you like to go to
                  the cart or continue shopping?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goToCart}
                  >
                    Go to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PurchasePage;
