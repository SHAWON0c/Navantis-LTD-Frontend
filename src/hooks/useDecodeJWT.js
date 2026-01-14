import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export const useDecodeJWT = () => {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }

      const decoded = jwtDecode(token);
      console.log("✅ Decoded JWT Payload:", decoded);

      setPayload(decoded);
    } catch (error) {
      console.error("❌ Failed to decode JWT:", error);
    }
  }, []);

  return payload;
};
