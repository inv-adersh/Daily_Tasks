import { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import { Link } from "react-router-dom";


function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);

    } catch (error) {
      setError("Failed to load orders.");

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);


  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={loadOrders}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>My Orders</h1>

      {orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {orders.map((order) => (
        <div key={order.id}>
          <h2>Order #{order.id}</h2>

          <p>
            Total: ₹{order.total_amount}
          </p>

          <p>
            Status: {order.status}
          </p>

          <p>
            Created: {order.created_at}
            </p>
            <Link to={`/orders/${order.id}`}>
            View Detail
            </Link>
          
        </div>
      ))}
    </div>
  );
}

export default Orders;