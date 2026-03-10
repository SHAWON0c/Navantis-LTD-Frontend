import React, { useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import Loader from "../../../component/Loader";
import Select from "react-select";

import {
  useGetBrandsQuery,
  useGetProductsByBrandQuery,
} from "../../../redux/features/products/productsApi";

import {
  useGetCustomersByStatusQuery,
} from "../../../redux/features/customer/customerApi";

import { useCreateOrderMutation } from "../../../redux/features/orders/orderApi";
import { skipToken } from "@reduxjs/toolkit/query/react";

const PlaceOrder = () => {

  const { loading: authLoading } = useAuth();
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customerName: "",
    customerId: "",
    payMode: "",
    brand: "",
  });

  const [selectedAddress, setSelectedAddress] = useState("");

  // ================= API =================

  const { data: brandsData = [], isLoading: brandsLoading } =
    useGetBrandsQuery();

  const { data: productsData = {}, isLoading: productsLoading } =
    useGetProductsByBrandQuery(formData.brand || skipToken);

  const { data: customersData = {}, isLoading: customersLoading } =
    useGetCustomersByStatusQuery("active");

  const brands = brandsData;
  const apiProducts = productsData.products || [];
  const customers = customersData.data || [];

  // ================= CUSTOMER =================

  const selectedCustomer = customers.find(
    (c) => c._id === formData.customerId
  );

  const discountPercent = selectedCustomer?.discount || 0;
  const discountDecimal = discountPercent / 100;

  // ================= TOTAL =================

  const totalAmount = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

  const discount = totalAmount * discountDecimal;
  const grandTotal = totalAmount - discount;

  // ================= ADD PRODUCT =================

  const handleAddProduct = (product) => {

    const exist = products.find((p) => p.productId === product.productId);

    if (exist) {
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { ...product, key: Date.now(), quantity: 1 },
      ]);
    }
  };

  // ================= REMOVE PRODUCT =================

  const removeProduct = (key) => {
    setProducts(products.filter((p) => p.key !== key));
  };

  // ================= CHANGE QTY =================

  const changeQty = (key, qty) => {

    setProducts((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, quantity: Number(qty) } : p
      )
    );

  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {

    if (!products.length) return alert("Add product first");

    if (!formData.customerId) return alert("Select customer");

    const payload = {
      customerId: formData.customerId,
      payMode: formData.payMode,
      products: products.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
      })),
    };

    try {

      await createOrder(payload).unwrap();

      alert("Order placed successfully");

      setProducts([]);

    } catch (err) {

      console.log(err);
      alert("Order failed");

    }

  };

  if (authLoading || brandsLoading || customersLoading)
    return <Loader />;

  return (

    <div className="w-full min-h-screen bg-gray-100 flex flex-col lg:flex-row">

      {/* LEFT PANEL */}

      <div className="w-full lg:w-[320px] bg-white border-r p-4 space-y-4">

        <div className="text-gray-500 text-sm font-semibold">
          NPL / Admin / Purchase Order
        </div>

        {/* CUSTOMER */}

        <div>

          <label className="text-xs text-gray-500">CUSTOMER</label>

          <Select
            placeholder="Search customer..."
            options={customers.map((c) => ({
              value: c._id,
              label: `${c.customerName} - ${c.customerId}`,
            }))}
            onChange={(option) => {

              const customer = customers.find(
                (c) => c._id === option.value
              );

              setFormData((prev) => ({
                ...prev,
                customerName: `${customer.customerName} - ${customer.customerId}`,
                customerId: customer._id,
              }));

              setSelectedAddress(customer.address);

            }}
          />

          <p className="text-xs text-gray-500">{selectedAddress}</p>

        </div>

        {/* PAYMENT */}

        <div>

          <label className="text-xs text-gray-500">PAYMENT MODE</label>

          <select
            className="w-full border rounded p-2"
            value={formData.payMode}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                payMode: e.target.value,
              }))
            }
          >

            <option value="">Select mode</option>

            {selectedCustomer?.payMode?.map((p) => (
              <option key={p}>{p}</option>
            ))}

          </select>

        </div>

        {/* BRAND */}

        <div>

          <label className="text-xs text-gray-500">BRAND</label>

          <select
            className="w-full border rounded p-2"
            value={formData.brand}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                brand: e.target.value,
              }))
            }
          >

            <option value="">Filter brands...</option>

            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}

          </select>

        </div>

        {/* AVAILABLE PRODUCTS (Desktop only) */}

        <div className="hidden lg:block">

          <label className="text-xs text-gray-500">
            AVAILABLE — {formData.brand}
          </label>

          <div className="border rounded mt-2 max-h-96 overflow-y-auto">

            {productsLoading && (
              <p className="p-2 text-sm">Loading...</p>
            )}

            {apiProducts.map((p) => (

              <div
                key={p._id}
                className="p-2 border-b hover:bg-blue-50 cursor-pointer flex justify-between"
                onClick={() =>
                  handleAddProduct({
                    product: p.productName,
                    productId: p._id,
                    price: p.tradePrice,
                  })
                }
              >

                <div>

                  <div className="text-sm font-medium">
                    {p.productShortCode}
                  </div>

                  <div className="text-xs text-gray-500">
                    {p.productName}
                  </div>

                </div>

                <div className="text-sm font-semibold">
                  ৳{p.tradePrice}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 flex flex-col bg-white">

        <div className="p-4 overflow-auto">

          <table className="w-full text-sm">

            <thead className="border-b text-gray-500">

              <tr>

                <th className="text-left py-2">PRODUCT</th>
                <th className="text-center">QTY</th>
                <th className="text-right">PRICE (৳)</th>
                <th></th>

              </tr>

            </thead>

            <tbody>

              {products.length === 0 && (

                <tr>

                  <td colSpan="4" className="text-center py-8 text-gray-400">

                    Select a brand and click products to add them here.

                  </td>

                </tr>

              )}

              {products.map((p) => (

                <tr key={p.key} className="border-b">

                  <td className="py-3">

                    <div className="font-medium">{p.product}</div>

                  </td>

                  <td className="text-center">

                    <input
                      type="number"
                      value={p.quantity}
                      className="w-14 border text-center rounded"
                      onChange={(e) =>
                        changeQty(p.key, e.target.value)
                      }
                    />

                  </td>

                  <td className="text-right">

                    ৳{(p.price * p.quantity).toFixed(2)}

                  </td>

                  <td className="text-center">

                    <button
                      onClick={() => removeProduct(p.key)}
                      className="text-red-500"
                    >
                      ✕
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* TOTAL */}

        <div className="border-t p-4 space-y-2 bg-gray-50">

          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span>৳{totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600 text-sm">
            <span>Discount ({discountPercent}%)</span>
            <span>-৳{discount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Grand Total</span>
            <span>৳{grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={creating}
            className="w-full bg-blue-700 text-white py-3 rounded"
          >

            {creating ? "Placing Order..." : "Place Order"}

          </button>

        </div>

      </div>

    </div>

  );
};

export default PlaceOrder;