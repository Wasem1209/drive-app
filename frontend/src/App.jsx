import './styles/App.css'
import { AuthProvider, ROLES } from './auth/AuthContext.jsx'
import { HashRouter, Route } from './router/HashRouter.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Drivers from './pages/Drivers.jsx'
import Passengers from './pages/Passengers.jsx'
import Police from './pages/Police.jsx'
import Admin from './pages/Admin.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import NotFound from './pages/NotFound.jsx'


function App() {
  return (
    <>
      <AuthProvider>
        <HashRouter notFound={<NotFound />}>
          <Route path="/" element={<Home />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/passengers" element={<Passengers />} />

          <Route
            path="/police"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.police, ROLES.admin]}
                element={<Police />}
              />
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.admin]}
                element={<Admin />}
              />
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </HashRouter>
      </AuthProvider>


    </>
  )
}

export default App
