
import React from "react";

const DepotProductCard = ({ product, slNo }) => {
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
    <tr className="border-b border-gray-300 hover:bg-gray-50">
      {/* Serial No */}
      <td className="px-4 py-2 text-center">{slNo}</td>

      <td className="px-4 py-2">{product.productName}</td>
      <td className="px-4 py-2 text-center">{packSize}</td>
      <td className="px-4 py-2 text-center">{product.batch}</td>
      <td className="px-4 py-2 text-center">{expiryDate}</td>
       <td className="px-4 py-2 text-center">{totalQuantity}</td>
      <td className="px-4 py-2 text-right">{formatNumber(tradePrice)}</td>
      <td className="px-4 py-2 text-right">{formatNumber(totalPrice)}</td>
      <td className="px-4 py-2 text-center">
        <button className="text-blue-500 hover:underline">Action</button>
      </td>
    </tr>
  );
};

export default DepotProductCard;
