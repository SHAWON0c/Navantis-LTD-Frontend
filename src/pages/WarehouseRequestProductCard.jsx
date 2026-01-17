import React from "react";
import { useUpdateReceiveMutation } from "../redux/features/wareHouse/warehouseReceiveApi";

const WarehouseRequestProductCard = ({ idx, product, refetch }) => {
  const [updateReceive, { isLoading }] = useUpdateReceiveMutation();

  const handleUpdateStatus = async (status) => {
    try {
      const payload = {
        purchaseOrderId: product.purchaseOrderId,
        data: {
          status,
          remarks: status === "approved" ? "Verified and updated" : "Denied by user"
        }
      };

      await updateReceive(payload).unwrap();

      alert(`${product.productName} ${status} successfully!`);
      
      // Refetch parent list if needed
      refetch();
    } catch (err) {
      console.error(err);
      alert(`Failed to update status for ${product.productName}`);
    }
  };

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
          onClick={() => handleUpdateStatus("approved")}
          disabled={isLoading}
        >
          Approve
        </button>
      </td>
      <td className="text-center">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => handleUpdateStatus("denied")}
          disabled={isLoading}
        >
          Deny
        </button>
      </td>
    </tr>
  );
};

export default WarehouseRequestProductCard;
