import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProviderDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const [providers, setProviders] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "Salon", // ✅ default
    phone: "",
    address: "",
  });

  // 🔥 FETCH ALL PROVIDERS
  const fetchProviders = () => {
    fetch("http://localhost:5000/api/providers/all")
      .then((res) => res.json())
      .then((data) => setProviders(data));
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // 🔥 ADD PROVIDER
  const addProvider = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Fill all fields");
      return;
    }

    await fetch("http://localhost:5000/api/providers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Request sent for admin approval ✅");

    setForm({
      name: "",
      category: "Salon",
      phone: "",
      address: "",
    });

    fetchProviders();
  };

  return (
    <div className="container p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between">
        <h4>Provider Dashboard</h4>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="row mt-4">

        {/* LEFT - FORM */}
        <div className="col-md-4">
          <div className="card p-3">

            <h5>Register Business</h5>

            <input
              className="form-control mb-2"
              placeholder="Business Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* 🔥 CATEGORY DROPDOWN */}
            <select
              className="form-control mb-2"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="salon">Salon</option>
              <option value="clinic">Clinic</option>
              <option value="restaurant">Restaurant</option>
            </select>

            <input
              className="form-control mb-2"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <button className="btn btn-dark w-100" onClick={addProvider}>
              Register
            </button>

          </div>
        </div>

        {/* RIGHT - PROVIDERS */}
        <div className="col-md-8">
          <div className="row">

            {providers.map((p) => (
              <div className="col-md-6 mb-3" key={p._id}>
                <div className="card p-3">

                  <h5>{p.name}</h5>
                  <p>📌 Category: {p.category}</p>
                  <p>📍 {p.address}</p>
                  <p>📞 {p.phone}</p>
                  <p>
                    Status:{" "}
                    <b className={
                      p.status === "approved"
                        ? "text-success"
                        : p.status === "pending"
                        ? "text-warning"
                        : "text-danger"
                    }>
                      {p.status}
                    </b>
                  </p>

                  {/* ONLY APPROVED CAN MANAGE */}
                  {p.status === "approved" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/manage/${p._id}`)}
                    >
                      Manage Queue →
                    </button>
                  )}

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProviderDashboard;