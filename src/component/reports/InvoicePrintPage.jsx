

"use client";
import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../provider/AuthProvider";
import { useDeliverOrderMutation, useGetSingleOrderQuery } from "../../redux/features/orders/orderApi";
import Loader from "../Loader";

const InvoiceViewPage = () => {
  const invoiceRef = useRef();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const sourcePage = location.state?.sourcePage;
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // Fetch order data using the query hook
  const {
    data: orderData,
    isLoading: isFetchingOrder,
    isFetching,
    error: orderFetchError,
    refetch,
  } = useGetSingleOrderQuery(orderId, {
    skip: !orderId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const isDebugMode = import.meta.env.DEV;

  const order = useMemo(() => {
    const raw = orderData?.data || orderData;
    if (!raw) return null;

    const normalizedProducts = Array.isArray(raw.products)
      ? raw.products.map((p) => {
          const productDetails = p?.productId && typeof p.productId === "object" ? p.productId : {};
          const safePrice = Number(p?.tradePrice ?? p?.price ?? productDetails?.tradePrice ?? 0);
          const safeQty = Number(p?.quantity ?? 0);

          return {
            productId:
              typeof p?.productId === "string"
                ? p.productId
                : productDetails?._id || "-",
            productName: p?.productName || productDetails?.productName || "-",
            productShortCode: p?.productShortCode || "-",
            packSize: p?.packSize || productDetails?.packSize || "-",
            tradePrice: safePrice,
            quantity: safeQty,
            selectedBatches: Array.isArray(p?.selectedBatches) ? p.selectedBatches : [],
          };
        })
      : [];

    return {
      ...raw,
      customer: raw.customer || raw.customerId || {},
      mpo: raw.mpo || raw.mpoId || {},
      territory: raw.territory || raw.territoryId || {},
      zone: raw.zone || raw.zoneId || {},
      assignedRider: raw.assignedRider || raw.assignedRiderId || {},
      products: normalizedProducts,
      previousPendingOrders: raw.previousPendingOrders || [],
      totalPreviousPendingAmount: raw.totalPreviousPendingAmount || 0,
    };
  }, [orderData]);

  const [printed, setPrinted] = useState(false);
  const [deliverOrder, { isLoading }] = useDeliverOrderMutation();

  if (!orderId) {
    return <p className="text-center mt-12">No order ID provided</p>;
  }

  if (isFetchingOrder) {
    return <Loader />;
  }

  if (orderFetchError) {
    return (
      <div className="text-center mt-12">
        <p className="text-red-600 mb-3">Failed to load invoice data from server.</p>
        <button
          onClick={refetch}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Retry
        </button>
        {isDebugMode && (
          <pre className="mt-4 text-left text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(orderFetchError, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  if (!order) {
    return <p className="text-center mt-12">No invoice data available</p>;
  }

  // ---------------------------
  // PRINT LOGIC
  // ---------------------------
  const handlePrint = () => {
    if (!invoiceRef.current) {
      toast.error("❌ Invoice content is not ready to print.");
      return;
    }

    const content = invoiceRef.current.innerHTML;
    const win = window.open("", "", "width=1000,height=900");

    if (!win) {
      toast.error("❌ Popup blocked. Please allow popups for this site and try again.");
      return;
    }

    const styleTag = document.getElementById("invoice-style");
    const styleContent = styleTag ? styleTag.innerHTML : "";

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            ${styleContent}
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.focus();

    // Wait for images to load
    const images = win.document.images;
    let loaded = 0;
    let printedOnce = false;

    const finishPrint = () => {
      if (printedOnce) return;
      printedOnce = true;
      // Do not auto-close here; some browsers close before showing print dialog.
      win.focus();
      win.print();
      setPrinted(true); // mark invoice as printed
    };

    if (images.length === 0) {
      finishPrint();
    } else {
      for (let i = 0; i < images.length; i++) {
        if (images[i].complete) {
          loaded++;
          if (loaded === images.length) finishPrint();
          continue;
        }

        images[i].onload = images[i].onerror = () => {
          loaded++;
          if (loaded === images.length) finishPrint();
        };
      }

      // Fallback: print anyway if an image event never fires
      setTimeout(finishPrint, 1200);
    }
  };

  // ---------------------------
  // DELIVER ORDER LOGIC
  // ---------------------------
  const handleDeliverOrder = async () => {
    if (!order._id) return;

    try {
      await deliverOrder(order._id).unwrap();
      toast.success("✅ Order marked as delivered successfully!");
      navigate("/depot/order-delivery");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to deliver the order.");
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    if (sourcePage === "invoice-payment") {
      navigate("/depot/invoice-payment");
      return;
    }

    navigate("/depot/order-delivery");
  };

  // ---------------------------
  // CALCULATIONS
  // ---------------------------
  const grossTradePrice = Number(order.totalAmount || 0);
  const netPayable = Number(order.totalPayable ?? 0);
  const tradeDiscount = Number(order.customerDiscount ?? 0);
  const isAlreadyDelivered = String(order.orderStatus || "").toLowerCase() === "delivered";
  const showBackButton = sourcePage === "invoice-payment" || isAlreadyDelivered;

  // Number to Words Function
  const numberToWords = (num) => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Lakh", "Crore"];

    const convertToWords = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertToWords(n % 100) : "");
    };

    if (num === 0) return "Zero Taka Only";
    const taka = Math.floor(num);
    const paisa = Math.round((num - taka) * 100);

    let result = "";
    let scaleIndex = 0;

    let crore = Math.floor(taka / 10000000);
    let lakh = Math.floor((taka % 10000000) / 100000);
    let thousand = Math.floor((taka % 100000) / 1000);
    let remainder = taka % 1000;

    if (crore > 0) result += convertToWords(crore) + " Crore ";
    if (lakh > 0) result += convertToWords(lakh) + " Lakh ";
    if (thousand > 0) result += convertToWords(thousand) + " Thousand ";
    if (remainder > 0) result += convertToWords(remainder);

    result = result.trim();
    if (paisa > 0) result += " and " + paisa + " Paisa";
    return result + " Taka Only";
  };

  const amountInWords = numberToWords(netPayable);

  // Calculate previous outstanding from previousPendingOrders
  const previousOutstanding = Array.isArray(order.previousPendingOrders)
    ? order.previousPendingOrders.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    : 0;

  const totalOutstanding = previousOutstanding + netPayable;

  const customer = order.customer || {};
  const assignedRider = order?.assignedRider?.riderName
    ? `${order.assignedRider.riderName} - ${order.assignedRider.riderId || ""}`
    : order?.assignedRiderId
    ? `ID - ${order.assignedRiderId}`
    : "N/A";

  const mpoName = order.mpo?.mpoName || "N/A";
  const mpoPhone = order.mpo?.mpoPhone || "N/A";

  const logoUrl = "/images/NPL-Updated-Logo.png";

  const productGroups = (order.products || []).map((p) => {
    const tradePrice = Number(p.tradePrice || 0);
    const selectedBatches = Array.isArray(p.selectedBatches) ? p.selectedBatches : [];

    const batches =
      selectedBatches.length > 0
        ? selectedBatches.map((b) => ({
            batchNo: b?.batchNo || "-",
            expireDate: b?.expireDate ? new Date(b.expireDate).toLocaleDateString("en-GB") : "-",
            qty: Number(b?.quantity || 0),
            tradePrice,
          }))
        : [
            {
              batchNo: "-",
              expireDate: "-",
              qty: Number(p.quantity || 0),
              tradePrice,
            },
          ];

    return {
      productId: p.productId || "-",
      productName: p.productName || "-",
      productShortCode: p.productShortCode || "-",
      packSize: p.packSize || "-",
      batches,
    };
  });

  return (
    <div style={{ background: "#eee", minHeight: "100vh", padding: 20 }}>
      <style id="invoice-style">{`
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; color: #333; margin: 20px; }
        .container { width: 100%; background:#fff; padding:25px; }
        .invoice-header { display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid #000; padding-bottom:8px; margin-bottom:15px; }
        .invoice-header img { width:150px; }
        .company-info { text-align:right; font-size:11px; }
        .company-name { font-size:20px; font-weight:bold; }
        .invoice-title { text-align:center; font-size:18px; font-weight:700; color:#2E86C1; margin:20px 0 10px; border-bottom:0.5px solid #000; }
        .info-box { display:flex; justify-content:space-between; border:0.5px solid #000; padding:12px; margin-bottom:20px; border-radius:4px; }
        .info-box div { width:48%; }
        .previous-dues-box { margin-bottom:20px; border:0.5px solid #000; border-radius:4px; padding:12px; background-color:#f9f9f9; }
        .previous-dues-title { font-size:14px; font-weight:700; color:#2E86C1; margin-bottom:10px; padding-bottom:8px; border-bottom:0.5px solid #000; }
        .previous-dues-table { width:100%; border-collapse:collapse; font-size:12px; }
        .previous-dues-table thead { background-color:#e8f4f8; }
        .previous-dues-table th { border:0.5px solid #000; padding:6px 8px; text-align:left; font-weight:600; }
        .previous-dues-table td { border:0.5px solid #000; padding:6px 8px; }
        .previous-dues-table .amount { text-align:right; }
        .previous-dues-table .days { text-align:center; }
        .previous-dues-table .total-row { background-color:#f1f1f1; font-weight:600; }
        table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:15px; }
        th,td { border:0.5px solid #000; padding:6px 8px; }
        th { background:#f7f7f7; text-align:center; }
        .product-table { font-size:11px; margin: 0; padding: 0; }
        .product-table th, .product-table td { padding:4px 6px; }
        tr:nth-child(even){ background:#fafafa; }
        .right { text-align:right; }
        .center { text-align:center; }
        .totals-row td { background:#f1f1f1; font-weight:600; }
        .signature { display:flex; justify-content:space-between; margin-top:50px; }
        .signature div { width:22%; text-align:center; border-top:0.5px solid #000; padding-top:5px; font-weight:600; }
        .footer-info { display:flex; justify-content:space-between; font-size:10px; color:#555; margin-top:15px; }
        @media print { 
          * { margin: 0; padding: 0; }
          body { margin: 0 !important; padding: 0 !important; }
          html { height: 100%; }
          body { height: 100%; }
          .container { 
            position: relative !important;
            min-height: 100vh !important; 
            height: 100vh !important;
            display: block !important;
            page-break-after: always; 
            padding-bottom: 160px !important;
          }
          button { display:none !important; }
          #invoice-spacing { display: none !important; }
          #invoice-footer-section { 
            position: absolute !important; 
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            padding: 20px 25px !important;
            background: white !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* Buttons */}
      <div style={{ marginBottom: 15, display: "flex", gap: 12 }}>
        <button
          onClick={handlePrint}
          style={{
            background: "#2E86C1",
            color: "#fff",
            padding: "10px 16px",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          Print Invoice
        </button>

        {showBackButton ? (
          <button
            onClick={handleBack}
            style={{
              background: "#6c757d",
              color: "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: 5,
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
        ) : (
          <button
            onClick={handleDeliverOrder}
            disabled={!printed || isLoading}
            style={{
              background: printed ? "#28a745" : "#ccc",
              color: "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: 5,
              cursor: printed ? "pointer" : "not-allowed"
            }}
          >
            ✅ Deliver Order
          </button>
        )}
      </div>

      {/* Invoice Content */}
      <div
        ref={invoiceRef}
        className="container"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }}
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

        {/* Product Table with Slim Black Borders */}
        <table className="product-table" style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderTop: "0.5px solid #000", borderBottom: "0.5px solid #000", marginBottom: "12px", margin: "0", padding: "0", width: "100%", boxSizing: "border-box", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Short Code</th>
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
            {productGroups.map((product, productIndex) =>
              product.batches.map((batch, batchIndex) => (
                <tr key={`${product.productId}-${batch.batchNo}-${productIndex}-${batchIndex}`}>
                  {batchIndex === 0 && (
                    <td className="center" rowSpan={product.batches.length}>{productIndex + 1}</td>
                  )}
                  {batchIndex === 0 && (
                    <td rowSpan={product.batches.length}>{product.productShortCode || "-"}</td>
                  )}
                  {batchIndex === 0 && (
                    <td rowSpan={product.batches.length}>{product.productName || "-"}</td>
                  )}
                  {batchIndex === 0 && (
                    <td className="center" rowSpan={product.batches.length}>{product.packSize || "-"}</td>
                  )}
                  <td className="center">{batch.batchNo || "-"}</td>
                  <td className="center">{batch.expireDate || "-"}</td>
                  <td className="right">{(batch.tradePrice || 0).toLocaleString()}</td>
                  <td className="right">{batch.qty || 0}</td>
                  <td className="right">{((batch.tradePrice || 0) * (batch.qty || 0)).toLocaleString()}</td>
                </tr>
              ))
            )}
            {/* Summary Rows with Amount in Words on Left, Calculations on Right */}
            <tr style={{ borderTop: "0.5px solid #000", fontWeight: "600" }}>
              <td colSpan="5" rowSpan="4" style={{ textAlign: "left", padding: "8px 8px", verticalAlign: "middle", fontSize: "12px", borderRight: "0.5px solid #000" }}>
                <b>Amount in Words:</b> <br /> {amountInWords}
              </td>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px", borderRight: "0.5px solid #000" }}>Total Trade Price:</td>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px" }}>{grossTradePrice.toLocaleString()}</td>
            </tr>
            <tr style={{ fontWeight: "600" }}>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px", borderRight: "0.5px solid #000" }}>Less Discount:</td>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px" }}>{tradeDiscount > 0 ? tradeDiscount.toLocaleString() : "0"}</td>
            </tr>
            <tr style={{ fontWeight: "600" }}>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px", borderRight: "0.5px solid #000" }}>VAT:</td>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px" }}>0</td>
            </tr>
            <tr style={{ background: "#f1f1f1", fontWeight: "600", borderBottom: "0.5px solid #000" }}>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px", borderRight: "0.5px solid #000" }}>Net Payable Amount:</td>
              <td colSpan="2" style={{ textAlign: "right", padding: "4px 8px" }}>{netPayable.toLocaleString()}</td>
            </tr>
            
          </tbody>
        </table>

        {/* Previous Outstanding Summary */}
        {order.previousPendingOrders && Array.isArray(order.previousPendingOrders) && order.previousPendingOrders.length > 0 && (
          <div style={{ marginTop: "8px", marginBottom: "8px" }}>
            <table style={{ width: "350px", borderCollapse: "collapse", fontSize: "11px", border: "1px solid #000" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid #000" }}>
                  <td style={{ padding: "5px", fontWeight: "bold", width: "70%" }}>Previous Outstanding</td>
                  <td style={{ padding: "5px", textAlign: "right", borderLeft: "1px solid #000", fontWeight: "bold" }}>{previousOutstanding.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #000" }}>
                  <td style={{ padding: "5px", fontWeight: "bold" }}>Current Invoice Value</td>
                  <td style={{ padding: "5px", textAlign: "right", borderLeft: "1px solid #000", fontWeight: "bold" }}>{netPayable.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #000" }}>
                  <td style={{ padding: "5px", fontWeight: "bold" }}>Total Outstanding</td>
                  <td style={{ padding: "5px", textAlign: "right", borderLeft: "1px solid #000", fontWeight: "bold" }}>{totalOutstanding.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Previous Outstanding Invoices Table */}
        {order.previousPendingOrders && Array.isArray(order.previousPendingOrders) && order.previousPendingOrders.length > 0 && (
          <div style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>Previous Outstanding Invoices</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", border: "1px solid #000" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontWeight: "bold" }}>Sl. No.</th>
                  <th style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontWeight: "bold" }}>Date</th>
                  <th style={{ padding: "4px", border: "1px solid #000", textAlign: "left", fontWeight: "bold" }}>Invoice No.</th>
                  <th style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontWeight: "bold" }}>Terms</th>
                  <th style={{ padding: "4px", border: "1px solid #000", textAlign: "right", fontWeight: "bold" }}>Net Outstanding</th>
                  <th style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontWeight: "bold" }}>Aging (Days)</th>
                </tr>
              </thead>
              <tbody>
                {order.previousPendingOrders.map((prevOrder, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontSize: "10px" }}>{idx + 1}</td>
                    <td style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontSize: "10px" }}>
                      {prevOrder.orderDate ? new Date(prevOrder.orderDate).toLocaleDateString("en-GB") : "-"}
                    </td>
                    <td style={{ padding: "4px", border: "1px solid #000", textAlign: "left", fontSize: "10px" }}>{prevOrder.invoiceNo || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontSize: "10px" }}>{prevOrder.payMode || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #000", textAlign: "right", fontSize: "10px" }}>{(prevOrder.amount || 0).toLocaleString()}</td>
                    <td style={{ padding: "4px", border: "1px solid #000", textAlign: "center", fontSize: "10px" }}>{prevOrder.aging || 0}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                  <td colSpan="5" style={{ padding: "4px", border: "1px solid #000", textAlign: "right" }}>Total</td>
                  <td style={{ padding: "4px", border: "1px solid #000", textAlign: "right", fontSize: "10px" }}>{(order.totalPreviousPendingAmount || 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Spacing - Flex spacer to push footer to bottom */}
        <div id="invoice-spacing" style={{ flex: 1 }}></div>

        {/* Footer Section - Pushed to Bottom */}
        <div id="invoice-footer-section">
          {/* Signature Section */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ textAlign: "center", width: "22%" }}>
              <div style={{ borderTop: "1px solid #000", paddingTop: "8px", fontSize: "12px", fontWeight: "600" }}>Customer</div>
            </div>
            <div style={{ textAlign: "center", width: "22%" }}>
              <div style={{ borderTop: "1px solid #000", paddingTop: "8px", fontSize: "12px", fontWeight: "600" }}>Depot In-charge</div>
            </div>
            <div style={{ textAlign: "center", width: "22%" }}>
              <div style={{ borderTop: "1px solid #000", paddingTop: "8px", fontSize: "12px", fontWeight: "600" }}>Accounts</div>
            </div>
            <div style={{ textAlign: "center", width: "22%" }}>
              <div style={{ borderTop: "1px solid #000", paddingTop: "8px", fontSize: "12px", fontWeight: "600" }}>Authorized by</div>
            </div>
          </div>

          {/* Note */}
          <div style={{ fontSize: "11px", marginBottom: "12px", lineHeight: "1.4", border: "1px solid #000", padding: "8px", borderRadius: "2px" }}>
            <strong>Note:</strong> Please be advised that all purchases are considered final. Once goods have been sold, they are not eligible for return, refund, or exchange under any circumstances, as per our company policy.
          </div>

          {/* Footer Info */}
          <div style={{ fontSize: "10px", paddingTop: "8px" }}>
            <span>Print Date & Time: {new Date().toLocaleString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            <span style={{ marginLeft: "20px" }}>Printed by: {userInfo?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewPage;