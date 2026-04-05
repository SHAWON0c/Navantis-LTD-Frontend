

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
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { showToast } from "../component/common/toastService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const DEBUG = import.meta.env.DEV; // true only in development

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeId");
  };

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        const err = new Error("Token verification failed");
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const payload = data?.data?.user || data?.data || data?.user || data;

      const syncedRole = String(payload?.role || localStorage.getItem("role") || "").toLowerCase();
      const syncedEmployeeId =
        payload?.employeeId || payload?.employeeID || payload?.id || localStorage.getItem("employeeId") || "";

      if (!syncedRole) {
        if (DEBUG) console.log("⚠️ verify-token response missing role, keeping current session");
        return;
      }

      const syncedUser = {
        token,
        role: syncedRole,
        employeeId: syncedEmployeeId,
      };

      setUser(syncedUser);
      localStorage.setItem("role", syncedRole);
      localStorage.setItem("employeeId", syncedEmployeeId);

      if (DEBUG) console.log("✅ Auth re-synced from backend:", syncedUser);
    } catch (error) {
      const status = Number(error?.status || 0);
      const isNetworkError = error instanceof TypeError;
      
      // Network errors: Only logout if we don't have a cached user session
      // This prevents logouts on page refreshes when backend is temporarily down
      if (isNetworkError) {
        const hasCachedUser = user !== null;
        
        if (hasCachedUser) {
          // User is already loaded from localStorage, keep them logged in
          if (DEBUG) console.log("⚠️ Backend unreachable but user cached locally, keeping session", error);
          return;
        }
        
        // No cached user and backend down: don't logout yet, just skip verification
        if (DEBUG) console.log("⚠️ Backend unreachable and no cached user, will retry on next check", error);
        return;
      }

      // 401/403: Always logout regardless of cache
      if (status === 401 || status === 403) {
        if (DEBUG) console.log("🚨 verify-token unauthorized (401/403), clearing auth", error);
        showToast("Your session has expired. Please login again.", "warn");
        setUser(null);
        clearAuthStorage();
        return;
      }

      // Other errors: keep session
      if (DEBUG) console.log("⚠️ verify-token error, keeping session", error);
    }
  }, []);

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

    // Sync role/status from backend so UI updates if role changed in DB.
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    const handleVisibilitySync = () => {
      if (document.visibilityState === "visible") {
        verifyToken();
      }
    };

    window.addEventListener("focus", verifyToken);
    document.addEventListener("visibilitychange", handleVisibilitySync);

    return () => {
      window.removeEventListener("focus", verifyToken);
      document.removeEventListener("visibilitychange", handleVisibilitySync);
    };
  }, [verifyToken]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      verifyToken();
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [verifyToken]);

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
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        loading,
        verifyToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}