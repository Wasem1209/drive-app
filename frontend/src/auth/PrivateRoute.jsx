import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute({ children, requiredRole }) {
    const { token, role } = useContext(AuthContext);

    // Not logged in
    if (!token) return <Navigate to="/login" />;

    // Logged in but wrong dashboard
    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}
