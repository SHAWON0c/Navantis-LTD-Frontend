// import { useState } from "react";
// // If logo is in public folder → use "/logo.png"
// import logo from "../assets/react.svg";

// export default function Login() {
//   const [employeeId, setEmployeeId] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // 🔐 Login payload
//     const payload = {
//       employeeId,
//       password,
//     };

//     console.log("Login payload:", payload);

//     // TODO: connect API here
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-gray-50">
//       {/* Login Panel */}
//       <div className="flex-1 flex items-center justify-center px-8 py-16 relative overflow-hidden">
//         <div className="relative w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 flex flex-col justify-between">

//           {/* Header */}
//           <div className="space-y-4 text-center">
//             {/* Logo */}
//             <div className="flex justify-center">
//               <img
//                 src={logo}
//                 alt="Company Logo"
//                 className="h-16 w-auto"
//               />
//             </div>

//             <h2 className="text-2xl font-semibold text-gray-800">
//               Sign in
//             </h2>
//             <p className="text-sm text-gray-500">
//               Use your corporate credentials
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             {/* Employee ID */}
//             <div className="space-y-2">
//               <label className="text-sm text-gray-600">
//                 Employee ID or Email
//               </label>
//               <input
//                 type="text"
//                 placeholder="EMP-1001 or name@company.com"
//                 value={employeeId}
//                 onChange={(e) => setEmployeeId(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <label className="text-sm text-gray-600">Password</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
//                 required
//               />
//             </div>

//             {/* Remember / Forgot */}
//             <div className="flex items-center justify-between text-sm pt-2">
//               <label className="flex items-center gap-2 text-gray-600">
//                 <input type="checkbox" className="rounded" />
//                 Remember me
//               </label>
//               <button
//                 type="button"
//                 className="text-blue-700 hover:underline"
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full py-3 mt-6 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium"
//             >
//               Sign in
//             </button>
//           </form>

//           {/* Footer */}
//           <div className="mt-8 text-center text-xs text-gray-400">
//             Authorized users only. All activities are monitored.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/react.svg";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const payload = {
      employeeId,
      password,
    };

    console.log("Login payload:", payload);
    // TODO: call login API
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">

          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <img
                src={logo}
                alt="Company Logo"
                className="h-16 w-auto"
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">
              Sign in
            </h2>

            <p className="text-sm text-gray-500">
              Use your corporate credentials
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* Employee ID */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Employee ID or Email
              </label>
              <input
                type="text"
                placeholder="EMP-1001 or name@company.com"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-medium"
            >
              Sign in
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-700 font-medium hover:underline"
            >
              Register
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400">
            Authorized users only. All activities are monitored.
          </div>

        </div>
      </div>
    </div>
  );
}
