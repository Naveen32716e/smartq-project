import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
function ManageQueue() {
  const { id } = useParams(); // providerId

  const [queue, setQueue] = useState([]);

  const fetchQueue = () => {
  console.log("Fetching queue for:", id);

  fetch(`http://localhost:5000/api/queue/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log("Queue data:", data);
      setQueue(data);
    });
};

useEffect(() => {
  if (!id) return;

  fetch(`http://localhost:5000/api/queue/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log("Queue data:", data); // 🔥 DEBUG
      setQueue(data);
    });

}, [id]);

  // 🔥 Update Status
  const updateStatus = async (qid, status) => {
    await fetch(`http://localhost:5000/api/queue/${qid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchQueue();
  };

  return (
    <div className="container py-4">

      <h3 className="mb-3">Manage Queue</h3>

      {queue.length === 0 ? (
        <p className="text-muted">No customers in queue</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {queue.map((q) => (
              <tr key={q._id}>
                <td>{q.customerName}</td>
                <td>{q.mobile}</td>
                <td>
                  <span className={`badge ${
                    q.status === "waiting"
                      ? "bg-warning"
                      : q.status === "serving"
                      ? "bg-primary"
                      : "bg-success"
                  }`}>
                    {q.status}
                  </span>
                </td>

                <td>
                  {q.status === "waiting" && (
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => updateStatus(q._id, "serving")}
                    >
                      ▶ Serve
                    </button>
                  )}

                  {q.status === "serving" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateStatus(q._id, "done")}
                    >
                      ✅ Done
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default ManageQueue;