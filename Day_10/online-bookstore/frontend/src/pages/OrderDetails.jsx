import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder, cancelOrder } from "../services/api";
import Button from "../components/Button";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
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
      setCancelling(true);
      setError("");

      const data = await cancelOrder(id);
      setOrder(data);
    } catch (error) {
      setError("Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  }



  if (loading) {
    return <Loader message="Loading order..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadOrder} />;
  }


   const statusStyle = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };


 return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Back link */}
        <Link
          to="/orders"
          className="mb-6 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Orders
        </Link>

        {/* Order information */}
        <div className="rounded-lg bg-white p-6 shadow-md">

          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order.id}
            </h1>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                statusStyle[order.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Total amount */}
          <div className="mb-6 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total Amount</p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              ₹{order.total_amount}
            </p>
          </div>

          {/* Cancel order */}
          {order.status === "PENDING" && (
            <div className="mb-6">
              <Button
                onClick={handleCancel}
                variant="danger"
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </Button>
            </div>
          )}

          {/* Error after an action */}
          {error && (
            <ErrorMessage
              message={error}
              onRetry={loadOrder}
            />
          )}

          {/* Order items */}
          <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
            Order Items
          </h2>

          {order.items.length === 0 ? (
            <p className="py-4 text-gray-500">
              No items found in this order.
            </p>
          ) : (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-md border border-gray-200 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                       {item.book_title || `Book #${item.book}`}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">
                      Price per item
                    </p>

                    <p className="font-semibold text-gray-800">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
