import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageQueue from "./pages/ManageQueue";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/customer"
  element={
    <ProtectedRoute roleRequired="customer">
      <CustomerDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute roleRequired="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider"
  element={
    <ProtectedRoute roleRequired="provider">
      <ProviderDashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />

        <Route path="/manage/:id" element={<ManageQueue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;