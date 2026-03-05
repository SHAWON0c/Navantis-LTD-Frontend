import React from "react";
import { Activity } from "lucide-react";

const SidebarLogo = ({ isOpen }) => {
  return (
    <div className="h-16 flex items-center justify-center border-b border-white bg-black dark:bg-gray-800">
      {isOpen ? (
        <img
          src="/images/NPL-Logo2.png"
          alt="Logo"
          className="h-auto w-auto"
        />
      ) : (
        <Activity className="w-6 h-6 text-white" />
      )}
    </div>
  );
};

export default React.memo(SidebarLogo);