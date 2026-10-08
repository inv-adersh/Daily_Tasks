import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart,updateCartItem, removeCartItem, createOrder } from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadCart() {

    try {
      setLoading(true);
      setError("");

      const data = await getCart();
      setCart(data);

    } catch (error) {
      setError("Failed to load cart.");

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleUpdate(itemId, quantity) {

  try {
    await updateCartItem(itemId, quantity);
    await loadCart();

  } catch (error) {
    setError("Failed to update quantity.");
  }
}

  async function handleRemove(itemId) {

  try {
    await removeCartItem(itemId);
    await loadCart();

  } catch (error) {
    setError("Failed to remove item.");
  }
}

async function handlePlaceOrder() {

  try {
    setError("");
    await createOrder();
    navigate("/orders");

  } catch (error) {
    setError("Failed to place order.");
  }
}



  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={loadCart}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>My Cart</h1>

      {cart?.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      {cart?.map((item) => (
        <div key={item.id}>
          <p>Book ID: {item.book}</p>
          <p>Quantity: {item.quantity}</p>

        <button onClick={() => handleUpdate(item.id, item.quantity + 1)}>
            +
        </button>

        <button onClick={() => handleUpdate(item.id, item.quantity - 1)}>
            -
        </button>

        <button onClick={() => handleRemove(item.id)}>
            Remove
        </button>

        {cart?.length > 0 && (
        <button onClick={handlePlaceOrder}>
            Place Order
        </button>
        )}  

        </div>
      ))}
    </div>
  );
}

export default Cart;