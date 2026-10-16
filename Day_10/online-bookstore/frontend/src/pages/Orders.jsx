import { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";


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
    return <Loader message="Loading orders..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadOrders} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Page heading */}
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-700">
          My Orders
        </h1>

        {/* Empty orders message */}
        {orders.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <p className="mb-4 text-lg text-gray-600">
              No orders found.
            </p>

            <Link
              to="/books"
              className="inline-block rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Browse Books
            </Link>
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              {/* Order ID */}
              <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Order #{order.id}
                </h2>

                {/* Order status */}
                <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {order.status}
                </span>
              </div>

              {/* Order information */}
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">
                    Total:
                  </span>{" "}
                  ₹{order.total_amount}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Created:
                  </span>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              {/* View details link */}
              <div className="mt-5 border-t border-gray-200 pt-4">
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Orders;