import React from "react";

const WarehouseRequestProductCard = ({ idx, product }) => {
  return (
    <tr className="text-gray-700">
      <td className="text-center">{idx}</td>
      <td>{product.productName}</td>
      <td className="text-center">{product.batch}</td>
      <td className="text-center">{new Date(product.exp).toLocaleDateString("en-GB")}</td>
      <td className="text-center">{product.orderQuantity}</td>
      <td className="text-center">{product.stockQuantity}</td>
      <td className="text-center">{product.missingQuantity}</td>
      <td className="text-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          onClick={() => alert(JSON.stringify(product, null, 2))}
        >
          Details
        </button>
      </td>
      <td className="text-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => alert("Approve clicked for " + product.productName)}
        >
          Approve
        </button>
      </td>
      <td className="text-center">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => alert("Deny clicked for " + product.productName)}
        >
          Deny
        </button>
      </td>
    </tr>
  );
};

export default WarehouseRequestProductCard;
