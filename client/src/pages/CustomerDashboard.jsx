import { useEffect, useState } from "react";
import "./customer.css";

function CustomerDashboard() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [status, setStatus] = useState(null);

  // 🔥 FETCH APPROVED PROVIDERS
  useEffect(() => {
    fetch("http://localhost:5000/api/providers/approved")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        if (data.length > 0) setSelectedProvider(data[0]);
      });
  }, []);

  // 🔥 JOIN QUEUE
  const joinQueue = async () => {
    if (!name || !mobile) {
      alert("Enter details");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: selectedProvider._id,
          customerName: name,
          mobile: mobile,
        }),
      });

      alert("Joined queue successfully 🎉");

      fetchStatus(); // 🔥 immediately get status

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FETCH CUSTOMER STATUS
  const fetchStatus = () => {
    if (!selectedProvider || !mobile) return;

    fetch(
      `http://localhost:5000/api/queue/status/${selectedProvider._id}/${mobile}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Status:", data);
        setStatus(data);
      });
  };

  // 🔥 AUTO UPDATE EVERY 3 SEC
  useEffect(() => {
    if (!mobile || !selectedProvider) return;

    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [mobile, selectedProvider]);

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold text-primary">Smart Q System</h2>
          <p className="text-muted mb-0">
            Join queue and track your waiting time
          </p>
        </div>

        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="row">

        {/* LEFT SIDE - PROVIDERS */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6 className="text-muted">Select Provider</h6>

            {providers.map((p) => (
              <div
                key={p._id}
                className={`provider-card ${
                  selectedProvider?._id === p._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedProvider(p);
                  setStatus(null); // reset status when changing provider
                }}
              >
                <strong>{p.name}</strong>
                <p className="text-muted small mb-0">{p.address}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-8">
          <div className="card p-4 shadow-sm">

            {selectedProvider && (
              <>
                {/* PROVIDER INFO */}
                <h4>{selectedProvider.name}</h4>
                <p className="text-muted">{selectedProvider.address}</p>

                <hr />

                {/* FORM */}
                <h6>Join Queue</h6>

                <input
                  className="form-control mb-2"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />

                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={joinQueue}
                >
                  Join {selectedProvider.name} Queue
                </button>

                {/* 🔥 STATUS CARD */}
                {status && !status.message && (
                  <div className="card mt-4 p-3 bg-light">
                    <h6 className="fw-bold">Queue Status</h6>
                    <p>📍 Position: {status.position}</p>
                    <p>👥 Customers Ahead: {status.ahead}</p>
                    <p>⏳ Estimated Wait: {status.waitTime} mins</p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default CustomerDashboard;