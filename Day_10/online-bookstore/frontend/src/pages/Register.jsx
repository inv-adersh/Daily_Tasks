import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});



  function validateform(){

    const newError ={};

    const trimmedUsername = username.trim();

    if (!trimmedUsername){
      newError.username = "Username is required"
    }else if (trimmedUsername.length <3){
      newError.username = "Username must be atleast 3 characters long"
    }else if (trimmedUsername.length > 20){
      newError.username = "Username must be at most 20 characters long"
    }else if (username!== trimmedUsername){
      newError.username = "Username cannot contain spaces"
    }

    const trimmedEmail = email.trim();
    
    if (!trimmedEmail){
      newError.email = "Email is required"
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)){
      newError.email = "Email is not valid"
    }

    if (!password){
      newError.password = "Password is required"
    }else if (password.length <8){
      newError.password = "Password must be atleast 8 characters long"
    }else if (!/[0-9]/.test(password)) {
      newError.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newError.password = "Password must contain at least one special character.";
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
  }



  async function handleRegister(event) {
    event.preventDefault();

    setError("");   
    if (!validateform()) {
      return;
    }
    
    try {
      setLoading(true);
      
      await registerUser(username,email,password);
      toast.success("Registration successful!");
      navigate("/login");

    } catch (error) {
      toast.error("Registration failed.");

    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Create Account
      </h1>

      <form onSubmit={handleRegister} className="space-y-4">

        <Input
          label="Username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            setErrors((prev) => ({
              ...prev,
              username: "",
            }));
          }}
          error={errors.username}
    
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => {
              setEmail(event.target.value);
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }}
          error={errors.email}

        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({
              ...prev,
              password: "",
            }));
          }}
          error={errors.password}
        />

        
        <p className="flex item-center justify-center">
            
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        
        </p>
        
        <p className="text-center text-sm text-gray-600">
        <ErrorMessage message={error} />
        </p>  
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  </div>
);
}

export default Register;