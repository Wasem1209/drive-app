import './styles/App.css'
import { AuthProvider, ROLES, useAuth } from './auth/AuthContext.jsx'
import { HashRouter, Route, Link } from './router/HashRouter.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Drivers from './pages/Drivers.jsx'
import Passengers from './pages/Passengers.jsx'
import Police from './pages/Police.jsx'
import Admin from './pages/Admin.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import NotFound from './pages/NotFound.jsx'
import Register from './auth/Register.jsx'
import Verify from './auth/Verify.jsx'
import Login from './auth/Login.jsx'

function TopBar() {
  const { role, loginAs, logout, isAuthenticated } = useAuth()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: '1px solid #eee', marginBottom: 16
    }}>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/drivers">Drivers</Link>
        <Link to="/passengers">Passengers</Link>
        <Link to="/police">Police</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/verify">Verify</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Role: {role}</span>
        <button className="btn" onClick={() => loginAs(ROLES.driver)}>Driver</button>
        <button className="btn" onClick={() => loginAs(ROLES.passenger)}>Passenger</button>
        <button className="btn" onClick={() => loginAs(ROLES.police)}>Police</button>
        <button className="btn" onClick={() => loginAs(ROLES.admin)}>Admin</button>
        {isAuthenticated && <button className="btn btn--danger" onClick={logout}>Logout</button>}
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <TopBar />
      <HashRouter notFound={<NotFound />}>        
        <Route path="/" element={<Home />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/passengers" element={<Passengers />} />
        <Route
          path="/police"
          element={<ProtectedRoute allowedRoles={[ROLES.police, ROLES.admin]} element={<Police />} />}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={[ROLES.admin]} element={<Admin />} />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
      </HashRouter>
    </AuthProvider>
  )
}

export default App
