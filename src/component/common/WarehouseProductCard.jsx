import React from "react";

const WarehouseProductCard = ({ idx, product, checked, onToggle }) => {
  const packSize = product?.packSize || "-";
  const expiryDate = product?.expireDate
    ? new Date(product.expireDate).toLocaleDateString()
    : "-";

  const tradePrice = product.tradePrice ?? 0;
  const totalQuantity = product.totalQuantity ?? 0;
  const totalPrice = tradePrice * totalQuantity;

  const formatNumber = (num) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
      {/* Checkbox */}
      <td className="text-center px-4 py-2">
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>

      {/* Serial Number */}
      <td className="text-center px-4 py-2">{idx}</td>

      {/* Product Name */}
      <td className="px-4 py-2">{product.productName}</td>

      {/* Pack Size */}
      <td className="text-center px-4 py-2">{packSize}</td>

      {/* Batch */}
      <td className="text-center px-4 py-2">{product.batch}</td>

      {/* Expiry */}
      <td className="text-center px-4 py-2">{expiryDate}</td>

      {/* Quantity */}
      <td className="text-center px-4 py-2">{totalQuantity}</td>

      {/* Price/Unit */}
      <td className="text-right px-4 py-2">{formatNumber(tradePrice)}</td>

      {/* Total Price */}
      <td className="text-right px-4 py-2">{formatNumber(totalPrice)}</td>

      {/* Action */}
      <td className="text-center px-4 py-2">
        <button className="text-blue-500 hover:underline">Action</button>
      </td>
    </tr>
  );
};

export default WarehouseProductCard;
