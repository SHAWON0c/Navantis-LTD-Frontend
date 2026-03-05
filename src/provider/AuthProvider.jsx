// // import { createContext, useContext, useState, useEffect } from "react";

// // const AuthContext = createContext();

// // export default function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null); // { role, userId }
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const verifyToken = async () => {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         setLoading(false);
// //         return;
// //       }

// //       try {
// //         const res = await fetch("http://localhost:5000/api/auth/verify-token", {
// //           headers: { Authorization: token },
// //         });

// //         if (!res.ok) throw new Error("Token invalid or expired");

// //         const data = await res.json(); // { role, userId }
// //         setUser(data);
// //       } catch (err) {
// //         console.error(err);
// //         setUser(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     verifyToken();
// //   }, []);

// //   return (
// //     <AuthContext.Provider value={{ user, setUser, loading }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export const useAuth = () => useContext(AuthContext);


// // src/provider/AuthProvider.jsx
// import { createContext, useState, useEffect, useContext } from "react";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // { role, userId, ... }
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
//         headers: { Authorization: token }, // RAW token
//       });
//       if (!res.ok) throw new Error("Invalid token");

//       const data = await res.json();
//       setUser(data); // { role, userId }
//     } catch (err) {
//       console.log("AuthProvider: token invalid", err);
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
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-token", {
        method: "GET",
        headers: {
          Authorization: token
        }
      });

      if (!res.ok) throw new Error("Token invalid");

      const data = await res.json();

      // expected response
      // { role: "md", userId: "123" }

      setUser({
        role: data.role?.toLowerCase(),
        userId: data.userId
      });

    } catch (err) {
      console.log("Token verification failed:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}