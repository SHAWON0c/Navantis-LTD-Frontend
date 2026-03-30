

"use client";
import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import { useDeliverOrderMutation, useGetSingleOrderQuery } from "../../redux/features/orders/orderApi";
import Loader from "../Loader";

const InvoiceViewPage = () => {
  const invoiceRef = useRef();
  const location = useLocation();
  const orderId = location.state?.orderId;
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
      alert("Invoice content is not ready to print.");
      return;
    }

    const content = invoiceRef.current.innerHTML;
    const win = window.open("", "", "width=1000,height=900");

    if (!win) {
      alert("Popup blocked. Please allow popups for this site and try again.");
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
      alert("Order marked as delivered successfully!");
            navigate("/depot/order-delivery");
    } catch (error) {
      console.error(error);
      alert("Failed to deliver the order.");
    }
  };

  // ---------------------------
  // CALCULATIONS
  // ---------------------------
  const grossTradePrice = Number(order.totalAmount || 0);
  const tradeDiscount = Number(order.customerDiscount || 0);
  const netPayable = Number(order.totalPayable || order.netAmount || 0);

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
      packSize: p.packSize || "-",
      batches,
    };
  });

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
        .product-table { font-size:11px; margin-bottom:10px; }
        .product-table th, .product-table td { padding:4px 6px; }
        tr:nth-child(even){ background:#fafafa; }
        .right { text-align:right; }
        .center { text-align:center; }
        .totals-row td { background:#f1f1f1; font-weight:600; }
        .signature { display:flex; justify-content:space-between; margin-top:50px; }
        .signature div { width:22%; text-align:center; border-top:1px solid #333; padding-top:5px; font-weight:600; }
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
            cursor: "pointer"
          }}
        >
          🖨 Print Invoice
        </button>

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
        <table className="product-table">
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
            {productGroups.map((product, productIndex) =>
              product.batches.map((batch, batchIndex) => (
                <tr key={`${product.productId}-${batch.batchNo}-${productIndex}-${batchIndex}`}>
                  {batchIndex === 0 && (
                    <td className="center" rowSpan={product.batches.length}>{productIndex + 1}</td>
                  )}
                  {batchIndex === 0 && (
                    <td rowSpan={product.batches.length}>{product.productId || "-"}</td>
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
          </tbody>
        </table>

        {isDebugMode && (
          <details style={{ marginTop: 16 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              Debug Payload {isFetching ? "(refreshing...)" : ""}
            </summary>
            <pre style={{ fontSize: 11, background: "#f7f7f7", padding: 12, overflow: "auto" }}>
              {JSON.stringify(orderData, null, 2)}
            </pre>
          </details>
        )}

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