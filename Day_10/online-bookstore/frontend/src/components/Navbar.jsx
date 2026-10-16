import { Link, useNavigate,useLocation} from "react-router-dom";
import Button from "./Button";

function Navbar({ isLoggedIn, setIsLoggedIn }) {

  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/login");
  }

  const linkStyles = (path) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-700"
    }`;

 return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          to="/books"
          className="text-xl font-bold tracking-tight text-blue-700 sm:text-2xl"
        >
          Book<span className="text-gray-800">Store</span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-1 sm:gap-3">

          <Link to="/books" className={linkStyles("/books")}>
            Books
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/cart" className={linkStyles("/cart")}>
                Cart
              </Link>

              <Link to="/orders" className={linkStyles("/orders")}>
                Orders
              </Link>

              <Button
                type="button"
                variant="danger"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className={linkStyles("/login")}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;