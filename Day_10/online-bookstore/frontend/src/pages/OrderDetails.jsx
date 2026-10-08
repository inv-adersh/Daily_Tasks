import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder, cancelOrder } from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {

    try {
      setLoading(true);
      setError("");

      const data = await getOrder(id);
      setOrder(data);

    } catch (error) {
      setError("Failed to load order.");

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function handleCancel() {
    
  try {
    setError("");

    const data = await cancelOrder(id);
    setOrder(data);

  } catch (error) {
    setError("Failed to cancel order.");
  }
}



  if (loading) {
    return <p>Loading order...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={loadOrder}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Order #{order.id}</h1>

      <p>
        Total: ₹{order.total_amount}
      </p>

      <p>
        Status: {order.status}
      </p>
      {order.status === "PENDING" && (
      <button onClick={handleCancel}>
        Cancel Order
      </button>
    )}

      <h2>Items</h2>

      {order.items.map((item) => (
        <div key={item.id}>
          <p>Book ID: {item.book}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ₹{item.price}</p>
          
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;