import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import { Link } from "react-router-dom";



function Books() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search,setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [min_price, setMinPrice] = useState("");
  const [max_price, setMaxPrice] = useState("");

    async function loadBooks() {
      try {
        setLoading(true);
        setError("");

        const data = await getBooks({
            search,
            category,
            min_price,
            max_price
        });
        setBooks(data);

      } catch (error) {
        setError("Failed to load books.");

      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    loadBooks();
  }, []);


  return (
    <div>

      <h1>Books</h1>

      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <input
        type="number"
        placeholder="Category ID"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      />

      <input
        type="number"
        placeholder="Minimum price"
        value={min_price}
        onChange={(event) => setMinPrice(event.target.value)}
      />

      <input
        type="number"
        placeholder="Maximum price"
        value={max_price}
        onChange={(event) => setMaxPrice(event.target.value)}
      />

      <button onClick={loadBooks}>
        Search / Filter
      </button>

      {loading && (
        <p>Loading books...</p>
      )}


      {error && (
        <div>

          <p>{error}</p>

          <button onClick={loadBooks}>
            Retry
          </button>

        </div>
      )}


      {!loading && !error &&
        books.map((book) => (
          <div key={book.id}>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <p>₹{book.price}</p>

            <Link to={`/books/${book.id}`}>
              View Details
            </Link>
          </div>
          ))
      }

    </div>
  );
}


export default Books;