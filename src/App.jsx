import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Drivers from "./pages/Drivers";
import Settings from "./pages/Settings";
import SuperDeals from "./pages/SuperDeals";
import LoginForm from "./pages/login";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import { Toaster } from "react-hot-toast";
import useAdminSocket from "./hooks/useAdminSocket";

function App() {
  useAdminSocket();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdminLoggedIn = token && user && user.role === "admin";

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />

      <Routes>
        {/* 🔓 PUBLIC LOGIN ROUTE (but redirect if already logged in) */}
        <Route
          path="/"
          element={isAdminLoggedIn ? <Navigate to="/Dashboard" replace /> : <LoginForm />}
        />

        {/* 🔐 PROTECTED ADMIN ROUTES */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/superdeals" element={<SuperDeals />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
