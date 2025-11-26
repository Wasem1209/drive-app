import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute({ children, requiredRole }) {
    const { token, role } = useContext(AuthContext);

    // If not logged in → redirect to login
    if (!token) return <Navigate to="/login" />;

    // If role is provided but does not match (case-insensitive)
    if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
        return <Navigate to="/unauthorized" />;
    }

    // Everything correct → allow access
    return children;
}
