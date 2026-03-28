import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "customer") navigate("/customer");
    else if (role === "admin") navigate("/admin");
    else if (role === "provider") navigate("/provider");
  }, [navigate]);

  // ✅ Handle Login
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      // ✅ Save token + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // ✅ Redirect based on role
      if (res.data.role === "customer") navigate("/customer");
      else if (res.data.role === "admin") navigate("/admin");
      else navigate("/provider");

    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      
      <div className="card p-4 shadow" style={{ width: "360px", borderRadius: "12px" }}>
        
        <h3 className="text-center mb-3 fw-bold text-primary">
          SmartQ Login
        </h3>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-3 mb-0">
          New user?{" "}
          <Link to="/register" className="text-decoration-none">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;