import React, { useState } from "react";
import Loader from "../Loader";

const ProductSelectModal = ({ open, onClose, onAdd, products = [], loading }) => {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});

  if (!open) return null;
  if (loading) return <Loader />;

  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  const handleQtyChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleConfirm = () => {
    const selected = filteredProducts
      .filter((p) => quantities[p._id] > 0)
      .map((p) => ({
        product: p.productName,
        productId: p._id, 
        productCode: p.productShortCode,
        netWeight: p.packSize,
        price: p.tradePrice,
        quantity: Number(quantities[p._id]),
      }));

    if (!selected.length) return alert("Add quantity first");

    selected.forEach((p) => onAdd(p));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-center mb-3">Select Products</h3>
        <input
          type="text"
          placeholder="🔍 Search by product name..."
          className="w-full border border-gray-300 rounded p-2 mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="max-h-80 overflow-y-auto border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border p-2 text-left">Product Name</th>
                <th className="border p-2">Net Weight</th>
                <th className="border p-2">Trade Price (৳)</th>
                <th className="border p-2">Order Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50">
                  <td className="border p-2">
                    <div className="font-medium">{p.productName}</div>
                    <div className="text-xs text-gray-500">Code: {p.productShortCode}</div>
                  </td>
                  <td className="border p-2 text-center">{p.packSize}</td>
                  <td className="border p-2 text-center">{p.tradePrice.toFixed(2)}</td>
                  <td className="border p-2 text-center">
                    <input
                      type="number"
                      min="0"
                      className="w-20 border rounded p-1 text-center"
                      placeholder="Qty"
                      value={quantities[p._id] || ""}
                      onChange={(e) => handleQtyChange(p._id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectModal;
