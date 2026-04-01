// src/App.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";

const BASE_TITLE = "EMS";

const getRouteTitle = (pathname) => {
  if (!pathname || pathname === "/") {
    return BASE_TITLE;
  }

  const parts = pathname
    .split("/")
    .filter(Boolean)
    .filter((part) => !/^\d+$/.test(part));

  if (parts.length === 0) {
    return BASE_TITLE;
  }

  const routeName = parts
    .map((segment) =>
      segment
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .filter(Boolean)
    .join(" - ");

  return routeName ? `${BASE_TITLE} - ${routeName}` : BASE_TITLE;
};

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getRouteTitle(pathname);
  }, [pathname]);

  return <AppRoutes />;
}
