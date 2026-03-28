const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/providers", require("./routes/providerRoutes"));
app.use("/api/queue", require("./routes/queueRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// 🔥 CREATE SERVER
const server = http.createServer(app);

// 🔥 SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

// 🔥 START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await connectDB(); // ✅ WAIT FOR DB

    const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  } catch (err) {
    console.error("DB connection failed ❌", err);
    process.exit(1);
  }
};

startServer();