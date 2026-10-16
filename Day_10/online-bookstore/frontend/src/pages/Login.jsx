import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";

function Login({setIsLoggedIn}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();


   function validateForm() {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!password.trim()) {
      newErrors.password = "Password cannot contain only spaces.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(username, password);

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      setIsLoggedIn(true);
      toast.success("Login successful!");
      navigate("/books");

      console.log("Login successful");

    } catch (error) {
      toast.error("Invalid username or password.");
      console.error("Login failed",error);

    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">

      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Login
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">

        <Input
          label="Username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(event) =>{
            setUsername(event.target.value);
            setErrors((prev) => ({
              ...prev,
              username: "",
            }));
          }}
          error={errors.username}
          
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) =>{
            setPassword(event.target.value);
            setErrors((prev) =>({
              ...prev,
              password: "",
            }));
          }}
          error={errors.password}
          
        />


        <p className="flex item-center justify-center">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        </p>



        <ErrorMessage message={error} />

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline cursor-pointer"
          >
            Register
          </Link>
        </p>

      </form>
    </div>
  </div>
);
}

export default Login;