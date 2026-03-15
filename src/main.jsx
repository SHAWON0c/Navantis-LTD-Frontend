// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./redux/store/store.js";
// import App from "./App.jsx";
// import "./App.css";
// import AuthProvider from "./provider/AuthProvider.jsx";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // make sure styles are imported
// import ErrorBoundary from "./component/ErrorBoundary.jsx";

// // Apply persisted theme before initial render to avoid light-mode flicker.
// const savedTheme = localStorage.getItem("darkMode");
// if (savedTheme === "true") {
//   document.documentElement.classList.add("dark");
// } else {
//   document.documentElement.classList.remove("dark");
// }

// // ReactDOM.createRoot(document.getElementById("root")).render(
// //   <React.StrictMode>
// //     <Provider store={store}>
// //       <AuthProvider>
// //         <BrowserRouter>
// //           <App />
// //           {/* 🟢 ToastContainer here at root */}
// //           <ToastContainer
// //             position="top-right"
// //             autoClose={3000}
// //             hideProgressBar={false}
// //             newestOnTop
// //             closeOnClick
// //             rtl={false}
// //             pauseOnFocusLoss
// //             draggable
// //             pauseOnHover
// //           />
// //         </BrowserRouter>
// //       </AuthProvider>
// //     </Provider>
// //   </React.StrictMode>
// // );


// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//       <ErrorBoundary>
//     <Provider store={store}>
//       <AuthProvider>
//         <BrowserRouter>
//           <App />
//           <ToastContainer />
//         </BrowserRouter>
//       </AuthProvider>
//     </Provider>
//     </ErrorBoundary>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.js";
import App from "./App.jsx";
import "./App.css";
import AuthProvider from "./provider/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./component/ErrorBoundary.jsx";

/* ============================= */
/* 🔥 GLOBAL ERROR HANDLERS */
/* ============================= */

window.onerror = function (message, source, lineno, colno, error) {
  console.error("🔥 Global Error:", {
    message,
    source,
    lineno,
    colno,
    error,
  });
};

window.onunhandledrejection = function (event) {
  console.error("🔥 Unhandled Promise Error:", event.reason);
};

/* ============================= */
/* 🌙 THEME PERSISTENCE */
/* ============================= */

// Apply saved dark mode before render (prevents flicker)
const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "true") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

/* ============================= */
/* 🚀 APP RENDER */
/* ============================= */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <App />

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);