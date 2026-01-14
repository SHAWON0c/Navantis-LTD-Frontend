
import jwtDecode from "jwt-decode";
import { useGetUserByIdQuery } from "../redux/services/userAPI";

export const useUserProfile = () => {
  let userId = null;

  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
      console.log("Decoded JWT Payload:", decoded);
    }
  } catch (err) {
    console.error("Failed to decode JWT:", err);
  }

  const { data, error, isLoading } = useGetUserByIdQuery(userId, {
    skip: !userId, // Skip query if no token
  });

  return { data, error, isLoading };
};
