import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";



function Books() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search,setSearch] = useState("");
  // const [category, setCategory] = useState("");
  const [min_price, setMinPrice] = useState("");
  const [max_price, setMaxPrice] = useState("");

    async function loadBooks() {
      try {
        setLoading(true);
        setError("");

        const data = await getBooks({
            search,
            // category,
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
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-center text-3xl font-bold text-blue-700">
          Online BookStore
        </h1>

        {/* Search and Filter */}

        <div className="mb-8 rounded-lg bg-white p-5 shadow-md">

          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Search and Filter Books
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            
            {/* <input
              type="number"
              placeholder="Category ID"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            /> */}

            <input
              type="number"
              placeholder="Minimum price"
              value={min_price}
              onChange={(event) => setMinPrice(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />

            <input
              type="number"
              placeholder="Maximum price"
              value={max_price}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />

          </div>

          <button
            type="button"
            onClick={loadBooks}
            className="mt-4 w-full rounded-md bg-blue-600 px-8 py-2 font-medium text-white hover:bg-blue-700 sm:w-auto"
          >
              Search  
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <Loader message="Loading books..." />
        )}

        {/* Error */}

        <ErrorMessage message={error} onRetry={loadBooks} />

        {/* Book List */}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-lg bg-white p-7 shadow-md"
              >
                <h2 className="mb-2 text-xl font-bold text-gray-800">
                  {book.title}
                </h2>

                <p className="mb-2 text-gray-600">
                  Author: {book.author}
                </p>

                <p className="mb-4 text-lg font-semibold text-blue-700">
                  ₹{book.price}
                </p>

                <Link
                  to={`/books/${book.id}`}
                  className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  View Details
                </Link>

              </div>
            ))}

            {books.length === 0 && (
              <p className="text-gray-600">
                No books found.
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Books;