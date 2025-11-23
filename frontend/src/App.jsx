import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './auth/Register.jsx';
import Login from "./auth/Login";
import Driver from './pages/Driver.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/driver" element={<Driver />} />
    </Routes>
  );
}

export default App;
