import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from "./pages/Login.jsx";
import Drivers from './pages/Drivers.jsx';
import Passenger from './pages/Passenger.jsx';
import Safety from './pages/Safety';
import Security from './pages/Security.jsx';
import DriverDashboard from './dashboards/Driver/DriverDasboard.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/passenger" element={<Passenger />} />
      <Route path="/safety" element={<Safety />} />
      <Route path="/security" element={<Security />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}

export default App;
