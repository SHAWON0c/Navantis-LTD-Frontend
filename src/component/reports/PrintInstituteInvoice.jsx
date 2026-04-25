import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import { toast } from "react-toastify";
import {
  useGetInstituteOrderByIdQuery,
  useDeliverInstituteOrderMutation,
} from "../../redux/features/institutes/instituteOrderApi";
import {
  useGetSingleOrderQuery,
  useDeliverOrderMutation,
} from "../../redux/features/orders/orderApi";
import Loader from "../Loader";

const PrintInstituteInvoice = () => {
  const invoiceRef = useRef();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orderType = location.state?.orderType || "institute"; // "customer" or "institute"
  const sourcePage = location.state?.sourcePage;
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // Fetch order data using the query hook (Institute)
  const {
    data: instituteOrderData,
    isLoading: isFetchingInstituteOrder,
    isFetching: isFetchingInstitute,
    error: instituteOrderFetchError,
    refetch: refetchInstitute,
  } = useGetInstituteOrderByIdQuery(orderId, {
    skip: !orderId || orderType !== "institute",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Fetch order data (Customer)
  const {
    data: customerOrderData,
    isLoading: isFetchingCustomerOrder,
    isFetching: isFetchingCustomer,
    error: customerOrderFetchError,
    refetch: refetchCustomer,
  } = useGetSingleOrderQuery(orderId, {
    skip: !orderId || orderType !== "customer",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const isDebugMode = import.meta.env.DEV;

  const order = useMemo(() => {
    let raw = null;
    if (orderType === "institute") {
      raw = instituteOrderData?.data || instituteOrderData;
    } else {
      raw = customerOrderData?.data || customerOrderData;
    }

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
            productShortCode: p?.productShortCode || productDetails?.productShortCode || "-",
            packSize: p?.packSize || productDetails?.packSize || "-",
            tradePrice: safePrice,
            quantity: safeQty,
            selectedBatches: Array.isArray(p?.selectedBatches) ? p.selectedBatches : [],
          };
        })
      : [];

    return {
      ...raw,
      institute: raw.customerId || raw.institute || {},
      products: normalizedProducts,
      previousPendingOrders: raw.previousPendingOrders || [],
      totalPreviousPendingAmount: raw.totalPreviousPendingAmount || 0,
    };
  }, [instituteOrderData, customerOrderData, orderType]);

  const [printed, setPrinted] = useState(false);
  const [deliverInstituteOrder, { isLoading: isDeliveringInstitute }] = useDeliverInstituteOrderMutation();
  const [deliverCustomerOrder, { isLoading: isDeliveringCustomer }] = useDeliverOrderMutation();

  const isLoading = orderType === "institute" ? isDeliveringInstitute : isDeliveringCustomer;

  if (!orderId) {
    return <p className="text-center mt-12">No order ID provided</p>;
  }

  const isFetchingOrder = orderType === "institute" ? isFetchingInstituteOrder : isFetchingCustomerOrder;
  const isFetching = orderType === "institute" ? isFetchingInstitute : isFetchingCustomer;
  const orderFetchError = orderType === "institute" ? instituteOrderFetchError : customerOrderFetchError;
  const refetch = orderType === "institute" ? refetchInstitute : refetchCustomer;

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

    const styleTag = document.getElementById("institute-invoice-style");
    const styleContent = styleTag ? styleTag.innerHTML : "";

    win.document.write(`
      <html>
        <head>
          <title>Institute Invoice</title>
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
      win.focus();
      win.print();
      setPrinted(true);
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

      setTimeout(finishPrint, 1200);
    }
  };

  // ---------------------------
  // DELIVER ORDER LOGIC
  // ---------------------------
  const handleDeliverOrder = async () => {
    if (!order._id) return;

    try {
      if (orderType === "institute") {
        await deliverInstituteOrder(order._id).unwrap();
        toast.success("✅ Institute order marked as delivered successfully!");
        navigate("/depot/order-delivery");
      } else {
        await deliverCustomerOrder(order._id).unwrap();
        toast.success("✅ Customer order marked as delivered successfully!");
        navigate("/depot/order-delivery");
      }
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
  const netPayable = Number(order.totalPayable ?? order.netAmount ?? 0);
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

  const previousOutstanding = Array.isArray(order.previousPendingOrders)
    ? order.previousPendingOrders.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    : Number(order.totalPreviousPendingAmount || 0);

  const totalOutstanding = previousOutstanding + netPayable;

  const institute = order.institute || {};
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
      productShortCode: p.productShortCode || "-",
      productName: p.productName || "-",
      packSize: p.packSize || "-",
      batches,
    };
  });

  return (
    <div style={{ background: "#eee", minHeight: "100vh", padding: 20 }}>
      <style id="institute-invoice-style">{`
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
        @media print { button { display:none; } }
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
            cursor: "pointer",
          }}
        >
          🖨 Print Invoice
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
              cursor: "pointer",
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
              cursor: printed ? "pointer" : "not-allowed",
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

        <div className="invoice-title">
          {orderType === "institute" ? "INSTITUTE INVOICE" : "CUSTOMER INVOICE"}
        </div>

        {/* Institute/Customer Info */}
        <div className="info-box">
          <div>
            {orderType === "institute" ? (
              <>
                <b>Institute ID:</b> {institute.instituteId || order.instituteId || institute._id || "-"} <br />
                <b>Institute Name:</b> {institute.instituteName || "-"} <br />
                <b>Contact Person:</b> {institute.contactPerson || "-"} <br />
                <b>Address:</b> {institute.address || "-"} <br />
                <b>Phone:</b> {institute.mobile || "-"} <br />
                <b>Email:</b> {institute.email || "-"}
              </>
            ) : (
              <>
                <b>Customer Name:</b> {institute.customerName || "-"} <br />
                <b>Customer ID:</b> {institute.customer.instituteId || "-"} <br />
                <b>Address:</b> {institute.address || "-"} <br />
                <b>Phone:</b> {institute.mobile || "-"} <br />
                <b>Email:</b> {institute.email || "-"} <br />
                <b>Territory:</b> {order.territory?.territoryName || "-"}
              </>
            )}
          </div>

          <div>
            <b>Invoice No:</b> {order.invoiceNo || "-"} <br />
            <b>Order Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB") : new Date(order.orderDate).toLocaleDateString("en-GB")} <br />
            <b>Payment Mode:</b> {order.payMode || "-"} <br />
            <b>Payment Status:</b> {order.paymentStatus || "-"} <br />
            <b>Ordered By:</b> {orderType === "institute" ? (institute.instituteName || "-") : (institute.customerName || "-")} <br />
            <b>Assigned Rider:</b> {order.assignedRiderId ? `ID - ${order.assignedRiderId}` : "N/A"}
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
                    <td className="center" rowSpan={product.batches.length}>
                      {productIndex + 1}
                    </td>
                  )}
                  {batchIndex === 0 && (
                    <td rowSpan={product.batches.length}>{product.productShortCode || "-"}</td>
                  )}
                  {batchIndex === 0 && (
                    <td rowSpan={product.batches.length}>{product.productName || "-"}</td>
                  )}
                  {batchIndex === 0 && (
                    <td className="center" rowSpan={product.batches.length}>
                      {product.packSize || "-"}
                    </td>
                  )}
                  <td className="center">{batch.batchNo || "-"}</td>
                  <td className="center">{batch.expireDate || "-"}</td>
                  <td className="right">{(batch.tradePrice || 0).toLocaleString()}</td>
                  <td className="right">{batch.qty || 0}</td>
                  <td className="right">
                    {((batch.tradePrice || 0) * (batch.qty || 0)).toLocaleString()}
                  </td>
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

        {/* Middle Section: Outstanding Summary (LEFT BORDER BOX) and Empty Right */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
          {/* Left: Outstanding Summary - NO BORDER */}
          <div style={{ width: "auto", minWidth: "280px" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "4px", color: "#333" }}>Previous Outstanding</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 6px", borderBottom: "0.5px solid #000" }}>Previous Outstanding</td>
                  <td style={{ padding: "3px 6px", borderBottom: "0.5px solid #000", textAlign: "right" }}>{previousOutstanding.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 6px", borderBottom: "0.5px solid #000" }}>Current Invoice Value</td>
                  <td style={{ padding: "3px 6px", borderBottom: "0.5px solid #000", textAlign: "right" }}>{netPayable.toLocaleString()}</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ padding: "3px 6px", borderTop: "0.5px solid #000" }}>Total Outstanding</td>
                  <td style={{ padding: "3px 6px", borderTop: "0.5px solid #000", textAlign: "right" }}>{totalOutstanding.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Right: Empty Space */}
          <div style={{ flex: 1 }}></div>
        </div>

        {/* Previous Outstanding Invoices Table */}
        {order.previousPendingOrders && Array.isArray(order.previousPendingOrders) && order.previousPendingOrders.length > 0 && (
          <div style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "4px", color: "#333" }}>Previous Outstanding Invoices</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontWeight: "bold", fontSize: "10px" }}>Sl. No.</th>
                  <th style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontWeight: "bold", fontSize: "10px" }}>Date</th>
                  <th style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "left", fontWeight: "bold", fontSize: "10px" }}>Invoice No.</th>
                  <th style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontWeight: "bold", fontSize: "10px" }}>Terms</th>
                  <th style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "right", fontWeight: "bold", fontSize: "10px" }}>Net Outstanding</th>
                  <th style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontWeight: "bold", fontSize: "10px" }}>Aging (Days)</th>
                </tr>
              </thead>
              <tbody>
                {order.previousPendingOrders.map((prevOrder, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontSize: "10px" }}>{idx + 1}</td>
                    <td style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontSize: "10px" }}>
                      {prevOrder.orderDate ? new Date(prevOrder.orderDate).toLocaleDateString("en-GB") : "-"}
                    </td>
                    <td style={{ padding: "3px 4px", border: "1px solid #999", fontSize: "10px" }}>{prevOrder.invoiceNo || "-"}</td>
                    <td style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontSize: "10px" }}>{prevOrder.payMode || "-"}</td>
                    <td style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>{(prevOrder.amount || 0).toLocaleString()}</td>
                    <td style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontSize: "10px" }}>{prevOrder.aging || 0}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan="4" style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>Total</td>
                  <td style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>{(order.totalPreviousPendingAmount || 0).toLocaleString()}</td>
                  <td style={{ padding: "3px 4px", border: "1px solid #999", textAlign: "center", fontSize: "10px" }}>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Signature Area */}
        <div className="signature" style={{ marginTop: "80px" }}>
          <div>Prepared By</div>
          <div>Authorized By</div>
          <div>Institution Stamp</div>
          <div>Received By</div>
        </div>

        {/* Note Section */}
        <div style={{ marginTop: "20px", padding: "10px", border: "0.5px solid #000", backgroundColor: "#fffacd", fontSize: "11px", lineHeight: "1.4" }}>
          <strong>Note:</strong> Please be advised that all purchases are considered final. Once goods have been sold, they are not eligible for return, refund, or exchange under any circumstances, as per our company policy.
        </div>

        {/* Footer */}
        <div style={{ marginTop: "15px", fontSize: "11px", color: "#555", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Print Date & Time: {new Date().toLocaleDateString("en-GB")} at {new Date().toLocaleTimeString("en-GB")}</span>
          <span>Prepared by: {userInfo?.name}</span>
          <span>Printed by: {userInfo?.name}</span>
        </div>

        <div className="footer-info">
          <div>Invoice Generated on: {new Date().toLocaleString()}</div>
          <div>Prepared by: {userInfo?.name || "System"}</div>
        </div>
      </div>
    </div>
  );
};

export default PrintInstituteInvoice;
