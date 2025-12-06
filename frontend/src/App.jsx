import "./styles/App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Drivers from "./pages/Drivers.jsx";
import Passenger from "./pages/Passenger.jsx";
import Safety from "./pages/Safety.jsx";
import Security from "./pages/Security.jsx";

import PrivateRoute from "./auth/PrivateRoute";

// Dashboards
import AdminDashboard from "./dashboards/Admin/AdminDashboard.jsx";
import DriverDashboard from "./dashboards/Driver/DriverDashboard.jsx";
import OfficersDashboard from "./dashboards/Officers/OfficersDashboard.jsx";
import PassangerDashboard from "./dashboards/Passenger/PassengerDashboard.jsx";
import DriverProfile from "./dashboards/Driver/features/Profile.jsx";

// Features
import ConnectWallet from "./dashboards/Driver/features/Wallet.jsx";
import PayRoadTax from "./dashboards/Driver/features/PayRoadTax.jsx";
import ScanPlateNo from "./dashboards/Driver/features/ScanPlateNo.jsx";





function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/passenger" element={<Passenger />} />
      <Route path="/safety" element={<Safety />} />
      <Route path="/security" element={<Security />} />
      <Route path="/drivers" element={<Drivers />} />

      {/* Protected Dashboards */}
      <Route
        path="/dashboard/driver"
        element={
          <PrivateRoute requiredRole="driver">
            <DriverDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/driver/profile"
        element={
          <PrivateRoute requiredRole="driver">
            <DriverProfile />
          </PrivateRoute>
        }
      />


      <Route
        path="/dashboard/driver/connectwallet"
        element={
          <PrivateRoute requiredRole="driver">
            <ConnectWallet />
          </PrivateRoute>
        }
      />


      <Route
        path="/dashboard/driver/profile"
        element={
          <PrivateRoute requiredRole="driver">
            <DriverProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/passenger"
        element={
          <PrivateRoute requiredRole="passenger">
            <PassangerDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/officer"
        element={
          <PrivateRoute requiredRole="officer">
            <OfficersDashboard />
          </PrivateRoute>
        }
      />

      {/* Features */}
        <Route
          path="/dashboard/driver/pay-road-tax"
          element={
            <PrivateRoute requiredRole="driver">
              <PayRoadTax />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/driver/scan-plate"
          element={
            <PrivateRoute requiredRole="driver">
              <ScanPlateNo />
            </PrivateRoute>
          }
        />

      {/* Catch-all route */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;