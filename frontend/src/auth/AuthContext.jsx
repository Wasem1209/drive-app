import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);     // user info
    const [role, setRole] = useState(null);     // driver, admin etc
    const [token, setToken] = useState(null);   // jwt token

    useEffect(() => {
        // restore login if stored in browser
        const savedToken = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");

        if (savedToken && savedRole) {
            setToken(savedToken);
            setRole(savedRole);
            setUser({ role: savedRole });
        }
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

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
