import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart, getBook } from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function BookDetails() {

  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  async function loadBook() {

    try {
      setLoading(true);
      setError("");

      const data = await getBook(id);
      setBook(data);

    } catch (error) {
      setError("Failed to load book.");

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBook();
  }, [id]);

  async function handleAddToCart() {
    if (quantity < 1) {
      setMessage("Quantity must be at least 1.");
      return;
    }

    if (quantity > book.stock) {
      setMessage("Quantity cannot exceed available stock.");
      return;
    }


    try {
      setMessage("");

      await addToCart(id, quantity);
      setMessage("Book added to cart.");
    } catch (error) {
      setMessage("Failed to add book to cart.");
    }
  }

  if (loading) {
    return <Loader message="Loading book..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadBook} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md sm:p-8">

        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          {book.title}
        </h1>

        <div className="space-y-4 text-gray-600">

          <p>
            <span className="font-semibold text-gray-800">Author:</span>{" "}
            {book.author}
          </p>

          <p>
            <span className="font-semibold text-gray-800">
              Description:
            </span>{" "}
            {book.description}
          </p>

          <p className="text-xl font-bold text-blue-700">
            Price: ₹{book.price}
          </p>

          <p>
            <span className="font-semibold text-gray-800">Stock:</span>{" "}
            {book.stock}
          </p>

          <p>
            <span className="font-semibold text-gray-800">ISBN:</span>{" "}
            {book.isbn}
          </p>

        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">

          <label
            htmlFor="quantity"
            className="mb-2 block font-medium text-gray-700"
          >
            Quantity
          </label>

          <input
            id="quantity"
            type="number"
            min="1"
            max={book.stock}
            value={quantity}
            onChange={(event) => {
              const val = event.target.value;
              setQuantity(val === "" ? "" : Number(val));
            }}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Add to Cart
          </button>

          {message && (
            <p className="mt-4 rounded-md bg-gray-100 p-3 text-sm text-gray-700">
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default BookDetails;