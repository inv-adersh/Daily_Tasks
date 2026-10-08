import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart, getBook } from "../services/api";

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
  try {
    setMessage("");

    await addToCart(id, quantity);
    setMessage("Book added to cart.");

  } catch (error) {
    setMessage("Failed to add book to cart.");
  }
}

  if (loading) {
    return <p>Loading book...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={loadBook}>
          Retry
        </button>
      </div>
    );
  }

  return (

    
    <div>
      <h1>{book.title}</h1>

      <p>Author: {book.author}</p>

      <p>Description: {book.description}</p>

      <p>Price: ₹{book.price}</p>

      <p>Stock: {book.stock}</p>

      <p>ISBN: {book.isbn}</p>

      <p>Quantity:</p>

        <input
        type="number"
        min="1"
        value={quantity}
        onChange={(event) =>
        setQuantity(Number(event.target.value))
        }
        />

        <button onClick={handleAddToCart}>
            Add to Cart
        </button>

        {message && <p>{message}</p>}
    </div>
  );
}

export default BookDetails;