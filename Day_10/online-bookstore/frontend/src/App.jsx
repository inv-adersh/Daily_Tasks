import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import OrderDetails from "./pages/OrderDetails";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  return (
    <BrowserRouter>


      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>

        <Route path="/" element={<Navigate to="/books" replace />} />  

        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/register" element={<Register />} />

        <Route path="/books" element={<Books />} />

        <Route path="/books/:id" element={<BookDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/orders/:id" element={<OrderDetails />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;