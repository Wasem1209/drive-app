import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute({ children, requiredRole }) {
    const { token, role } = useContext(AuthContext);

    // If not logged in → send to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If logged in but role doesn't match → block access
    if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Access allowed
    return children || <Outlet />;
}
