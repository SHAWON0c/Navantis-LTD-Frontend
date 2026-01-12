import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F5F9FC] flex items-center justify-center">
      <Outlet />
    </div>
  );
}
