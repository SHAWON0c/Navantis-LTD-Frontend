import { useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-gray-500 mb-3">
      NPL / Account / {paths[0] || "Dashboard"}
    </div>
  );
}
