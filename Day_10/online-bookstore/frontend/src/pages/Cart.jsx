import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, createOrder } from "../services/api";
import Button from "../components/Button";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
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
      setError("");
      setUpdating(true);
      await updateCartItem(itemId, quantity);
      await loadCart();

    } catch (error) {
      setError("Failed to update quantity.");
    }
    finally {
      setUpdating(false);
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

  const totalPrice = (cart ?? []).reduce((total, item) => {
  return total + Number(item.book_price) * item.quantity;
  }, 0);

  console.log("total price", totalPrice);
  
  if (loading) {
    return <Loader message="Loading cart..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadCart} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Page heading */}
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-700">
          My Cart
        </h1>

        {/* Empty cart message */}
        {cart?.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <p className="mb-4 text-lg text-gray-600">
              Your cart is empty.
            </p>

            <button
              onClick={() => navigate("/books")}
              className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Browse Books
            </button>
          </div>
        )}

        {/* Cart items */}
        <div className="space-y-4">
          {cart?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 rounded-lg bg-white p-5 shadow-md sm:flex-row sm:items-center"
            >
              {/* Book information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Book ID: {item.book}
                </h2>

                <p className="mt-1 text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>

              {/* Quantity controls and remove button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() =>
                    handleUpdate(item.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1 || updating}
                  className="h-9 w-9 rounded-md border border-gray-300 bg-gray-100 text-lg font-bold hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  -
                </button>

                <span className="min-w-6 text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleUpdate(item.id, item.quantity + 1)
                  }
                  disabled={updating}
                  className="h-9 w-9 rounded-md border border-gray-300 bg-gray-100 text-lg font-bold hover:bg-gray-200"
                >
                  +
                </button>

                <Button
                  onClick={() => handleRemove(item.id)}
                  variant="danger"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Place order button */}
        {cart && cart.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handlePlaceOrder}
              className="rounded-md bg-green-600 px-6 py-3 font-semibold text-white shadow hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;