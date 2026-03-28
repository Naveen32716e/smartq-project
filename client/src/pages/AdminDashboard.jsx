import { useEffect, useState } from "react";

function AdminDashboard() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState({
    waiting: 0,
    serving: 0,
    done: 0,
  });

  const fetchProviders = () => {
    fetch("http://localhost:5000/api/providers/all")
      .then(res => res.json())
      .then(data => setProviders(data));
  };

  const fetchStats = () => {
    fetch("http://localhost:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  };

  useEffect(() => {
    fetchProviders();
    fetchStats();

    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/providers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchProviders();
  };

  return (
    <div className="container p-4">

      <div className="d-flex justify-content-between">
        <h4>Admin Dashboard</h4>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>

      {/* STATS */}
      <div className="row mt-4">
        <div className="col-md-4">Waiting: {stats.waiting}</div>
        <div className="col-md-4">Serving: {stats.serving}</div>
        <div className="col-md-4">Done: {stats.done}</div>
      </div>

      {/* PROVIDERS */}
      <h5 className="mt-4">Provider Requests</h5>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {providers.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.status}</td>
              <td>
                {p.status === "pending" && (
                  <>
                    <button className="btn btn-success btn-sm me-2"
                      onClick={()=>updateStatus(p._id,"approved")}>
                      Approve
                    </button>

                    <button className="btn btn-danger btn-sm"
                      onClick={()=>updateStatus(p._id,"rejected")}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;