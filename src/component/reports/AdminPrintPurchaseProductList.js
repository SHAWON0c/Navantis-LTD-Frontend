// const AdminPurchaseInvoice = ({ purchaseOrders, fromDate, toDate }) => {
//   // ================= TOTALS =================
//   const totalUniqueProducts = purchaseOrders.length;
//   const totalUnit = purchaseOrders.reduce((acc, order) => acc + order.Quantity, 0);
//   const totalTP = purchaseOrders.reduce(
//     (acc, order) => acc + order.PriceUnitTP * order.Quantity,
//     0
//   );

//   // ================= MAP PRODUCTS =================
//   const filteredProducts = purchaseOrders.map((order) => ({
//     productName: order.Name,
//     netWeight: order.PackSize,
//     batch: order.Batch || "N/A",
//     expire: new Date(order.Expire).toLocaleDateString("en-GB").replace(/\//g, "-"),
//     totalQuantity: order.Quantity,
//     tradePrice: order.PriceUnitTP,
//     orderDate: order.Date
//   }));

//   const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
//   const todayText = new Date().toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false, // 24-hour format
//   }) + '';


//   const displayDateRange = (fromDate, toDate) => {
//     if (fromDate && toDate && fromDate !== toDate) {
//       return `From <b>${fromDate}</b> to <b>${toDate}</b>`;
//     } else if (fromDate || toDate) {
//       return `Date <b>${fromDate || toDate}</b>`;
//     } else {
//       // Fallback: manual start year to today
//       return `From <b>01-01-2018</b> to <b>${today}</b>`;
//     }
//   };

//   // ================= HANDLE PRINT =================
//   const handlePrint = () => {
//     const companyHeader = `
//       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
//         <div>
//           <img src='/images/NPL-Updated-Logo.png' alt="Company Logo" style="width: 150px; height: auto;" />
//         </div>
//        <div style="text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
//           <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #1a1a1a;">Navantis Pharma Limited</h1>
//           <p style="margin: 2px 0; font-size: 10px; color: #555;">
//             Haque Villa, House No - 4, Block - C, Road No - 3,<br>Section - 1, Kolwalapara, Mirpur - 1, Dhaka - 1216
//           </p>
//           <p style="margin: 2px 0; font-size: 10px; color: #555;">Hotline: +880 1322-852183</p>
//         </div>
//       </div>
//       </div>

// <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 20px;">
//   <!-- Title -->
// <h2 style="
//     margin: 0; 
//     font-size: 16px; 
//     font-weight: 700; 
//     text-transform: uppercase; 
//     letter-spacing: 1px; 
//     color: #1a1a1a;
//     padding-left: 20px; /* space for the disc */
//     position: relative;
//     flex: 1; 
//     text-align: left;
// ">
//   <!-- Disc using pseudo-element -->
//   <span style="
//       position: absolute;
//       left: 0;
//       top: 50%;
//       transform: translateY(-50%);
//       width: 8px;
//       height: 8px;
//       background-color: #2E86C1; /* accent color */
//       border-radius: 50%;
//       display: inline-block;
//   "></span>
  
//   Admin Purchase List
// </h2>


//   <!-- Date Range -->
// <p style="margin: 0; font-size: 12px; flex: 1; text-align: center; color: #333; font-weight: 500;">
//       ${displayDateRange(fromDate, toDate)}
//     </p>

//     <!-- Printed On -->
//     <p style="margin: 0; font-size: 10px; flex: 1; text-align: right; font-style: italic; color: #555;">
//       Printed on: <b>${todayText}</b>
//     </p>
// </div>



//       <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #B2BEB5; border-radius: 4px; background-color: #f9f9f9;">
//      <h3 style="margin: 0 0 0px 0; font-size: 12px; font-weight: bold; text-align: center;">Summary</h3>
//         <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0;">
//           <span>Total Items</span><span>${totalUniqueProducts}</span>
//         </div>
//         <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; border-top: 1px solid #B2BEB5;">
//           <span>Total Quantity</span><span>${totalUnit}</span>
//         </div>
//         <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; border-top: 1px solid #B2BEB5;">
//           <span>Total Trade Price</span><span>${totalTP.toLocaleString("en-IN")}/-</span>
//         </div>
//       </div>
//     `;

//     const filteredTableContent = `
//       <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
//         <thead>
//           <tr style="background-color: #e0e0e0; font-weight: bold;">
//             <th style="border: 1px solid #000; padding: 6px; text-align: center;">Sl.</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: left;">Product Name</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: center;">Pack Size</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: center;">Batch</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: center;">Exp.</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: right;">Quantity</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: right;">Price/Unit (TP)</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: right;">Total Price (TP)</th>
//             <th style="border: 1px solid #000; padding: 6px; text-align: center;">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${filteredProducts.map((p, idx) => `
//             <tr>
//               <td style="border: 1px solid #000; text-align:center; padding: 5px;">${idx + 1}</td>
//               <td style="border: 1px solid #000; white-space: nowrap; padding: 5px;">${p.productName}</td>
//               <td style="border: 1px solid #000; text-align:center; padding: 5px;">${p.netWeight}</td>
//               <td style="border: 1px solid #000; text-align:center; padding: 5px;">${p.batch}</td>
//               <td style="border: 1px solid #000; text-align:center; padding: 5px;">${p.expire}</td>
//               <td style="border: 1px solid #000; text-align:right; padding: 5px;">${p.totalQuantity}</td>
//               <td style="border: 1px solid #000; text-align:right; padding: 5px;">${p.tradePrice.toLocaleString("en-IN")}/-</td>
//               <td style="border: 1px solid #000; text-align:right; padding: 5px;">${(p.tradePrice * p.totalQuantity).toLocaleString("en-IN")}/-</td>
//               <td style="border: 1px solid #000; text-align:center; padding: 5px;">${new Date(p.orderDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
//             </tr>
//           `).join("")}
//           <tr style="font-weight: bold; background-color: #f0f0f0;">
//             <td colspan="5" style="text-align:center; padding: 5px;">Total</td>
//             <td style="text-align:right; padding: 5px;">${totalUnit}</td>
//             <td></td>
//             <td style="text-align:right; padding: 5px;">${totalTP.toLocaleString("en-IN")}/-</td>
//             <td></td>
//           </tr>
//         </tbody>
//       </table>
//     `;

//     const newWindow = window.open();
//     const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')]
//       .map(s => s.outerHTML)
//       .join("");

//     newWindow.document.write(`
//       <html>
//         <head>
//           <title>Admin Purchase List - ${today}</title>
//           ${styles}
//           <style>
//             /* ===== PRINT STYLES ===== */
//             @page {
//               size: A4;
//               margin: 5mm 8mm 3mm 8mm; /* top right bottom left */
//             }
//             body {
//               margin: 0;
//               padding: 0;
//               font-family: Arial, sans-serif;
//               color: #000;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               font-size: 11px;
//             }
//             th, td {
//               border: 1px solid #000;
//               padding: 6px;
//             }
//             th {
//               background-color: #e0e0e0;
//               font-weight: bold;
//             }
//             tr:nth-child(even) {
//               background-color: #f9f9f9;
//             }
//             /* Hide browser default header/footer */
//             @media print {
//               body {
//                 -webkit-print-color-adjust: exact;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           ${companyHeader}
//           ${filteredTableContent}
//         </body>
//       </html>
//     `);

//     newWindow.document.close();
//     newWindow.onload = () => {
//       setTimeout(() => {
//         newWindow.focus();
//         newWindow.print();
//       }, 500);
//     };
//   };

//   return handlePrint;
// };

// export default AdminPurchaseInvoice;



















const AdminPurchaseInvoice = ({ purchaseOrders, fromDate, toDate }) => {
  // ================= TOTALS =================
  const totalUniqueProducts = purchaseOrders.length;
  const totalUnit = purchaseOrders.reduce((acc, order) => acc + order.Quantity, 0);
  const totalTP = purchaseOrders.reduce(
    (acc, order) => acc + order.PriceUnitTP * order.Quantity,
    0
  );

  // ================= MAP PRODUCTS =================
  const filteredProducts = purchaseOrders.map((order) => ({
    productName: order.Name,
    netWeight: order.PackSize,
    batch: order.Batch || "N/A",
    expire: new Date(order.Expire).toLocaleDateString("en-GB").replace(/\//g, "-"),
    totalQuantity: order.Quantity,
    tradePrice: order.PriceUnitTP,
    orderDate: order.Date
  }));

  const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const todayText = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }) + '';

  const displayDateRange = (fromDate, toDate) => {
    if (fromDate && toDate && fromDate !== toDate) {
      return `From <b>${fromDate}</b> to <b>${toDate}</b>`;
    } else if (fromDate || toDate) {
      return `Date <b>${fromDate || toDate}</b>`;
    } else {
      return `From <b>01-01-2018</b> to <b>${today}</b>`;
    }
  };

  // ================= HANDLE PRINT =================
  const handlePrint = () => {
    // Company header
    const companyHeader = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <div>
          <img src='/images/NPL-Updated-Logo.png' alt="Company Logo" style="width: 150px; height: auto;" />
        </div>
        <div style="text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #1a1a1a;">Navantis Pharma Limited</h1>
          <p style="margin: 2px 0; font-size: 10px; color: #555;">
            Haque Villa, House No - 4, Block - C, Road No - 3,<br>Section - 1, Kolwalapara, Mirpur - 1, Dhaka - 1216
          </p>
          <p style="margin: 2px 0; font-size: 10px; color: #555;">Hotline: +880 1322-852183</p>
        </div>
      </div>

      <!-- Invoice header row -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 20px;">
        <h2 style="
            margin: 0; 
            font-size: 16px; 
            font-weight: 700; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            color: #1a1a1a;
            padding-left: 20px;
            position: relative;
            flex: 1; 
            text-align: left;
        ">
          <span style="
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 8px;
              height: 8px;
              background-color: #2E86C1;
              border-radius: 50%;
              display: inline-block;
          "></span>
          Admin Purchase List
        </h2>

        <p style="margin: 0; font-size: 12px; flex: 1; text-align: center; color: #333; font-weight: 500;">
          ${displayDateRange(fromDate, toDate)}
        </p>

        <p style="margin: 0; font-size: 10px; flex: 1; text-align: right; font-style: italic; color: #555;">
          Printed on: <b>${todayText}</b>
        </p>
      </div>
    `;

    // Diagonal watermark
    const watermark = `
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        opacity: 0.08;
        z-index: 0;
        pointer-events: none;
        width: 100%;
        text-align: center;
      ">
        <img src='/images/NPL-Updated-Logo.png' style="width: 1200px; height: auto;" />
      </div>
    `;

    // Table and summary
    const filteredTableContent = `
      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #B2BEB5; border-radius: 4px; background-color: #f9f9f9; position: relative; z-index: 1;">
        <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; text-align: center;">Summary</h3>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0;">
          <span>Total Items</span><span>${totalUniqueProducts}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; border-top: 1px solid #B2BEB5;">
          <span>Total Quantity</span><span>${totalUnit}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; border-top: 1px solid #B2BEB5;">
          <span>Total Trade Price</span><span>${totalTP.toLocaleString("en-IN")}/-</span>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 11px; position: relative; z-index: 1;">
        <thead>
          <tr style="background-color: #e0e0e0; font-weight: bold;">
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">Sl.</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: left;">Product Name</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">Pack Size</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">Batch</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">Exp.</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: right;">Quantity</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: right;">Price/Unit (TP)</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: right;">Total Price (TP)</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${filteredProducts.map((p, idx) => `
            <tr>
              <td style="border: 1px solid #000; text-align:center; padding: 5px;">${idx + 1}</td>
              <td style="border: 1px solid #000; white-space: nowrap; padding: 5px;">${p.productName}</td>
              <td style="border: 1px solid #000; text-align:center; padding: 5px;">${p.netWeight}</td>
              <td style="border: 1px solid #000; text-align:center; padding: 5px;">${p.batch}</td>
              <td style="border: 1px solid #000; text-align:center; padding: 5px;">${p.expire}</td>
              <td style="border: 1px solid #000; text-align:right; padding: 5px;">${p.totalQuantity}</td>
              <td style="border: 1px solid #000; text-align:right; padding: 5px;">${p.tradePrice.toLocaleString("en-IN")}/-</td>
              <td style="border: 1px solid #000; text-align:right; padding: 5px;">${(p.tradePrice * p.totalQuantity).toLocaleString("en-IN")}/-</td>
              <td style="border: 1px solid #000; text-align:center; padding: 5px;">${new Date(p.orderDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
            </tr>
          `).join("")}
          <tr style="font-weight: bold; background-color: #f0f0f0;">
            <td colspan="5" style="text-align:center; padding: 5px;">Total</td>
            <td style="text-align:right; padding: 5px;">${totalUnit}</td>
            <td></td>
            <td style="text-align:right; padding: 5px;">${totalTP.toLocaleString("en-IN")}/-</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `;

    const newWindow = window.open();
    const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')].map(s => s.outerHTML).join("");

    newWindow.document.write(`
      <html>
        <head>
          <title>Admin Purchase List - ${today}</title>
          ${styles}
          <style>
            @page { size: A4; margin: 5mm 8mm 3mm 8mm; }
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; color: #000; position: relative; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #000; padding: 6px; }
            th { background-color: #e0e0e0; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          ${companyHeader}
          ${watermark}
          ${filteredTableContent}
        </body>
      </html>
    `);

    newWindow.document.close();
    newWindow.onload = () => {
      setTimeout(() => {
        newWindow.focus();
        newWindow.print();
      }, 500);
    };
  };

  return handlePrint;
};

export default AdminPurchaseInvoice;
