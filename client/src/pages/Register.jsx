import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/api/auth/register", form);
    alert("Registered successfully!");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Register</h3>

        <input className="form-control mb-2" placeholder="Name"
          onChange={(e)=>setForm({...form,name:e.target.value})}/>

        <input className="form-control mb-2" placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}/>

        <input type="password" className="form-control mb-2" placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})}/>

        <select className="form-control mb-3"
          onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value="customer">Customer</option>
          <option value="provider">Service Provider</option>
        </select>

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;