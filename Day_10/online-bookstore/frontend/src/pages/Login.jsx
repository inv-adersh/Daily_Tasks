import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login({setIsLoggedIn}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      
      const data = await loginUser(username, password);

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      setIsLoggedIn(true);
      navigate("/books");

      console.log("Login successful");

    } catch (error) {
      setError("Invalid username or password.");
      console.error("Login failed",error);


    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p>{error}</p>}

      </form>
    </div>
  );
}

export default Login;