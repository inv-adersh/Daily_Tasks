import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {

  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/books");
  }

  return (
    <nav>

      <Link to="/books">Books</Link>

      {isLoggedIn && (
        <>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
          <button onClick={logout}> Logout </button>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

    </nav>
  );
}

export default Navbar;