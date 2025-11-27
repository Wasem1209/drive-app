import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // prevent redirect flicker

    useEffect(() => {
        // Restore saved login
        const savedToken = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");

        if (savedToken && savedRole) {
            setToken(savedToken);
            setRole(savedRole);
            setUser({ role: savedRole });
        }

        setLoading(false);
    }, []);

    const login = (token, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        setToken(token);
        setRole(role);
        setUser({ role });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setUser(null);
        setRole(null);
        setToken(null);
    };

    if (loading) return null; // prevents broken redirects on page refresh

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
