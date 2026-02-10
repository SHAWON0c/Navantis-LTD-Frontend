// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// // 1️⃣ Create context
// const AuthContext = createContext();

// // 2️⃣ Custom hook to use auth
// export const useAuth = () => useContext(AuthContext);

// // 3️⃣ Provider component
// const AuthProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState({ email: "", name: "" });
//   const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get("http://localhost:5000/api/users/me", {
//         headers: { Authorization: token },
//       });

//       if (res.data.success) {
//         const user = res.data.data.user;
//         const org = res.data.data.organizationProfile;

//         setUserInfo({
//           name: org?.name || user?.name || "",   // org name first, fallback user name
//           email: user?.email || "", // user email first, fallback org email
//         });
//       }
//     } catch (err) {
//       console.error("Failed to fetch user info:", err);
//       setUserInfo({ email: "", name: "" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchUser();
// }, []);


//   return (
//     <AuthContext.Provider value={{ userInfo, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// 1️⃣ Create context
const AuthContext = createContext();

// 2️⃣ Custom hook to use auth
export const useAuth = () => useContext(AuthContext);

// 3️⃣ Provider component
const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({ email: "", name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: token },
        });

        if (res.data.success) {
          const user = res.data.data; // ✅ user object
          const org = res.data.data.organizationProfile;
          console.log("API response:", user); 

          console.log("Fetched user:", user); 
          console.log("Fetched org:", org);

          setUserInfo({
            name: org?.name || "",     // you can still keep org name
            email: user?.email || "",  // ✅ user email only
          });
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUserInfo({ email: "", name: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
