


// const WarehouseProductCard = ({ idx, product, checked, onToggle }) => {
//   // ✅ Pack size from netWeight
//   const packSize = product?.netWeight
//     ? `${product.netWeight.value}${product.netWeight.unit}`
//     : "-";

//   // ✅ Expiry date formatting
//   const expiryDate = product?.expireDate
//     ? new Date(product.expireDate).toLocaleDateString()
//     : "-";

//   // ✅ Use backend values directly
//   const tradePrice = product.tradePrice ?? 0;
//   const totalPrice = product.totalTradePrice ?? 0;

//   // ✅ Format numbers for display
//   const formatNumber = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   return (
//     <tr>
//       <td className="text-center">
//         <input
//           type="checkbox"
//           checked={checked}
//           onChange={onToggle}
//         />
//       </td>

//       <td className="text-center">{idx}</td>

//       <td>{product.productName}</td>

//       {/* Pack Size */}
//       <td>{packSize}</td>

//       <td className="text-center">{product.batch}</td>

//       {/* Exp Date */}
//       <td className="text-center">{expiryDate}</td>

//       <td className="text-center">{product.totalQuantity ?? 0}</td>

//       <td className="text-right">{formatNumber(tradePrice)}</td>

//       <td className="text-right">{formatNumber(totalPrice)}</td>

//       <td className="text-center">—</td>
//     </tr>
//   );
// };

// export default WarehouseProductCard;



import React from "react";

const WarehouseProductCard = ({ idx, product, checked, onToggle }) => {
  // ✅ Pack size
  const packSize = product?.packSize || "-";

  // ✅ Expiry date formatting
  const expiryDate = product?.expireDate
    ? new Date(product.expireDate).toLocaleDateString()
    : "-";

  // ✅ Prices from backend
  const tradePrice = product.tradePrice ?? 0;
  const totalQuantity = product.totalQuantity ?? 0;
  const totalPrice = tradePrice * totalQuantity;

  // ✅ Format numbers for display
  const formatNumber = (num) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <tr>
      <td className="text-center">
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>

      <td className="text-center">{idx}</td>

      <td>{product.productName}</td>

      <td>{packSize}</td>

      <td className="text-center">{product.batch}</td>

      <td className="text-center">{expiryDate}</td>

      <td className="text-center">{totalQuantity}</td>

      <td className="text-right">{formatNumber(tradePrice)}</td>

      <td className="text-right">{formatNumber(totalPrice)}</td>

      <td className="text-center">—</td>
    </tr>
  );
};

export default WarehouseProductCard;
