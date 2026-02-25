// "use client";
// import React, { useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { useAuth } from "../../provider/AuthProvider";

// const InvoiceViewPage = () => {
//   const invoiceRef = useRef();
//   const location = useLocation();
//   const order = location.state?.order;
//   const { userInfo, loading: authLoading } = useAuth();

//   if (!order)
//     return <p className="text-center mt-12">No invoice data available</p>;

//   const handlePrint = () => {
//     const content = invoiceRef.current.innerHTML;
//     const win = window.open("", "", "width=1000,height=900");

//     win.document.write(`
//       <html>
//       <head>
//         <title>Invoice</title>
//         <style>
//           ${document.getElementById("invoice-style").innerHTML}
//         </style>
//       </head>
//       <body>${content}</body>
//       </html>
//     `);

//     win.document.close();
//     win.focus();
//     win.print();
//   };

//   // ===== CALCULATIONS =====

// const grossTradePrice = Number(order.totalAmount || 0);
// const tradeDiscount = Number(order.customerDiscount || 0);
// const netPayable = Number(order.totalPayable || order.netAmount || 0);

// const specialDiscount = Number(order.specialDiscount || 0);
// const vat = Number(order.vat || 0);



//   // ===== CUSTOMER INFO =====
//   const customer = order.customer || {};

//   const assignedRider = order?.assignedRider?.riderName
//     ? `${order.assignedRider.riderName} - ${order.assignedRider.riderId || ""}`
//     : order?.assignedRiderId
//     ? `ID - ${order.assignedRiderId}`
//     : "N/A";

//   const mpoName = order.mpo?.mpoName || "N/A";
//   const mpoPhone = order.mpo?.mpoPhone || "N/A";

//   return (
//     <div style={{ background: "#eee", minHeight: "100vh", padding: 20 }}>
//       <style id="invoice-style">{`
//         body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; color: #333; margin: 20px; }
//         .container { width: 100%; background:#fff; padding:25px; }
//         .invoice-header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2E86C1; padding-bottom:8px; margin-bottom:15px; }
//         .invoice-header img { width:140px; }
//         .company-info { text-align:right; font-size:11px; }
//         .company-name { font-size:20px; font-weight:bold; }
//         .invoice-title { text-align:center; font-size:18px; font-weight:700; color:#2E86C1; margin:20px 0 10px; border-bottom:2px solid #ccc; }
//         .info-box { display:flex; justify-content:space-between; border:2px solid #ccc; padding:12px; margin-bottom:20px; border-radius:4px; }
//         .info-box div { width:48%; }
//         table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:15px; }
//         th,td { border:1px solid #ddd; padding:6px 8px; }
//         th { background:#f7f7f7; text-align:center; }
//         tr:nth-child(even){ background:#fafafa; }
//         .right { text-align:right; }
//         .center { text-align:center; }
//         .signature { display:flex; justify-content:space-between; margin-top:50px; }
//         .signature div { width:22%; text-align:center; border-top:1px solid #333; padding-top:5px; font-weight:600; }
//         .footer-info { display:flex; justify-content:space-between; font-size:10px; color:#555; margin-top:15px; }
//         @media print { button { display:none; } }
//       `}</style>

//       <button
//         onClick={handlePrint}
//         style={{
//           background: "#2E86C1",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 5,
//           cursor: "pointer",
//           marginBottom: 15
//         }}
//       >
//         🖨 Print Invoice
//       </button>

//       <div
//         ref={invoiceRef}
//         className="container"
//         style={{ boxShadow: "0 0 10px rgba(0,0,0,.2)" }}
//       >
//         {/* Header */}
//         <div className="invoice-header">
//           <img src="/images/NPL-Updated-Logo.png" alt="Company Logo" />
//           <div className="company-info">
//             <div className="company-name">Navantis Pharma Limited</div>
//             Mirpur-1, Dhaka-1216 <br />
//             Hotline: +880 1322-852183
//           </div>
//         </div>

//         <div className="invoice-title">INVOICE</div>

//         {/* Customer Info */}
//         <div className="info-box">
//           <div>
//             <b>Customer ID:</b> {customer.customerId || "-"} <br />
//             <b>Name:</b> {customer.customerName || "-"} <br />
//             <b>Address:</b> {customer.address || "-"} <br />
//             <b>Phone:</b>{" "}
//             {customer.mobile || customer.phoneNumber || "-"} <br />
//             <b>Territory:</b> {order.territory?.territoryName || "-"} <br />
//             <b>Zone:</b> {order.zone?.zoneName || "-"}
//           </div>

//           <div>
//             <b>Invoice No:</b> {order.invoiceNo || "-"} <br />
//             <b>Date:</b>{" "}
//             {order.orderDate
//               ? new Date(order.orderDate).toLocaleDateString("en-GB")
//               : "-"}{" "}
//             <br />
//             <b>Payment Mode:</b> {order.payMode || "-"} <br />
//             <b>Ordered By:</b> {mpoName} <br />
//             <b>Phone:</b> {mpoPhone} <br />
//             <b>Delivered By:</b> {assignedRider}
//           </div>
//         </div>

//         {/* Product Table */}
//         <table>
//           <thead>
//             <tr>
//               <th>Sl</th>
//               <th>Product ID</th>
//               <th>Product</th>
//               <th>Pack</th>
//               <th>Batch</th>
//               <th>Exp</th>
//               <th>Price</th>
//               <th>Qty</th>
//               <th>Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {order.products?.map((p, idx) => (
//               <tr key={idx}>
//                 <td className="center">{idx + 1}</td>
//                 <td>{p.productId || "-"}</td>
//                 <td>{p.productName || "-"}</td>
//                 <td className="center">{p.packSize || "-"}</td>
//                 <td className="center">{p.batch || "-"}</td>
//                 <td className="center">
//                   {p.earliestExpiryDate
//                     ? new Date(p.earliestExpiryDate).toLocaleDateString(
//                         "en-GB"
//                       )
//                     : "-"}
//                 </td>
//                 <td className="right">
//                   {(p.tradePrice || p.price || 0).toLocaleString()}
//                 </td>
//                 <td className="right">{p.quantity || 0}</td>
//                 <td className="right">
//                   {(
//                     (p.tradePrice || p.price || 0) *
//                     (p.quantity || 0)
//                   ).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* ===== PROFESSIONAL TOTALS SECTION ===== */}
//         <div style={{ display: "flex", justifyContent: "flex-end" }}>
//           <div style={{ width: "360px" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <tbody>
//                 <tr>
//                   <td>Gross Trade Price</td>
//                   <td className="right">
//                     {grossTradePrice.toLocaleString()}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>Trade Discount</td>
//                   <td className="right">
//                     {tradeDiscount.toLocaleString()}
//                   </td>
//                 </tr>
//                 {/* <tr>
//                   <td>Special Discount</td>
//                   <td className="right">
//                     {specialDiscount.toLocaleString()}
//                   </td>
//                 </tr> */}
//                 {/* <tr>
//                   <td>VAT</td>
//                   <td className="right">{vat.toLocaleString()}</td>
//                 </tr> */}
//                 <tr style={{ background: "#f1f1f1", fontWeight: "bold" }}>
//                   <td>Net Payable Amount</td>
//                   <td className="right">
//                     {netPayable.toLocaleString()}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Signature */}
//         <div className="signature">
//           <div>Customer</div>
//           <div>Depot In-charge</div>
//           <div>Accounts</div>
//           <div>Authorized by</div>
//         </div>

//         {/* Footer */}
//         <div className="footer-info">
//           <span>
//             Print Date: {new Date().toLocaleDateString("en-GB")}
//           </span>
//           <span>Prepared by: {userInfo?.name}</span>
//           <span>Printed by: {userInfo?.name}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceViewPage;


// "use client";
// import React, { useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { useAuth } from "../../provider/AuthProvider";

// const InvoiceViewPage = () => {
//   const invoiceRef = useRef();
//   const location = useLocation();
//   const order = location.state?.order;
//   const { userInfo } = useAuth();

//   if (!order)
//     return <p className="text-center mt-12">No invoice data available</p>;

//   const handlePrint = () => {
//     const content = invoiceRef.current.innerHTML;
//     const win = window.open("", "", "width=1000,height=900");

//     win.document.write(`
//       <html>
//       <head>
//         <title>Invoice</title>
//         <style>
//           ${document.getElementById("invoice-style").innerHTML}
//         </style>
//       </head>
//       <body>${content}</body>
//       </html>
//     `);

//     win.document.close();
//     win.focus();
//     win.print();
//   };

//   // ===== CALCULATIONS =====
//   const grossTradePrice = Number(order.totalAmount || 0);
//   const tradeDiscount = Number(order.customerDiscount || 0);
//   const netPayable = Number(order.totalPayable || order.netAmount || 0);

//   const specialDiscount = Number(order.specialDiscount || 0);
//   const vat = Number(order.vat || 0);

//   // ===== CUSTOMER INFO =====
//   const customer = order.customer || {};

//   const assignedRider = order?.assignedRider?.riderName
//     ? `${order.assignedRider.riderName} - ${order.assignedRider.riderId || ""}`
//     : order?.assignedRiderId
//     ? `ID - ${order.assignedRiderId}`
//     : "N/A";

//   const mpoName = order.mpo?.mpoName || "N/A";
//   const mpoPhone = order.mpo?.mpoPhone || "N/A";

//   // Absolute URL for logo
//   const logoUrl = window.location.origin + "/images/NPL-Updated-Logo.png";

//   return (
//     <div style={{ background: "#eee", minHeight: "100vh", padding: 20 }}>
//       <style id="invoice-style">{`
//         body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; color: #333; margin: 20px; }
//         .container { width: 100%; background:#fff; padding:25px; }
//         .invoice-header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2E86C1; padding-bottom:8px; margin-bottom:15px; }
//         .invoice-header img { width:140px; }
//         .company-info { text-align:right; font-size:11px; }
//         .company-name { font-size:20px; font-weight:bold; }
//         .invoice-title { text-align:center; font-size:18px; font-weight:700; color:#2E86C1; margin:20px 0 10px; border-bottom:2px solid #ccc; }
//         .info-box { display:flex; justify-content:space-between; border:1px solid #ccc; padding:12px; margin-bottom:20px; border-radius:4px; }
//         .info-box div { width:48%; }
//         table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:15px; }
//         th,td { border:1px solid #ddd; padding:6px 8px; }
//         th { background:#f7f7f7; text-align:center; }
//         tr:nth-child(even){ background:#fafafa; }
//         .right { text-align:right; }
//         .center { text-align:center; }
//         .totals-row td { background:#f1f1f1; font-weight:600; }
//         .signature { display:flex; justify-content:space-between; margin-top:50px; }
//         .signature div { width:22%; text-align:center; border-top:1px solid #333; padding-top:5px; font-weight:600; }
//         .footer-info { display:flex; justify-content:space-between; font-size:10px; color:#555; margin-top:15px; }
//         @media print { button { display:none; } }
//       `}</style>

//       {/* Print Button */}
//       <button
//         onClick={handlePrint}
//         style={{
//           background: "#2E86C1",
//           color: "#fff",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: 5,
//           cursor: "pointer",
//           marginBottom: 15
//         }}
//       >
//         🖨 Print Invoice
//       </button>

//       <div
//         ref={invoiceRef}
//         className="container"
//         style={{ boxShadow: "0 0 10px rgba(0,0,0,.2)" }}
//       >
//         {/* Header */}
//         <div className="invoice-header">
//           <img src={logoUrl} alt="Company Logo" />
//           <div className="company-info">
//             <div className="company-name">Navantis Pharma Limited</div>
//             Mirpur-1, Dhaka-1216 <br />
//             Hotline: +880 1322-852183
//           </div>
//         </div>

//         <div className="invoice-title">INVOICE</div>

//         {/* Customer Info */}
//         <div className="info-box">
//           <div>
//             <b>Customer ID:</b> {customer.customerId || "-"} <br />
//             <b>Name:</b> {customer.customerName || "-"} <br />
//             <b>Address:</b> {customer.address || "-"} <br />
//             <b>Phone:</b> {customer.mobile || customer.phoneNumber || "-"} <br />
//             <b>Territory:</b> {order.territory?.territoryName || "-"} <br />
//             <b>Zone:</b> {order.zone?.zoneName || "-"}
//           </div>

//           <div>
//             <b>Invoice No:</b> {order.invoiceNo || "-"} <br />
//             <b>Date:</b>{" "}
//             {order.orderDate
//               ? new Date(order.orderDate).toLocaleDateString("en-GB")
//               : "-"}{" "}
//             <br />
//             <b>Payment Mode:</b> {order.payMode || "-"} <br />
//             <b>Ordered By:</b> {mpoName} <br />
//             <b>Phone:</b> {mpoPhone} <br />
//             <b>Delivered By:</b> {assignedRider}
//           </div>
//         </div>

//         {/* Product Table */}
//         <table>
//           <thead>
//             <tr>
//               <th>Sl</th>
//               <th>Product ID</th>
//               <th>Product</th>
//               <th>Pack</th>
//               <th>Batch</th>
//               <th>Exp</th>
//               <th>Price</th>
//               <th>Qty</th>
//               <th>Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {order.products?.map((p, idx) => (
//               <tr key={idx}>
//                 <td className="center">{idx + 1}</td>
//                 <td>{p.productId || "-"}</td>
//                 <td>{p.productName || "-"}</td>
//                 <td className="center">{p.packSize || "-"}</td>
//                 <td className="center">{p.batch || "-"}</td>
//                 <td className="center">
//                   {p.earliestExpiryDate
//                     ? new Date(p.earliestExpiryDate).toLocaleDateString("en-GB")
//                     : "-"}
//                 </td>
//                 <td className="right">{(p.tradePrice || p.price || 0).toLocaleString()}</td>
//                 <td className="right">{p.quantity || 0}</td>
//                 <td className="right">
//                   {((p.tradePrice || p.price || 0) * (p.quantity || 0)).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Totals Section */}
//         <div style={{ display: "flex", justifyContent: "flex-end" }}>
//           <div style={{ width: "360px" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <tbody>
//                 <tr>
//                   <td>Gross Trade Price</td>
//                   <td className="right">{grossTradePrice.toLocaleString()}</td>
//                 </tr>
//                 <tr>
//                   <td>Trade Discount</td>
//                   <td className="right">{tradeDiscount.toLocaleString()}</td>
//                 </tr>
//                 <tr style={{ background: "#f1f1f1", fontWeight: "bold" }}>
//                   <td>Net Payable Amount</td>
//                   <td className="right">{netPayable.toLocaleString()}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Signature */}
//         <div className="signature">
//           <div>Customer</div>
//           <div>Depot In-charge</div>
//           <div>Accounts</div>
//           <div>Authorized by</div>
//         </div>

//         {/* Footer */}
//         <div className="footer-info">
//           <span>Print Date: {new Date().toLocaleDateString("en-GB")}</span>
//           <span>Prepared by: {userInfo?.name}</span>
//           <span>Printed by: {userInfo?.name}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceViewPage;



"use client";
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";

const InvoiceViewPage = () => {
  const invoiceRef = useRef();
  const location = useLocation();
  const order = location.state?.order;
  const { userInfo } = useAuth();

  if (!order)
    return <p className="text-center mt-12">No invoice data available</p>;

  const handlePrint = () => {
    const content = invoiceRef.current.innerHTML;
    const win = window.open("", "", "width=1000,height=900");

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            ${document.getElementById("invoice-style").innerHTML}
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.focus();

    // Wait for all images to load before printing
    const images = win.document.images;
    let loaded = 0;

    if (images.length === 0) {
      win.print();
      win.close();
    } else {
      for (let i = 0; i < images.length; i++) {
        images[i].onload = images[i].onerror = () => {
          loaded++;
          if (loaded === images.length) {
            win.print();
            win.close();
          }
        };
      }
    }
  };

  // ===== CALCULATIONS =====
  const grossTradePrice = Number(order.totalAmount || 0);
  const tradeDiscount = Number(order.customerDiscount || 0);
  const netPayable = Number(order.totalPayable || order.netAmount || 0);

  const specialDiscount = Number(order.specialDiscount || 0);
  const vat = Number(order.vat || 0);

  // ===== CUSTOMER INFO =====
  const customer = order.customer || {};

  const assignedRider = order?.assignedRider?.riderName
    ? `${order.assignedRider.riderName} - ${order.assignedRider.riderId || ""}`
    : order?.assignedRiderId
    ? `ID - ${order.assignedRiderId}`
    : "N/A";

  const mpoName = order.mpo?.mpoName || "N/A";
  const mpoPhone = order.mpo?.mpoPhone || "N/A";

  // Logo in public folder
  const logoUrl = "/images/NPL-Updated-Logo.png";

  return (
    <div style={{ background: "#eee", minHeight: "100vh", padding: 20 }}>
      <style id="invoice-style">{`
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; color: #333; margin: 20px; }
        .container { width: 100%; background:#fff; padding:25px; }
        .invoice-header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2E86C1; padding-bottom:8px; margin-bottom:15px; }
        .invoice-header img { width:150px; }
        .company-info { text-align:right; font-size:11px; }
        .company-name { font-size:20px; font-weight:bold; }
        .invoice-title { text-align:center; font-size:18px; font-weight:700; color:#2E86C1; margin:20px 0 10px; border-bottom:2px solid #ccc; }
        .info-box { display:flex; justify-content:space-between; border:2px solid #ccc; padding:12px; margin-bottom:20px; border-radius:4px; }
        .info-box div { width:48%; }
        table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:15px; }
        th,td { border:1px solid #ddd; padding:6px 8px; }
        th { background:#f7f7f7; text-align:center; }
        tr:nth-child(even){ background:#fafafa; }
        .right { text-align:right; }
        .center { text-align:center; }
        .totals-row td { background:#f1f1f1; font-weight:600; }
        .signature { display:flex; justify-content:space-between; margin-top:50px; }
        .signature div { width:22%; text-align:center; border-top:1px solid #333; padding-top:5px; font-weight:600; }
        .footer-info { display:flex; justify-content:space-between; font-size:10px; color:#555; margin-top:15px; }
        @media print { button { display:none; } }
      `}</style>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        style={{
          background: "#2E86C1",
          color: "#fff",
          padding: "10px 16px",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          marginBottom: 15
        }}
      >
        🖨 Print Invoice
      </button>

      <div
        ref={invoiceRef}
        className="container"
        style={{ boxShadow: "0 0 10px rgba(0,0,0,.2)" }}
      >
        {/* Header */}
        <div className="invoice-header">
          <img src={logoUrl} alt="Company Logo" />
          <div className="company-info">
            <div className="company-name">Navantis Pharma Limited</div>
            Mirpur-1, Dhaka-1216 <br />
            Hotline: +880 1322-852183
          </div>
        </div>

        <div className="invoice-title">INVOICE</div>

        {/* Customer Info */}
        <div className="info-box">
          <div>
            <b>Customer ID:</b> {customer.customerId || "-"} <br />
            <b>Name:</b> {customer.customerName || "-"} <br />
            <b>Address:</b> {customer.address || "-"} <br />
            <b>Phone:</b> {customer.mobile || customer.phoneNumber || "-"} <br />
            <b>Territory:</b> {order.territory?.territoryName || "-"} <br />
            <b>Zone:</b> {order.zone?.zoneName || "-"}
          </div>

          <div>
            <b>Invoice No:</b> {order.invoiceNo || "-"} <br />
            <b>Date:</b>{" "}
            {order.orderDate
              ? new Date(order.orderDate).toLocaleDateString("en-GB")
              : "-"}{" "}
            <br />
            <b>Payment Mode:</b> {order.payMode || "-"} <br />
            <b>Ordered By:</b> {mpoName} <br />
            <b>Phone:</b> {mpoPhone} <br />
            <b>Delivered By:</b> {assignedRider}
          </div>
        </div>

        {/* Product Table */}
        <table>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Product ID</th>
              <th>Product</th>
              <th>Pack</th>
              <th>Batch</th>
              <th>Exp</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {order.products?.map((p, idx) => (
              <tr key={idx}>
                <td className="center">{idx + 1}</td>
                <td>{p.productId || "-"}</td>
                <td>{p.productName || "-"}</td>
                <td className="center">{p.packSize || "-"}</td>
                <td className="center">{p.batch || "-"}</td>
                <td className="center">
                  {p.earliestExpiryDate
                    ? new Date(p.earliestExpiryDate).toLocaleDateString("en-GB")
                    : "-"}
                </td>
                <td className="right">{(p.tradePrice || p.price || 0).toLocaleString()}</td>
                <td className="right">{p.quantity || 0}</td>
                <td className="right">
                  {((p.tradePrice || p.price || 0) * (p.quantity || 0)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "360px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td>Gross Trade Price</td>
                  <td className="right">{grossTradePrice.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Trade Discount</td>
                  <td className="right">{tradeDiscount.toLocaleString()}</td>
                </tr>
                <tr style={{ background: "#f1f1f1", fontWeight: "bold" }}>
                  <td>Net Payable Amount</td>
                  <td className="right">{netPayable.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature */}
        <div className="signature">
          <div>Customer</div>
          <div>Depot In-charge</div>
          <div>Accounts</div>
          <div>Authorized by</div>
        </div>

        {/* Footer */}
        <div className="footer-info">
          <span>Print Date: {new Date().toLocaleDateString("en-GB")}</span>
          <span>Prepared by: {userInfo?.name}</span>
          <span>Printed by: {userInfo?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewPage;