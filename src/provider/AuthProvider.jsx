

// // src/provider/AuthProvider.jsx
// import { createContext, useState, useEffect, useContext } from "react";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const getLocalUser = () => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     const employeeId = localStorage.getItem("employeeId");

//     console.log("🔎 Checking localStorage:", { token, role, employeeId });

//     if (token && role) {
//       return {
//         token,
//         role: role.toLowerCase(),
//         employeeId,
//       };
//     }

//     return null;
//   };

//   useEffect(() => {
//     console.log("🚀 AuthProvider starting");

//     const localUser = getLocalUser();

//     if (localUser) {
//       console.log("⚡ Restoring user instantly from localStorage:", localUser);
//       setUser(localUser);
//     } else {
//       console.log("❌ No local user found");
//     }

//     verifyToken();
//   }, []);

//   const verifyToken = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.log("❌ No token found");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("🔐 Verifying token with backend...");

//       fetch(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
//         method: "GET",
//         headers: { Authorization: token },
//       });

//       if (!res.ok) throw new Error("Token invalid");

//       const data = await res.json();

//       const verifiedUser = {
//         ...data,
//         role: data.role?.toLowerCase(),
//       };

//       console.log("✅ Backend verified user:", verifiedUser);

//       setUser(verifiedUser);

//       localStorage.setItem("role", verifiedUser.role);
//       localStorage.setItem("employeeId", verifiedUser.employeeId || "");

//     } catch (err) {
//       console.log("🚨 Token verification failed:", err);

//       setUser(null);

//       localStorage.removeItem("token");
//       localStorage.removeItem("role");
//       localStorage.removeItem("employeeId");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginUser = ({ token, role, employeeId }) => {
//     const normalizedRole = role.toLowerCase();

//     console.log("🟢 loginUser called:", { token, role, employeeId });

//     const userData = {
//       token,
//       role: normalizedRole,
//       employeeId,
//     };

//     setUser(userData);

//     localStorage.setItem("token", token);
//     localStorage.setItem("role", normalizedRole);
//     localStorage.setItem("employeeId", employeeId || "");
//   };

//   const logoutUser = () => {
//     console.log("🚪 Logout user");

//     setUser(null);

//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("employeeId");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         loginUser,
//         logoutUser,
//         loading,
//         verifyToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }


// src/provider/AuthProvider.jsx
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const DEBUG = import.meta.env.DEV; // true only in development

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Restore user on page refresh
  // ===============================
  useEffect(() => {
    if (DEBUG) console.log("🚀 AuthProvider Loaded");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const employeeId = localStorage.getItem("employeeId");

    if (DEBUG) {
      console.log("🔎 LocalStorage:", {
        token,
        role,
        employeeId,
      });
    }

    if (token && role) {
      setUser({
        token,
        role: role.toLowerCase(),
        employeeId,
      });
    }

    setLoading(false);
  }, []);

  // ===============================
  // Login
  // ===============================
  const loginUser = ({ token, role, employeeId }) => {
    const normalizedRole = role?.toLowerCase();

    const userData = {
      token,
      role: normalizedRole,
      employeeId,
    };

    setUser(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("role", normalizedRole);
    localStorage.setItem("employeeId", employeeId || "");

    if (DEBUG) console.log("🟢 Login Success:", userData);
  };

  // ===============================
  // Logout
  // ===============================
  const logoutUser = () => {
    if (DEBUG) console.log("🚪 Logout");

    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}