import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import { toast } from "react-toastify";
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

import { useGetInstitutesByStatusQuery } from "../../../redux/features/institutes/instituteApi";
import { useCreateInstituteOrderMutation } from "../../../redux/features/institutes/instituteOrderApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

const PlaceInstituteOrder = () => {
  const { loading: authLoading } = useAuth();
  const [createInstituteOrder, { isLoading: creating }] = useCreateInstituteOrderMutation();
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const holdTimerRef = useRef(null);
  const addFeedbackTimerRef = useRef(null);
  const holdTriggeredRef = useRef(false);
  const holdTargetIdRef = useRef(null);
  const [recentlyAddedProductId, setRecentlyAddedProductId] = useState("");
  const [addFeedbackMessage, setAddFeedbackMessage] = useState("");

  const [formData, setFormData] = useState({
    instituteName: "",
    instituteId: "",
    payMode: "",
    brand: "",
  });

  const [selectedInstitute, setSelectedInstitute] = useState(null);

  const clearAddFeedbackTimer = () => {
    if (addFeedbackTimerRef.current) {
      clearTimeout(addFeedbackTimerRef.current);
      addFeedbackTimerRef.current = null;
    }
  };

  const triggerAddFeedback = (productId, productName) => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([14, 18, 14]);
    }

    setRecentlyAddedProductId(productId);
    setAddFeedbackMessage(`${productName} added to order`);

    clearAddFeedbackTimer();
    addFeedbackTimerRef.current = setTimeout(() => {
      setRecentlyAddedProductId("");
      addFeedbackTimerRef.current = null;
    }, 700);
  };

  // ================= API =================
  const { data: brandsData = [], isLoading: brandsLoading } = useGetBrandsQuery();
  const { data: productsData = {}, isLoading: productsLoading } =
    useGetProductsByBrandQuery(formData.brand || skipToken);
  const { data: institutesData = {}, isLoading: institutesLoading } =
    useGetInstitutesByStatusQuery("active");

  const brands = brandsData;
  const apiProducts = productsData.products || [];
  const institutes = institutesData.data || [];

  const formatWithPackSize = (text, packSize) => {
    const safeText = text || "";
    return packSize ? `${safeText}-${packSize}` : safeText;
  };

  const filteredProducts = apiProducts.filter((product) => {
    const searchValue = productSearch.trim().toLowerCase();

    if (!searchValue) return true;

    return (
      product.productName?.toLowerCase().includes(searchValue) ||
      product.productShortCode?.toLowerCase().includes(searchValue)
    );
  });

  // ================= INSTITUTE =================
  const discountPercent = selectedInstitute?.discount || 0;
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

  const handleAddProductTap = (product) => {
    handleAddProduct(product);
    triggerAddFeedback(product.productId, product.product);
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
    if (!products.length) {
      toast.error("Add product first");
      return;
    }
    if (!formData.instituteId) {
      toast.error("Select institute");
      return;
    }

    const payload = {
      customerId: formData.instituteId,
      payMode: formData.payMode || "credit",
      products: products.map((p) => ({ productId: p.productId, quantity: p.quantity })),
    };

    try {
      await createInstituteOrder(payload).unwrap();
      toast.success("Institute order placed successfully!");
      setProducts([]);
      setFormData({ instituteName: "", instituteId: "", payMode: "", brand: "" });
      setSelectedInstitute(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  useEffect(
    () => () => {
      clearHoldTimer();
      clearAddFeedbackTimer();
    },
    []
  );

  if (authLoading || brandsLoading || institutesLoading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-gray-100 md:p-6">
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="small"
              icon={MdArrowBack}
              onClick={() => window.history.back()}
              className="ml-2"
            >
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>INSTITUTES</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PLACE ORDER</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products: <span className="font-bold">{products.length}</span>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* LEFT PANEL */}
        <div className="lg:col-span-3 space-y-6">
          <Card shadow="md" padding="md">
            <div className="text-lg font-semibold mb-4">Order Details</div>

            <FormSelect
              label="Institute"
              value={formData.instituteId}
              onChange={(e) => {
                const institute = institutes.find((i) => i._id === e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  instituteName: institute
                    ? `${institute.instituteName} - ${institute.tradeLicense}`
                    : "",
                  instituteId: institute ? institute._id : "",
                }));
                setSelectedInstitute(institute || null);
              }}
              options={institutes.map((i) => ({
                value: i._id,
                label: `${i.instituteName} - ${i.tradeLicense}`,
              }))}
              placeholder="Select institute"
            />

            {selectedInstitute && (
              <div className="text-sm bg-gray-50 p-3 rounded mt-3">
                <div className="font-medium">{selectedInstitute.instituteName}</div>
                <div className="text-gray-500 text-xs">{selectedInstitute.address}</div>
                <div className="text-xs mt-1">Phone: {selectedInstitute.mobile}</div>
                <div className="text-xs">Discount: {discountPercent}%</div>
              </div>
            )}

            <FormSelect
              label="Payment Mode"
              value={formData.payMode}
              onChange={(e) => setFormData((prev) => ({ ...prev, payMode: e.target.value }))}
              options={selectedInstitute?.payMode?.map((p) => ({ value: p, label: p })) || [
                { value: "credit", label: "Credit" },
              ]}
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
          <Card shadow="sm" padding="sm">
            <div className="text-sm font-semibold mb-3">Products</div>
            <div className="sr-only" aria-live="polite">
              {addFeedbackMessage}
            </div>
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
                <div className="text-sm text-gray-500 p-2">
                  {formData.brand
                    ? "No products match your search."
                    : "Select a brand to see products."}
                </div>
              )}
              {filteredProducts.map((p) => {
                const isJustAdded = recentlyAddedProductId === p._id;

                return (
                  <div
                    key={p._id}
                    className="border-b p-2 flex justify-between items-center hover:bg-blue-50"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {formatWithPackSize(p.productShortCode, p.packSize)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatWithPackSize(p.productName, p.packSize)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-blue-600 font-semibold">Rs. {p.tradePrice}</div>
                      <button
                        type="button"
                        className={`text-xs px-2.5 py-1 rounded font-medium transition-all duration-200 active:scale-95 ${
                          isJustAdded
                            ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        onClick={() =>
                          handleAddProductTap({
                            productId: p._id,
                            product: p.productName,
                            productShortCode: p.productShortCode,
                            packSize: p.packSize,
                            price: p.tradePrice,
                          })
                        }
                      >
                        {isJustAdded ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-9 space-y-6">
          {/* PRODUCT TABLE */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Selected Products</h3>
            {products.length === 0 && (
              <div className="text-gray-500 text-center py-6">
                No products added yet. Select products from the left panel.
              </div>
            )}
            <ul className="space-y-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between border p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {formatWithPackSize(p.productShortCode, p.packSize)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatWithPackSize(p.product, p.packSize)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Qty:</span>
                      <input
                        type="number"
                        value={p.quantity}
                        min={1}
                        onChange={(e) => changeQty(p.id, e.target.value)}
                        className="w-16 text-center border border-gray-300 rounded p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <span className="text-sm font-semibold min-w-[80px] text-right">
                      Rs. {(p.price * p.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onPointerDown={() => startRemoveHold(p.id)}
                      onPointerUp={() => finishRemoveHold(p.id)}
                      onPointerLeave={cancelRemoveHold}
                      onPointerCancel={cancelRemoveHold}
                      className="font-bold px-3 py-1 rounded transition-colors select-none text-red-500 hover:bg-red-50 text-sm"
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gross Total:</span>
                <span className="font-semibold">Rs. {totalAmount.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount ({discountPercent}%):</span>
                  <span className="font-semibold text-red-600">
                    - Rs. {discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-lg">Grand Total:</span>
                <span className="font-bold text-lg text-blue-600">
                  Rs. {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={creating || !formData.instituteId || products.length === 0}
              loading={creating}
              variant="primary"
              size="large"
              className="w-full mt-6"
            >
              {creating ? "Placing Order..." : "Place Institute Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceInstituteOrder;
