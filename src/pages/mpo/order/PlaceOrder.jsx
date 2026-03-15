// import React, { useState } from "react";
// import { useAuth } from "../../../provider/AuthProvider";
// import Loader from "../../../component/Loader";
// import Button from "../../../component/common/Button";
// import FormInput from "../../../component/common/FormInput";
// import FormSelect from "../../../component/common/FormSelect";
// import UniversalSummaryPanel from "../../../component/common/UniversalSummaryPanel";
// import Card from "../../../component/common/Card";
// import Table from "../../../component/common/Table";

// import {
//   useGetBrandsQuery,
//   useGetProductsByBrandQuery,
// } from "../../../redux/features/products/productsApi";

// import {
//   useGetCustomersByStatusQuery,
// } from "../../../redux/features/customer/customerApi";

// import { useCreateOrderMutation } from "../../../redux/features/orders/orderApi";
// import { skipToken } from "@reduxjs/toolkit/query/react";

// const PlaceOrder = () => {

//   const { loading: authLoading } = useAuth();
//   const [createOrder, { isLoading: creating }] = useCreateOrderMutation();

//   const [products, setProducts] = useState([]);

//   const [formData, setFormData] = useState({
//     customerName: "",
//     customerId: "",
//     payMode: "",
//     brand: "",
//   });

//   const [selectedAddress, setSelectedAddress] = useState("");

//   // ================= API =================

//   const { data: brandsData = [], isLoading: brandsLoading } =
//     useGetBrandsQuery();

//   const { data: productsData = {}, isLoading: productsLoading } =
//     useGetProductsByBrandQuery(formData.brand || skipToken);

//   const { data: customersData = {}, isLoading: customersLoading } =
//     useGetCustomersByStatusQuery("active");

//   const brands = brandsData;
//   const apiProducts = productsData.products || [];
//   const customers = customersData.data || [];

//   // ================= CUSTOMER =================

//   const selectedCustomer = customers.find(
//     (c) => c._id === formData.customerId
//   );

//   const discountPercent = selectedCustomer?.discount || 0;
//   const discountDecimal = discountPercent / 100;

//   // ================= TOTAL =================

//   const totalAmount = products.reduce(
//     (acc, p) => acc + p.price * p.quantity,
//     0
//   );

//   const discount = totalAmount * discountDecimal;
//   const grandTotal = totalAmount - discount;

//   // ================= ADD PRODUCT =================

//   const handleAddProduct = (product) => {

//     const exist = products.find((p) => p.productId === product.productId);

//     if (exist) {
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.productId === product.productId
//             ? { ...p, quantity: p.quantity + 1 }
//             : p
//         )
//       );
//     } else {
//       setProducts((prev) => [
//         ...prev,
//         { ...product, key: Date.now(), quantity: 1 },
//       ]);
//     }
//   };

//   // ================= REMOVE PRODUCT =================

//   const removeProduct = (key) => {
//     setProducts(products.filter((p) => p.key !== key));
//   };

//   // ================= CHANGE QTY =================

//   const changeQty = (key, qty) => {

//     setProducts((prev) =>
//       prev.map((p) =>
//         p.key === key ? { ...p, quantity: Number(qty) } : p
//       )
//     );

//   };

//   // ================= SUBMIT =================

//   const handleSubmit = async () => {

//     if (!products.length) return alert("Add product first");

//     if (!formData.customerId) return alert("Select customer");

//     const payload = {
//       customerId: formData.customerId,
//       payMode: formData.payMode,
//       products: products.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {

//       await createOrder(payload).unwrap();

//       alert("Order placed successfully");

//       setProducts([]);

//     } catch (err) {

//       console.log(err);
//       alert("Order failed");

//     }

//   };

//   if (authLoading || brandsLoading || customersLoading)
//     return <Loader />;

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex flex-col lg:flex-row">
//       {/* LEFT PANEL */}
//       <div className="w-full lg:w-[340px] bg-white border-r p-6 space-y-6">
//         <div className="text-gray-500 text-sm font-semibold mb-2">NPL / Admin / Purchase Order</div>
//         <Card shadow="md" padding="md" className="space-y-4">
//           <FormSelect
//             label="Customer"
//             value={formData.customerId}
//             onChange={(e) => {
//               const customer = customers.find((c) => c._id === e.target.value);
//               setFormData((prev) => ({
//                 ...prev,
//                 customerName: customer ? `${customer.customerName} - ${customer.customerId}` : "",
//                 customerId: customer ? customer._id : "",
//               }));
//               setSelectedAddress(customer?.address || "");
//             }}
//             options={customers.map((c) => ({
//               value: c._id,
//               label: `${c.customerName} - ${c.customerId}`,
//             }))}
//             placeholder="Select customer"
//             required
//           />
//           {selectedAddress && <div className="text-xs text-gray-500">{selectedAddress}</div>}
//           <FormSelect
//             label="Payment Mode"
//             value={formData.payMode}
//             onChange={(e) => setFormData((prev) => ({ ...prev, payMode: e.target.value }))}
//             options={selectedCustomer?.payMode?.map((p) => ({ value: p, label: p })) || []}
//             placeholder="Select mode"
//             required
//           />
//           <FormSelect
//             label="Brand"
//             value={formData.brand}
//             onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
//             options={brands.map((b) => ({ value: b, label: b }))}
//             placeholder="Filter brands..."
//             required
//           />
//         </Card>
//         {/* Available Products (Desktop only) */}
//         <Card shadow="sm" padding="sm" className="hidden lg:block">
//           <div className="text-xs text-gray-500 mb-2">Available — {formData.brand}</div>
//           <div className="max-h-96 overflow-y-auto">
//             {productsLoading && <Loader size={30} color="#2563eb" />}
//             {apiProducts.map((p) => (
//               <div
//                 key={p._id}
//                 className="p-2 border-b hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-all duration-150"
//                 onClick={() => handleAddProduct({ product: p.productName, productId: p._id, price: p.tradePrice })}
//               >
//                 <div>
//                   <div className="text-sm font-medium">{p.productShortCode}</div>
//                   <div className="text-xs text-gray-500">{p.productName}</div>
//                 </div>
//                 <div className="text-sm font-semibold text-blue-700">৳{p.tradePrice}</div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>
//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex flex-col bg-white">
//         <div className="p-6 overflow-auto">
//           <Card shadow="md" padding="md">
//             <Table
//               columns={[{ Header: "Product", accessor: "product" }, { Header: "Qty", accessor: "quantity" }, { Header: "Price (৳)", accessor: "price" }, { Header: "", accessor: "action" }]}
//               data={products.map((p) => ({
//                 product: <div className="font-medium">{p.product}</div>,
//                 quantity: <FormInput type="number" value={p.quantity} onChange={(e) => changeQty(p.key, e.target.value)} size="sm" className="w-16 text-center" min={1} />,
//                 price: <div className="text-right">৳{(p.price * p.quantity).toFixed(2)}</div>,
//                 action: <Button variant="outline" size="small" onClick={() => removeProduct(p.key)} className="text-red-500">✕</Button>,
//                 key: p.key,
//               }))}
//               emptyMessage="Select a brand and click products to add them here."
//               size="md"
//               striped
//               hover
//             />
//           </Card>
//         </div>
//         {/* Summary Panel */}
//         <div className="border-t p-6 bg-gray-50">
//           <UniversalSummaryPanel
//             totals={{
//               "Total": `৳${totalAmount.toFixed(2)}`,
//               [`Discount (${discountPercent}%)`]: `-৳${discount.toFixed(2)}`,
//               "Grand Total": `৳${grandTotal.toFixed(2)}`,
//             }}
//           />
//           <Button
//             onClick={handleSubmit}
//             disabled={creating}
//             loading={creating}
//             variant="primary"
//             size="large"
//             className="w-full mt-4"
//           >
//             {creating ? "Placing Order..." : "Place Order"}
//           </Button>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default PlaceOrder;




// ui okey 
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import Loader from "../../../component/Loader";
import Button from "../../../component/common/Button";
import FormInput from "../../../component/common/FormInput";
import FormSelect from "../../../component/common/FormSelect";
import Card from "../../../component/common/Card";
import Table from "../../../component/common/Table";

import {
  useGetBrandsQuery,
  useGetProductsByBrandQuery,
} from "../../../redux/features/products/productsApi";

import { useGetCustomersByStatusQuery } from "../../../redux/features/customer/customerApi";
import { useCreateOrderMutation } from "../../../redux/features/orders/orderApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

const PlaceOrder = () => {
  const { loading: authLoading } = useAuth();
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const holdTimerRef = useRef(null);
  const holdTriggeredRef = useRef(false);
  const holdTargetIdRef = useRef(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerId: "",
    payMode: "",
    brand: "",
  });

  const [selectedAddress, setSelectedAddress] = useState("");

  // ================= API =================
  const { data: brandsData = [], isLoading: brandsLoading } = useGetBrandsQuery();
  const { data: productsData = {}, isLoading: productsLoading } =
    useGetProductsByBrandQuery(formData.brand || skipToken);
  const { data: customersData = {}, isLoading: customersLoading } =
    useGetCustomersByStatusQuery("active");

  const brands = brandsData;
  const apiProducts = productsData.products || [];
  const customers = customersData.data || [];
  const filteredProducts = apiProducts.filter((product) => {
    const searchValue = productSearch.trim().toLowerCase();

    if (!searchValue) return true;

    return (
      product.productName?.toLowerCase().includes(searchValue) ||
      product.productShortCode?.toLowerCase().includes(searchValue)
    );
  });

  // ================= CUSTOMER =================
  const selectedCustomer = customers.find((c) => c._id === formData.customerId);
  const discountPercent = selectedCustomer?.discount || 0;
  const discountDecimal = discountPercent / 100;

  // ================= TOTAL =================
  const totalAmount = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
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
        { ...product, id: product.productId, quantity: 1 },
      ]);
    }
  };

  // ================= REMOVE PRODUCT =================
  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const decrementProductQuantity = (id) => {
    setProducts((prev) =>
      prev.reduce((accumulator, product) => {
        if (product.id !== id) {
          accumulator.push(product);
          return accumulator;
        }

        if (product.quantity > 1) {
          accumulator.push({ ...product, quantity: product.quantity - 1 });
        }

        return accumulator;
      }, [])
    );
  };

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const startRemoveHold = (id) => {
    clearHoldTimer();
    holdTriggeredRef.current = false;
    holdTargetIdRef.current = id;

    holdTimerRef.current = setTimeout(() => {
      holdTriggeredRef.current = true;
      removeProduct(id);
      holdTargetIdRef.current = null;
      holdTimerRef.current = null;
    }, 1000);
  };

  const finishRemoveHold = (id) => {
    if (holdTargetIdRef.current !== id) return;

    const wasLongPress = holdTriggeredRef.current;

    clearHoldTimer();
    holdTargetIdRef.current = null;
    holdTriggeredRef.current = false;

    if (!wasLongPress) {
      decrementProductQuantity(id);
    }
  };

  const cancelRemoveHold = () => {
    clearHoldTimer();
    holdTargetIdRef.current = null;
    holdTriggeredRef.current = false;
  };

  // ================= CHANGE QTY =================
  const changeQty = (id, qty) => {
    if (qty < 1) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Number(qty) } : p))
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!products.length) return alert("Add product first");
    if (!formData.customerId) return alert("Select customer");

    const payload = {
      customerId: formData.customerId,
      payMode: formData.payMode,
      products: products.map((p) => ({ productId: p.productId, quantity: p.quantity })),
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

  useEffect(() => () => clearHoldTimer(), []);

  if (authLoading || brandsLoading || customersLoading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-gray-100 md:p-6 ">

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>MPO</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PLACE ORDER</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products:
          </div>
        </div>
      </Card>
      <div className="grid lg:grid-cols-12 gap-6">

        {/* LEFT PANEL */}
        <div className="lg:col-span-3 space-y-6">
          <Card shadow="md" padding="md">
            <div className="text-lg font-semibold mb-4">Order Details</div>

            <FormSelect
              label="Customer"
              value={formData.customerId}
              onChange={(e) => {
                const customer = customers.find((c) => c._id === e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  customerName: customer
                    ? `${customer.customerName} - ${customer.customerId}`
                    : "",
                  customerId: customer ? customer._id : "",
                }));
                setSelectedAddress(customer?.address || "");
              }}
              options={customers.map((c) => ({
                value: c._id,
                label: `${c.customerName} - ${c.customerId}`,
              }))}
              placeholder="Select customer"
            />

            {selectedCustomer && (
              <div className="text-sm bg-gray-50 p-3 rounded mt-3">
                <div className="font-medium">{selectedCustomer.customerName}</div>
                <div className="text-gray-500 text-xs">{selectedAddress}</div>
                <div className="text-xs mt-1">Discount: {discountPercent}%</div>
              </div>
            )}

            <FormSelect
              label="Payment Mode"
              value={formData.payMode}
              onChange={(e) => setFormData((prev) => ({ ...prev, payMode: e.target.value }))}
              options={selectedCustomer?.payMode?.map((p) => ({ value: p, label: p })) || []}
              placeholder="Select mode"
            />

            <FormSelect
              label="Brand"
              value={formData.brand}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, brand: e.target.value }));
                setProductSearch("");
              }}
              options={brands.map((b) => ({ value: b, label: b }))}
              placeholder="Select brand"
            />
          </Card>

          {/* PRODUCT LIST */}
          {/* <Card shadow="sm" padding="sm">
            <div className="text-sm font-semibold mb-3">Products ({formData.brand})</div>
            <div className="max-h-96 overflow-y-auto">
              {productsLoading && <Loader />}
              {apiProducts.map((p) => (
                <div
                  key={p._id}
                  className="border-b p-2 cursor-pointer hover:bg-blue-50 flex justify-between"
                  onClick={() =>
                    handleAddProduct({ productId: p._id, product: p.productName, price: p.tradePrice })
                  }
                >
                  <div>
                    <div className="text-sm font-medium">{p.productShortCode}</div>
                    <div className="text-xs text-gray-500">{p.productName}</div>
                  </div>
                  <div className="text-blue-600 font-semibold">৳{p.tradePrice}</div>
                </div>
              ))}
            </div>
          </Card> */}

          <Card shadow="sm" padding="sm">
            <div className="text-sm font-semibold mb-3">Products ({formData.brand})</div>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search by product name or shortcode"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="max-h-96 overflow-y-auto">
              {productsLoading && <Loader />}
              {!productsLoading && filteredProducts.length === 0 && (
                <div className="text-sm text-gray-500 p-2">No products match your search.</div>
              )}
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="border-b p-2 flex justify-between items-center hover:bg-blue-50"
                >
                  <div>
                    <div className="text-sm font-medium">{p.productShortCode}</div>
                    <div className="text-xs text-gray-500">{p.productName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-blue-600 font-semibold">৳{p.tradePrice}</div>
                    <button
                      type="button"
                      className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                      onClick={() =>
                        handleAddProduct({ productId: p._id, product: p.productName, price: p.tradePrice })
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-9 space-y-6">

          {/* PRODUCT TABLE */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Selected Products</h3>
            {products.length === 0 && <div className="text-gray-500">No products added yet</div>}
            <ul className="space-y-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between border p-2 rounded hover:bg-gray-50"
                >
                  <div>{p.product}</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={p.quantity}
                      min={1}
                      onChange={(e) => changeQty(p.id, e.target.value)}
                      className="w-16 text-center border rounded p-1"
                    />
                    <span>৳{(p.price * p.quantity).toFixed(2)}</span>
                    <button
                      type="button"
                      onPointerDown={() => startRemoveHold(p.id)}
                      onPointerUp={() => finishRemoveHold(p.id)}
                      onPointerLeave={cancelRemoveHold}
                      onPointerCancel={cancelRemoveHold}
                      className="font-bold px-3 py-1 rounded transition-colors select-none text-red-500 hover:bg-red-50"
                      title="Click to reduce 1 quantity. Hold 1 second to remove the whole product."
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* INVOICE SUMMARY */}
          <Card shadow="lg" padding="md">
            <div className="text-lg font-semibold mb-4">Invoice Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total</span>
                <span>৳{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount ({discountPercent}%)</span>
                <span>- ৳{discount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span>৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              loading={creating}
              className="w-full mt-6"
              size="large"
            >
              {creating ? "Placing Order..." : "Place Order"}
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;