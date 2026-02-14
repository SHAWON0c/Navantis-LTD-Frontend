// import React from "react";
// import Swal from "sweetalert2";
// import { useUpdateReceiveMutation } from "../../redux/features/wareHouse/warehouseReceiveApi";

// const WarehouseRequestProductCard = ({ idx, product, refetch }) => {
//   const [updateReceive, { isLoading }] = useUpdateReceiveMutation();

//   console.log(product);

//   // 🔥 Approve / Deny Handler
//   const handleUpdateStatus = async (status) => {
//     const result = await Swal.fire({
//       title: "Warehouse Verification",
//       text: "Are you sure this product is verified and ready to approve?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#16a34a", // pharma green
//       cancelButtonColor: "#dc2626",
//       confirmButtonText: "Yes, Approve",
//       background: "#f0fdf4", // clinical hospital color
//     });

//     if (!result.isConfirmed) return;

//     const payload = {
//       status: status,
//       remarks: "Verified and updated",
//     };

//     try {
//       await updateReceive({
//         receiveId: product.warehouseReceiveId, // ✅ send params
//         data: payload,
//       }).unwrap();

//       Swal.fire("Success", "Product approved successfully!", "success");
//       refetch();
//     } catch (error) {
//       Swal.fire("Error", error?.data?.message || "Update failed", "error");
//     }
//   };

//   return (
//     <tr className="text-gray-700">
//       <td className="text-center">{idx}</td>
//       <td>{product.productName}</td>
//       <td className="text-center">{product.batch}</td>
//       <td className="text-center">
//         {new Date(product.exp).toLocaleDateString("en-GB")}
//       </td>
//       <td className="text-center">{product.orderQuantity}</td>
//       <td className="text-center">{product.stockQuantity}</td>
//       <td className="text-center">{product.missingQuantity}</td>

//       {/* Details Button */}
//       <td className="text-center">
//         <button
//           className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
//           onClick={() =>
//             Swal.fire({
//               title: "Product Details",
//               html: `<pre style="text-align:left">${JSON.stringify(product, null, 2)}</pre>`,
//               width: 600,
//             })
//           }
//         >
//           Details
//         </button>
//       </td>

//       {/* Approve */}
//       <td className="text-center">
//         <button
//           className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//           onClick={() => handleUpdateStatus("approved")}
//           disabled={isLoading}
//         >
//           Approve
//         </button>
//       </td>

//       {/* Deny */}
//       <td className="text-center">
//         <button
//           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//           onClick={() => handleUpdateStatus("denied")}
//           disabled={isLoading}
//         >
//           Deny
//         </button>
//       </td>
//     </tr>
//   );
// };

// export default WarehouseRequestProductCard;



import React from "react";
import Swal from "sweetalert2";
import { useUpdateReceiveMutation, warehouseReceiveAPI } from "../../redux/features/wareHouse/warehouseReceiveApi";

const WarehouseRequestProductCard = ({ idx, product }) => {
  // ✅ Use RTK Mutation
  const [updateReceive, { isLoading }] = useUpdateReceiveMutation();

  // 🔥 Approve / Deny Handler with optimistic cache update
  const handleUpdateStatus = async (status) => {
    const confirm = await Swal.fire({
      title: "Warehouse Verification",
      text: `Are you sure you want to ${status} this product?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: `Yes, ${status}`,
      background: "#f0fdf4",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateReceive({
        receiveId: product.warehouseReceiveId,
        data: { status, remarks: `Status updated to ${status}` },
      }).unwrap();

      Swal.fire("Success", `Product ${status} successfully!`, "success");
      // ✅ Cache update handled automatically by RTK Query
    } catch (err) {
      Swal.fire("Error", err?.data?.message || "Update failed", "error");
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

      {/* Details */}
      <td className="text-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          onClick={() =>
            Swal.fire({
              title: "Product Details",
              html: `<pre style="text-align:left">${JSON.stringify(product, null, 2)}</pre>`,
              width: 600,
            })
          }
        >
          Details
        </button>
      </td>

      {/* Approve */}
      <td className="text-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => handleUpdateStatus("approved")}
          disabled={isLoading}
        >
          Approve
        </button>
      </td>

      {/* Deny */}
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
