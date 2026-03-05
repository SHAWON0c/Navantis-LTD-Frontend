// // // // import { createContext, useContext, useState, useEffect } from "react";

// // // // const AuthContext = createContext();

// // // // export default function AuthProvider({ children }) {
// // // //   const [user, setUser] = useState(null); // { role, userId }
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const verifyToken = async () => {
// // // //       const token = localStorage.getItem("token");
// // // //       if (!token) {
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const res = await fetch("http://localhost:5000/api/auth/verify-token", {
// // // //           headers: { Authorization: token },
// // // //         });

// // // //         if (!res.ok) throw new Error("Token invalid or expired");

// // // //         const data = await res.json(); // { role, userId }
// // // //         setUser(data);
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setUser(null);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     verifyToken();
// // // //   }, []);

// // // //   return (
// // // //     <AuthContext.Provider value={{ user, setUser, loading }}>
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // }

// // // // export const useAuth = () => useContext(AuthContext);


// // // // src/provider/AuthProvider.jsx
// // // import { createContext, useState, useEffect, useContext } from "react";

// // // const AuthContext = createContext();

// // // export const useAuth = () => useContext(AuthContext);

// // // export default function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(null); // { role, userId, ... }
// // //   const [loading, setLoading] = useState(true);

// // //   const fetchUser = async () => {
// // //     const token = localStorage.getItem("token");
// // //     if (!token) {
// // //       setUser(null);
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const res = await fetch("http://localhost:5000/api/auth/verify-token", {
// // //         method: "GET",
// // //         headers: { Authorization: token }, // RAW token
// // //       });
// // //       if (!res.ok) throw new Error("Invalid token");

// // //       const data = await res.json();
// // //       setUser(data); // { role, userId }
// // //     } catch (err) {
// // //       console.log("AuthProvider: token invalid", err);
// // //       localStorage.removeItem("token");
// // //       setUser(null);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchUser();
// // //   }, []);

// // //   return (
// // //     <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
// // //       {children}
// // //     </AuthContext.Provider>
// // //   );
// // // }

// // // src/provider/AuthProvider.jsx
// // import { createContext, useState, useEffect, useContext } from "react";

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export default function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null); 
// //   const [loading, setLoading] = useState(true);

// //   const fetchUser = async () => {
// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       setUser(null);
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const res = await fetch("http://localhost:5000/api/auth/verify-token", {
// //         method: "GET",
// //         headers: {
// //           Authorization: token
// //         }
// //       });

// //       if (!res.ok) throw new Error("Token invalid");

// //       const data = await res.json();

// //       // expected response
// //       // { role: "md", userId: "123" }

// //       setUser({
// //         role: data.role?.toLowerCase(),
// //         userId: data.userId
// //       });

// //     } catch (err) {
// //       console.log("Token verification failed:", err);
// //       localStorage.removeItem("token");
// //       setUser(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUser();
// //   }, []);

// //   return (
// //     <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }


// // src/provider/AuthProvider.jsx
// import { createContext, useState, useEffect, useContext } from "react";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setUser(null);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/verify-token", {
//         method: "GET",
//         headers: {
//           Authorization: token
//         }
//       });

//       if (!res.ok) throw new Error("Token invalid");

//       const data = await res.json();

//       // store ALL backend data
//       setUser({
//         ...data,
//         role: data.role?.toLowerCase()
//       });

//     } catch (err) {
//       console.log("Token verification failed:", err);
//       localStorage.removeItem("token");
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// src/provider/AuthProvider.jsx
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // full user object
  const [loading, setLoading] = useState(true); // true until backend verified

  // ✅ Fast localStorage access for immediate UI render
  const getLocalUser = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const employeeId = localStorage.getItem("employeeId"); // optional
    if (token && role) {
      return { token, role: role.toLowerCase(), employeeId };
    }
    return null;
  };

  // 1️⃣ Initialize state from localStorage for fast dashboard render
  useEffect(() => {
    const localUser = getLocalUser();
    if (localUser) setUser(localUser);
    // we still verify with backend
    verifyToken();
  }, []);

  // 2️⃣ Backend verification for authenticity
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-token", {
        method: "GET",
        headers: { Authorization: token },
      });

      if (!res.ok) throw new Error("Token invalid");

      const data = await res.json(); // { role, userId, ... }

      // ✅ update state & normalize role
      const verifiedUser = { ...data, role: data.role?.toLowerCase() };
      setUser(verifiedUser);

      // ✅ update localStorage in case role changed
      localStorage.setItem("role", verifiedUser.role);
      localStorage.setItem("employeeId", verifiedUser.employeeId || "");

    } catch (err) {
      console.log("Token verification failed:", err);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("employeeId");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Login helper to update state + localStorage
  const loginUser = ({ token, role, employeeId }) => {
    const normalizedRole = role.toLowerCase();
    setUser({ token, role: normalizedRole, employeeId });
    localStorage.setItem("token", token);
    localStorage.setItem("role", normalizedRole);
    localStorage.setItem("employeeId", employeeId || "");
  };

  // 4️⃣ Logout helper
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeId");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loginUser, logoutUser, loading, verifyToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}