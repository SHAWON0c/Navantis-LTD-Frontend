const PrintDepotStockList = ({ products, summary }) => {

  // ================= BACKEND TOTALS =================
  const totalUniqueProducts = summary?.totalUniqueProducts || 0;
  const totalUnit = summary?.totalUnits || 0;
  const totalTP = summary?.totalTradePrice || 0;

  // ================= MAP PRODUCTS =================
  const filteredProducts = products.map((p) => ({
    productName: p.productName,
    netWeight: p.packSize,
    batch: p.batch || "N/A",
    expire: p.expireDate
      ? new Date(p.expireDate).toLocaleDateString("en-GB").replace(/\//g, "-")
      : "N/A",
    totalQuantity: p.totalQuantity,
    tradePrice: p.tradePrice,
    totalTP: p.totalPrice, // backend calculated
    orderDate: p.createdAt,
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
  });

  // ================= HANDLE PRINT =================
  const handlePrint = () => {

    // ===== COMPANY HEADER =====
    const companyHeader = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #000; padding-bottom:10px;">
        <div>
          <img src='/images/NPL-Updated-Logo.png' style="width:150px;" />
        </div>
        <div style="text-align:right; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <h1 style="margin:0; font-size:20px; font-weight:bold;">Navantis Pharma Limited</h1>
          <p style="margin:2px 0; font-size:10px;">
            Haque Villa, House No - 4, Block - C, Road No - 3,<br/>
            Section - 1, Kolwalapara, Mirpur - 1, Dhaka - 1216
          </p>
          <p style="margin:2px 0; font-size:10px;">Hotline: +880 1322-852183</p>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="font-size:16px; font-weight:700; text-transform:uppercase; padding-left:20px; position:relative;">
          <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:8px; height:8px; background:#2E86C1; border-radius:50%;"></span>
          Depot Stock List
        </h2>

        <p style="font-size:10px; font-style:italic;">
          Printed on: <b>${todayText}</b>
        </p>
      </div>
    `;

    // ===== WATERMARK =====
    const watermark = `
      <div style="
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%) rotate(-45deg);
        opacity:0.08;
        z-index:0;
        pointer-events:none;
        width:100%;
        text-align:center;
      ">
        <img src='/images/NPL-Updated-Logo.png' style="width:1200px;" />
      </div>
    `;

    // ===== SUMMARY + TABLE =====
    const filteredTableContent = `
      <div style="margin-bottom:20px; padding:10px; border:1px solid #B2BEB5; border-radius:4px; background:#f9f9f9;">
        <h3 style="font-size:12px; font-weight:bold; text-align:center;">Depot Stock Summary</h3>

        <div style="display:flex; justify-content:space-between; font-size:12px;">
          <span>Total Products</span><span>${totalUniqueProducts}</span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; border-top:1px solid #B2BEB5;">
          <span>Total Quantity</span><span>${totalUnit}</span>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; border-top:1px solid #B2BEB5;">
          <span>Total Stock Value (TP)</span><span>${totalTP.toLocaleString("en-IN")}/-</span>
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:11px;">
        <thead>
          <tr style="background:#e0e0e0; font-weight:bold;">
            <th>Sl.</th>
            <th>Product Name</th>
            <th>Pack Size</th>
            <th>Batch</th>
            <th>Exp.</th>
            <th>Quantity</th>
            <th>Price/Unit (TP)</th>
            <th>Total Price (TP)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${filteredProducts
            .map(
              (p, idx) => `
            <tr>
              <td style="text-align:center;">${idx + 1}</td>
              <td>${p.productName}</td>
              <td style="text-align:center;">${p.netWeight}</td>
              <td style="text-align:center;">${p.batch}</td>
              <td style="text-align:center;">${p.expire}</td>
              <td style="text-align:right;">${p.totalQuantity}</td>
              <td style="text-align:right;">${p.tradePrice.toLocaleString("en-IN")}/-</td>
              <td style="text-align:right;">${p.totalTP.toLocaleString("en-IN")}/-</td>
              <td style="text-align:center;">${new Date(p.orderDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
            </tr>
          `
            )
            .join("")}

          <tr style="font-weight:bold; background:#f0f0f0;">
            <td colspan="5" style="text-align:center;">Total</td>
            <td style="text-align:right;">${totalUnit}</td>
            <td></td>
            <td style="text-align:right;">${totalTP.toLocaleString("en-IN")}/-</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `;

    const newWindow = window.open();
    const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')]
      .map((s) => s.outerHTML)
      .join("");

    newWindow.document.write(`
      <html>
        <head>
          <title>Depot Stock List - ${today}</title>
          ${styles}
          <style>
            @page { size: A4; margin: 5mm 8mm 3mm 8mm; }
            body { margin:0; font-family:Arial; position:relative; }
            th, td { border:1px solid #000; padding:6px; }
            th { background:#e0e0e0; }
            tr:nth-child(even) { background:#f9f9f9; }
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

  handlePrint();
};

export default PrintDepotStockList;
