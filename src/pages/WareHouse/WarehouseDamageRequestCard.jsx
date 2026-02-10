const WarehouseDamageRequestCard = ({ idx, product }) => {
  return (
    <tr className="text-gray-700">
      <td className="text-center">{idx}</td>
      <td>{product.productName}</td>
      <td className="text-center">{product.batch}</td>
      <td className="text-center">{new Date(product.exp).toLocaleDateString("en-GB")}</td>
      <td className="text-center">{product.stockQuantity}</td>
      <td className="text-center">
        <span className="text-red-500 font-semibold">{product.damageQuantity}</span>
      </td>
      <td className="text-center">{product.remainingQuantity}</td>
      <td className="text-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          onClick={() => alert(JSON.stringify(product, null, 2))}
        >
          Details
        </button>
      </td>
      {/* Removed Approve / Deny buttons */}
      <td className="text-center">—</td>
      <td className="text-center">—</td>
    </tr>
  );
};

export default WarehouseDamageRequestCard;
