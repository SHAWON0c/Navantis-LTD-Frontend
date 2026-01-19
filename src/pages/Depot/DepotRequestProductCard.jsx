import React from "react";

const DepotRequestProductCard = ({ idx, product, refetch, onViewDetails }) => {
  const handleDeny = () => {
    alert(`Deny request for ${product.productName} (Qty: ${product.quantity})`);
    if (refetch) refetch(); // ✅ safe call
  };

  return (
    <tr className="text-gray-700">
      <td className="text-center">{idx}</td>
      <td>{product.productName}</td>
      <td className="text-center">{product.packSize}</td>
      <td className="text-center">egd</td>
      <td className="text-center">{product.quantity}</td>
      <td className="text-center">{new Date(product.createdAt).toLocaleDateString("en-GB")}</td>
      <td className="text-center">{product.requestedBy}</td>
      <td className="text-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          onClick={onViewDetails}
        >
          Details
        </button>
      </td>
      <td className="text-center">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          onClick={handleDeny}
        >
          Deny
        </button>
      </td>
    </tr>
  );
};

export default DepotRequestProductCard;
