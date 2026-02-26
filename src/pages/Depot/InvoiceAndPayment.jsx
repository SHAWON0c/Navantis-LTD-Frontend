// // import React, { useState } from "react";
// // import { Button, Modal, Table, Input, message, Spin, Select } from "antd";
// // import axios from "axios";
// // import {
// //   useGetOrderStatusInfoQuery,
// //   useLazySearchOrderQuery,
// // } from "../../redux/features/orders/orderApi";

// // const { Option } = Select;

// // const InvoiceAndPayment = () => {
// //   const [visibleModal, setVisibleModal] = useState(false);
// //   const [modalTitle, setModalTitle] = useState("pending");
// //   const [quickPayModal, setQuickPayModal] = useState(false);
// //   const [invoiceInput, setInvoiceInput] = useState("");
// //   const [searchDataState, setSearchDataState] = useState(null);

// //   // RTK Query lazy search for Quick Pay
// //   const [triggerSearch, { isLoading: isSearchLoading }] =
// //     useLazySearchOrderQuery();

// //   // Fetch order status
// //   const {
// //     data: statusData,
// //     isLoading: isStatusLoading,
// //     refetch: refetchStatus,
// //   } = useGetOrderStatusInfoQuery(modalTitle.toLowerCase(), {
// //     skip: !modalTitle || modalTitle === "Quick Pay",
// //   });

// //   // Table columns
// //   const columns = [
// //     { title: "SL No", key: "serial", render: (_, __, index) => index + 1, width: 80 },
// //     { title: "Invoice", dataIndex: "invoiceNo" },
// //     { title: "Order Date", dataIndex: "orderDate", render: (text) => new Date(text).toLocaleDateString() },
// //     { title: "Total Payable", dataIndex: "totalPayable" },
// //   ];

// //   const getFilteredData = () => statusData?.data || [];

// //   const openModal = (title) => {
// //     setModalTitle(title);
// //     setVisibleModal(true);
// //   };

// //   // Quick Pay search
// //   const handleQuickPaySearch = async () => {
// //     if (!invoiceInput) return message.error("Please enter an invoice number");

// //     try {
// //       const result = await triggerSearch(invoiceInput).unwrap();
// //       if (result.success) {
// //         setSearchDataState({
// //           ...result.data,
// //           paymentType: "",
// //           cashAmount: 0,
// //           bankInfo: { bankName: "", accountNumber: "", amount: 0 },
// //           chequeInfo: { chequeAmount: 0, bankName: "", chequeNumber: "", tdsAmount: 0, chalanNumber: "" },
// //           bftnInfo: { beftnAmount: 0, bankName: "", accountNumber: "", tdsAmount: 0, chalanNumber: "" },
// //         });
// //         setQuickPayModal(true);
// //       } else {
// //         message.error(result.message || "Invoice not found");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       message.error("Invoice not found");
// //     }
// //   };

// //   // Payment type options based on payMode
// //   const getPaymentTypeOptions = () => {
// //     if (!searchDataState) return [];
// //     const { payMode } = searchDataState;
// //     if (["cash", "stc", "spic"].includes(payMode)) return ["cash", "bank", "cash_bank"];
// //     if (payMode === "credit") return ["cheque", "bftn"];
// //     return [];
// //   };

// //   // Submit payment
// // const handlePaymentSubmit = async () => {
// //   if (!searchDataState) return;

// //   const { payMode, paymentType, totalPayable, cashAmount, bankInfo, chequeInfo, bftnInfo } = searchDataState;

// //   let payload = {
// //     payMode,
// //     paymentType,
// //     totalAmount: totalPayable,
// //   };

// //   // Customize payload based on paymentType
// //   if (paymentType === "cash") {
// //     payload.cashAmount = cashAmount || totalPayable;
// //   } else if (paymentType === "bank") {
// //     payload.bankInfo = {
// //       bankName: bankInfo.bankName,
// //       accountNumber: bankInfo.accountNumber,
// //       amount: bankInfo.amount,
// //     };
// //   } else if (paymentType === "cash_bank") {
// //     payload.cashAmount = cashAmount || 0;
// //     payload.bankInfo = {
// //       bankName: bankInfo.bankName,
// //       accountNumber: bankInfo.accountNumber,
// //       amount: bankInfo.amount,
// //     };
// //   } else if (paymentType === "cheque") {
// //     payload.chequeInfo = {
// //       chequeAmount: chequeInfo.chequeAmount,
// //       bankName: chequeInfo.bankName,
// //       chequeNumber: chequeInfo.chequeNumber,
// //       tdsAmount: chequeInfo.tdsAmount,
// //       chalanNumber: chequeInfo.chalanNumber,
// //     };
// //   } else if (paymentType === "bftn") {
// //     payload.bftnInfo = {
// //       bftnAmount: bftnInfo.bftnAmount,
// //       bankName: bftnInfo.bankName,
// //       accountNumber: bftnInfo.accountNumber,
// //       tdsAmount: bftnInfo.tdsAmount,
// //       chalanNumber: bftnInfo.chalanNumber,
// //     };
// //   }

// //   try {
// //     const response = await fetch(`http://localhost:5000/api/payments/${searchDataState._id}`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(payload),
// //     });

// //     const data = await response.json();

// //     if (data.success) {
// //       message.success("Payment recorded successfully!");
// //       setQuickPayModal(false);
// //       setSearchDataState(null);
// //     } else {
// //       message.error(data.message || "Payment failed");
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     message.error("Server error, please try again");
// //   }
// // };

// //   return (
// //     <div className="flex min-h-screen bg-gray-50 p-6 gap-6">
// //       {/* LEFT TABLE */}
// //       <div className="flex-1">
// //         <h2 className="text-2xl font-bold mb-6">{modalTitle.toUpperCase()} Orders</h2>
// //         {isStatusLoading ? (
// //           <div className="flex justify-center py-10">
// //             <Spin size="large" />
// //           </div>
// //         ) : (
// //           <Table columns={columns} dataSource={getFilteredData()} rowKey="invoiceNo" pagination={{ pageSize: 8 }} />
// //         )}
// //       </div>

// //       {/* RIGHT SIDEBAR */}
// //       <div className="w-56 bg-white rounded-xl shadow p-4 flex flex-col gap-3 mt-20">
// //         {["Delivered", "pending", "Outstanding", "Paid", "Returned"].map((btn) => (
// //           <Button key={btn} type={modalTitle === btn ? "primary" : "default"} onClick={() => openModal(btn)}>
// //             {btn.toUpperCase()}
// //           </Button>
// //         ))}
// //         <Button type="primary" onClick={() => setQuickPayModal(true)}>
// //           Quick Pay
// //         </Button>
// //       </div>

// //       {/* QUICK PAY MODAL */}
// //       <Modal title="Quick Pay" open={quickPayModal} onCancel={() => setQuickPayModal(false)} footer={null} width={600}>
// //         <div className="flex gap-3 mb-6">
// //           <Input
// //             placeholder="Enter Invoice No"
// //             value={invoiceInput}
// //             onChange={(e) => setInvoiceInput(e.target.value)}
// //           />
// //           <Button type="primary" onClick={handleQuickPaySearch} loading={isSearchLoading}>
// //             Search
// //           </Button>
// //         </div>

// //         {searchDataState && (
// //           <div className="flex flex-col gap-3">
// //             <Input value={searchDataState.payMode} disabled placeholder="Pay Mode" />

// //             <Select
// //               placeholder="Select Payment Type"
// //               value={searchDataState.paymentType}
// //               onChange={(value) =>
// //                 setSearchDataState((prev) => ({
// //                   ...prev,
// //                   paymentType: value,
// //                 }))
// //               }
// //             >
// //               {getPaymentTypeOptions().map((type) => (
// //                 <Option key={type} value={type}>
// //                   {type.toUpperCase()}
// //                 </Option>
// //               ))}
// //             </Select>

// //             <Input value={searchDataState.totalPayable} disabled placeholder="Total Amount" />

// //             {/* CASH/STC/SPIC */}
// //             {["cash", "stc", "spic"].includes(searchDataState.payMode) && (
// //               <>
// //                 {searchDataState.paymentType === "cash" && (
// //                   <Input
// //                     type="number"
// //                     placeholder="Cash Amount"
// //                     value={searchDataState.cashAmount}
// //                     onChange={(e) =>
// //                       setSearchDataState((prev) => ({ ...prev, cashAmount: Number(e.target.value) }))
// //                     }
// //                   />
// //                 )}

// //                 {["bank", "cash_bank"].includes(searchDataState.paymentType) && (
// //                   <>
// //                     {searchDataState.paymentType === "cash_bank" && (
// //                       <Input
// //                         type="number"
// //                         placeholder="Cash Amount"
// //                         value={searchDataState.cashAmount}
// //                         onChange={(e) =>
// //                           setSearchDataState((prev) => ({ ...prev, cashAmount: Number(e.target.value) }))
// //                         }
// //                       />
// //                     )}

// //                     <Select
// //                       placeholder="Select Bank"
// //                       value={searchDataState.bankInfo.bankName}
// //                       onChange={(value) =>
// //                         setSearchDataState((prev) => ({ ...prev, bankInfo: { ...prev.bankInfo, bankName: value } }))
// //                       }
// //                     >
// //                       <Option value="Bank of America">Bank of America</Option>
// //                       <Option value="Chase">Chase</Option>
// //                       <Option value="Wells Fargo">Wells Fargo</Option>
// //                     </Select>

// //                     <Input
// //                       placeholder="Account Number"
// //                       value={searchDataState.bankInfo.accountNumber}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           bankInfo: { ...prev.bankInfo, accountNumber: e.target.value },
// //                         }))
// //                       }
// //                     />

// //                     <Input
// //                       type="number"
// //                       placeholder="Bank Amount"
// //                       value={searchDataState.bankInfo.amount}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           bankInfo: { ...prev.bankInfo, amount: Number(e.target.value) },
// //                         }))
// //                       }
// //                     />
// //                   </>
// //                 )}
// //               </>
// //             )}

// //             {/* CREDIT */}
// //             {searchDataState.payMode === "credit" && (
// //               <>
// //                 {searchDataState.paymentType === "cheque" && (
// //                   <>
// //                     <Input
// //                       type="number"
// //                       placeholder="Cheque Amount"
// //                       value={searchDataState.chequeInfo.chequeAmount}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           chequeInfo: { ...prev.chequeInfo, chequeAmount: Number(e.target.value) },
// //                         }))
// //                       }
// //                     />
// //                     <Select
// //                       placeholder="Select Bank"
// //                       value={searchDataState.chequeInfo.bankName}
// //                       onChange={(value) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           chequeInfo: { ...prev.chequeInfo, bankName: value },
// //                         }))
// //                       }
// //                     >
// //                       <Option value="Bank of America">Bank of America</Option>
// //                       <Option value="Chase">Chase</Option>
// //                       <Option value="Wells Fargo">Wells Fargo</Option>
// //                     </Select>
// //                     <Input
// //                       placeholder="Cheque Number"
// //                       value={searchDataState.chequeInfo.chequeNumber}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           chequeInfo: { ...prev.chequeInfo, chequeNumber: e.target.value },
// //                         }))
// //                       }
// //                     />
// //                     <Input
// //                       type="number"
// //                       placeholder="TDS Amount"
// //                       value={searchDataState.chequeInfo.tdsAmount}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           chequeInfo: { ...prev.chequeInfo, tdsAmount: Number(e.target.value) },
// //                         }))
// //                       }
// //                     />
// //                     <Input
// //                       placeholder="Chalan Number"
// //                       value={searchDataState.chequeInfo.chalanNumber}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           chequeInfo: { ...prev.chequeInfo, chalanNumber: e.target.value },
// //                         }))
// //                       }
// //                     />
// //                   </>
// //                 )}

// //                 {searchDataState.paymentType === "bftn" && (
// //                   <>
// //                     <Input
// //                       type="number"
// //                       placeholder="BFTN Amount"
// //                       value={searchDataState.bftnInfo.bftnAmount}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           bftnInfo: { ...prev.bftnInfo, bftnAmount: Number(e.target.value) },
// //                         }))
// //                       }
// //                     />
// //                     <Select
// //                       placeholder="Select Bank"
// //                       value={searchDataState.bftnInfo.bankName}
// //                       onChange={(value) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           bftnInfo: { ...prev.bftnInfo, bankName: value },
// //                         }))
// //                       }
// //                     >
// //                       <Option value="Bank of America">Bank of America</Option>
// //                       <Option value="Chase">Chase</Option>
// //                       <Option value="Wells Fargo">Wells Fargo</Option>
// //                     </Select>
// //                     <Input
// //                       placeholder="Account Number"
// //                       value={searchDataState.bftnInfo.accountNumber}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           bftnInfo: { ...prev.bftnInfo, accountNumber: e.target.value },
// //                         }))
// //                       }
// //                     />
// //                     <Input
// //                       type="number"
// //                       placeholder="TDS Amount"
// //                       value={searchDataState.bftnInfo.tdsAmount}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           bftnInfo: { ...prev.bftnInfo, tdsAmount: Number(e.target.value) },
// //                         }))
// //                       }
// //                     />
// //                     <Input
// //                       placeholder="Chalan Number"
// //                       value={searchDataState.bftnInfo.chalanNumber}
// //                       onChange={(e) =>
// //                         setSearchDataState((prev) => ({
// //                           ...prev,
// //                           bftnInfo: { ...prev.bftnInfo, chalanNumber: e.target.value },
// //                         }))
// //                       }
// //                     />
// //                   </>
// //                 )}
// //               </>
// //             )}

// //             <Button type="primary" onClick={handlePaymentSubmit}>
// //               Submit Payment
// //             </Button>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default InvoiceAndPayment;


// import React, { useState } from "react";
// import { Button, Modal, Table, Input, message, Spin, Select } from "antd";
// import {
//   useGetOrderStatusInfoQuery,
//   useLazySearchOrderQuery,
// } from "../../redux/features/orders/orderApi";

// const { Option } = Select;

// /* ---------------------- PaymentInputs ---------------------- */
// const PaymentInputs = ({ data, setData }) => {
//   if (!data) return null;

//   const handleChange = (field, value, subField) => {
//     if (subField) {
//       setData((prev) => ({ ...prev, [field]: { ...prev[field], [subField]: value } }));
//     } else {
//       setData((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const getPaymentTypeOptions = () => {
//     const { payMode } = data;
//     if (["cash", "stc", "spic"].includes(payMode)) return ["cash", "bank", "cash_bank"];
//     if (payMode === "credit") return ["cheque", "bftn"];
//     return [];
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <div>
//         <label className="font-semibold text-gray-700">Pay Mode</label>
//         <Input value={data.payMode} disabled className="mt-1" />
//       </div>

//       <div>
//         <label className="font-semibold text-gray-700">Payment Type</label>
//         <Select
//           placeholder="Select Payment Type"
//           value={data.paymentType}
//           onChange={(value) => handleChange("paymentType", value)}
//           className="mt-1 w-full"
//         >
//           {getPaymentTypeOptions().map((type) => (
//             <Option key={type} value={type}>
//               {type.toUpperCase()}
//             </Option>
//           ))}
//         </Select>
//       </div>

//       <div>
//         <label className="font-semibold text-gray-700">Total Amount</label>
//         <Input value={data.totalPayable} disabled className="mt-1" />
//       </div>

//       {/* CASH/STC/SPIC */}
//       {["cash", "stc", "spic"].includes(data.payMode) && (
//         <>
//           {(data.paymentType === "cash" || data.paymentType === "cash_bank") && (
//             <div>
//               <label className="font-semibold text-gray-700">Cash Amount</label>
//               <Input
//                 type="number"
//                 value={data.cashAmount}
//                 onChange={(e) => handleChange("cashAmount", Number(e.target.value))}
//                 className="mt-1"
//               />
//             </div>
//           )}

//           {["bank", "cash_bank"].includes(data.paymentType) && (
//             <>
//               <div>
//                 <label className="font-semibold text-gray-700">Select Bank</label>
//                 <Select
//                   placeholder="Select Bank"
//                   value={data.bankInfo.bankName}
//                   onChange={(value) => handleChange("bankInfo", value, "bankName")}
//                   className="mt-1 w-full"
//                 >
//                   <Option value="Bank of America">Bank of America</Option>
//                   <Option value="Chase">Chase</Option>
//                   <Option value="Wells Fargo">Wells Fargo</Option>
//                 </Select>
//               </div>

//               <div>
//                 <label className="font-semibold text-gray-700">Account Number</label>
//                 <Input
//                   value={data.bankInfo.accountNumber}
//                   onChange={(e) => handleChange("bankInfo", e.target.value, "accountNumber")}
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold text-gray-700">Bank Amount</label>
//                 <Input
//                   type="number"
//                   value={data.bankInfo.amount}
//                   onChange={(e) => handleChange("bankInfo", Number(e.target.value), "amount")}
//                   className="mt-1"
//                 />
//               </div>
//             </>
//           )}
//         </>
//       )}

//       {/* CREDIT */}
//       {data.payMode === "credit" && data.paymentType === "cheque" && (
//         <>
//           <div>
//             <label className="font-semibold text-gray-700">Cheque Amount</label>
//             <Input
//               type="number"
//               value={data.chequeInfo.chequeAmount}
//               onChange={(e) => handleChange("chequeInfo", Number(e.target.value), "chequeAmount")}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Select Bank</label>
//             <Select
//               value={data.chequeInfo.bankName}
//               onChange={(value) => handleChange("chequeInfo", value, "bankName")}
//               className="mt-1 w-full"
//             >
//               <Option value="Bank of America">Bank of America</Option>
//               <Option value="Chase">Chase</Option>
//               <Option value="Wells Fargo">Wells Fargo</Option>
//             </Select>
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Cheque Number</label>
//             <Input
//               value={data.chequeInfo.chequeNumber}
//               onChange={(e) => handleChange("chequeInfo", e.target.value, "chequeNumber")}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">TDS Amount</label>
//             <Input
//               type="number"
//               value={data.chequeInfo.tdsAmount}
//               onChange={(e) => handleChange("chequeInfo", Number(e.target.value), "tdsAmount")}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Chalan Number</label>
//             <Input
//               value={data.chequeInfo.chalanNumber}
//               onChange={(e) => handleChange("chequeInfo", e.target.value, "chalanNumber")}
//               className="mt-1"
//             />
//           </div>
//         </>
//       )}

//       {data.payMode === "credit" && data.paymentType === "bftn" && (
//         <>
//           <div>
//             <label className="font-semibold text-gray-700">BFTN Amount</label>
//             <Input
//               type="number"
//               value={data.bftnInfo.bftnAmount}
//               onChange={(e) => handleChange("bftnInfo", Number(e.target.value), "bftnAmount")}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Select Bank</label>
//             <Select
//               value={data.bftnInfo.bankName}
//               onChange={(value) => handleChange("bftnInfo", value, "bankName")}
//               className="mt-1 w-full"
//             >
//               <Option value="Bank of America">Bank of America</Option>
//               <Option value="Chase">Chase</Option>
//               <Option value="Wells Fargo">Wells Fargo</Option>
//             </Select>
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Account Number</label>
//             <Input
//               value={data.bftnInfo.accountNumber}
//               onChange={(e) => handleChange("bftnInfo", e.target.value, "accountNumber")}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">TDS Amount</label>
//             <Input
//               type="number"
//               value={data.bftnInfo.tdsAmount}
//               onChange={(e) => handleChange("bftnInfo", Number(e.target.value), "tdsAmount")}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-gray-700">Chalan Number</label>
//             <Input
//               value={data.bftnInfo.chalanNumber}
//               onChange={(e) => handleChange("bftnInfo", e.target.value, "chalanNumber")}
//               className="mt-1"
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// /* ---------------------- QuickPayModal ---------------------- */
// const QuickPayModal = ({ open, onClose, searchData, setSearchData, triggerSearch, isLoading, onSubmit }) => {
//   const [invoiceInput, setInvoiceInput] = useState("");

//   const handleSearch = async () => {
//     if (!invoiceInput) return message.error("Please enter an invoice number");
//     try {
//       const result = await triggerSearch(invoiceInput).unwrap();
//       if (result.success) {
//         setSearchData({
//           ...result.data,
//           paymentType: "",
//           cashAmount: 0,
//           bankInfo: { bankName: "", accountNumber: "", amount: 0 },
//           chequeInfo: { chequeAmount: 0, bankName: "", chequeNumber: "", tdsAmount: 0, chalanNumber: "" },
//           bftnInfo: { bftnAmount: 0, bankName: "", accountNumber: "", tdsAmount: 0, chalanNumber: "" },
//         });
//       } else message.error(result.message || "Invoice not found");
//     } catch {
//       message.error("Invoice not found");
//     }
//   };

//   return (
//     <Modal title="Quick Pay" open={open} onCancel={onClose} footer={null} width={600}>
//       <div className="flex gap-3 mb-6">
//         <Input
//           placeholder="Enter Invoice No"
//           value={invoiceInput}
//           onChange={(e) => setInvoiceInput(e.target.value)}
//         />
//         <Button type="primary" onClick={handleSearch} loading={isLoading}>
//           Search
//         </Button>
//       </div>

//       {searchData && (
//         <>
//           <PaymentInputs data={searchData} setData={setSearchData} />
//           <Button type="primary" className="mt-4" onClick={onSubmit}>
//             Submit Payment
//           </Button>
//         </>
//       )}
//     </Modal>
//   );
// };

// /* ---------------------- OrderTable ---------------------- */
// const OrderTable = ({ modalTitle }) => {
//   const { data: statusData, isLoading } = useGetOrderStatusInfoQuery(modalTitle.toLowerCase(), {
//     skip: !modalTitle || modalTitle === "Quick Pay",
//   });

//   const columns = [
//     { title: "SL No", key: "serial", render: (_, __, index) => index + 1, width: 80 },
//     { title: "Invoice", dataIndex: "invoiceNo" },
//     { title: "Order Date", dataIndex: "orderDate", render: (text) => new Date(text).toLocaleDateString() },
//     { title: "Total Payable", dataIndex: "totalPayable" },
//   ];

//   return isLoading ? (
//     <div className="flex justify-center py-10">
//       <Spin size="large" />
//     </div>
//   ) : (
//     <Table columns={columns} dataSource={statusData?.data || []} rowKey="invoiceNo" pagination={{ pageSize: 8 }} />
//   );
// };

// /* ---------------------- SidebarActions ---------------------- */
// const SidebarActions = ({ modalTitle, setModalTitle, setQuickPayModal }) => {
//   const buttons = ["Delivered", "pending", "Outstanding", "Paid", "Returned"];
//   return (
//     <div className="w-56 bg-white rounded-xl shadow p-4 flex flex-col gap-3 mt-20">
//       {buttons.map((btn) => (
//         <Button key={btn} type={modalTitle === btn ? "primary" : "default"} onClick={() => setModalTitle(btn)}>
//           {btn.toUpperCase()}
//         </Button>
//       ))}
//       <Button type="primary" onClick={() => setQuickPayModal(true)}>
//         Quick Pay
//       </Button>
//     </div>
//   );
// };

// /* ---------------------- Main Component ---------------------- */
// const InvoiceAndPayment = () => {
//   const [modalTitle, setModalTitle] = useState("pending");
//   const [quickPayModal, setQuickPayModal] = useState(false);
//   const [searchData, setSearchData] = useState(null);

//   const [triggerSearch, { isLoading: isSearchLoading }] = useLazySearchOrderQuery();

//   const handlePaymentSubmit = async () => {
//     if (!searchData) return;

//     const { payMode, paymentType, totalPayable, cashAmount, bankInfo, chequeInfo, bftnInfo, _id } = searchData;

//     let payload = { payMode, paymentType, totalAmount: totalPayable };

//     if (paymentType === "cash") payload.cashAmount = cashAmount || totalPayable;
//     else if (paymentType === "bank")
//       payload.bankInfo = { bankName: bankInfo.bankName, accountNumber: bankInfo.accountNumber, amount: bankInfo.amount };
//     else if (paymentType === "cash_bank") {
//       payload.cashAmount = cashAmount || 0;
//       payload.bankInfo = { bankName: bankInfo.bankName, accountNumber: bankInfo.accountNumber, amount: bankInfo.amount };
//     } else if (paymentType === "cheque") payload.chequeInfo = chequeInfo;
//     else if (paymentType === "bftn") payload.bftnInfo = bftnInfo;

//     try {
//       const res = await fetch(`http://localhost:5000/api/payments/${_id}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (data.success) {
//         message.success("Payment recorded successfully!");
//         setQuickPayModal(false);
//         setSearchData(null);
//       } else message.error(data.message || "Payment failed");
//     } catch (err) {
//       console.error(err);
//       message.error("Server error, please try again");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 p-6 gap-6">
//       <div className="flex-1">
//         <h2 className="text-2xl font-bold mb-6">{modalTitle.toUpperCase()} Orders</h2>
//         <OrderTable modalTitle={modalTitle} />
//       </div>

//       <SidebarActions modalTitle={modalTitle} setModalTitle={setModalTitle} setQuickPayModal={setQuickPayModal} />

//       <QuickPayModal
//         open={quickPayModal}
//         onClose={() => setQuickPayModal(false)}
//         searchData={searchData}
//         setSearchData={setSearchData}
//         triggerSearch={triggerSearch}
//         isLoading={isSearchLoading}
//         onSubmit={handlePaymentSubmit}
//       />
//     </div>
//   );
// };

// export default InvoiceAndPayment;

import React, { useState } from "react";
import { Button, Modal, Table, Input, message, Spin, Select } from "antd";
import {
  useGetOrderStatusInfoQuery,
  useLazySearchOrderQuery,
} from "../../redux/features/orders/orderApi";

const { Option } = Select;

/* ---------------------- PaymentInputs ---------------------- */
const PaymentInputs = ({ data, setData }) => {
  if (!data) return null;

  const handleChange = (field, value, subField) => {
    if (subField) {
      setData((prev) => ({ ...prev, [field]: { ...prev[field], [subField]: value } }));
    } else {
      setData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getPaymentTypeOptions = () => {
    const { payMode } = data;
    if (["cash", "stc", "spic"].includes(payMode)) return ["cash", "bank", "cash_bank"];
    if (payMode === "credit") return ["cheque", "bftn"];
    return [];
  };

  const inputClass = "w-full mt-1 rounded-lg border-gray-300 shadow-sm";

  return (
    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
      <div>
        <label className="font-semibold text-gray-700">Pay Mode</label>
        <Input value={data.payMode} disabled size="large" className={inputClass} />
      </div>

      <div>
        <label className="font-semibold text-gray-700">Payment Type</label>
        <Select
          placeholder="Select Payment Type"
          value={data.paymentType}
          size="large"
          onChange={(value) => handleChange("paymentType", value)}
          className={inputClass}
        >
          {getPaymentTypeOptions().map((type) => (
            <Option key={type} value={type}>
              {type.toUpperCase()}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <label className="font-semibold text-gray-700">Total Amount</label>
        <Input value={data.totalPayable} disabled size="large" className={inputClass} />
      </div>

      {/* CASH/STC/SPIC */}
      {["cash", "stc", "spic"].includes(data.payMode) && (
        <>
          {(data.paymentType === "cash" || data.paymentType === "cash_bank") && (
            <div>
              <label className="font-semibold text-gray-700">Cash Amount</label>
              <Input
                type="number"
                value={data.cashAmount}
                size="large"
                onChange={(e) => handleChange("cashAmount", Number(e.target.value))}
                className={inputClass}
              />
            </div>
          )}

          {["bank", "cash_bank"].includes(data.paymentType) && (
            <>
              <div>
                <label className="font-semibold text-gray-700">Select Bank</label>
                <Select
                  placeholder="Select Bank"
                  value={data.bankInfo.bankName}
                  size="large"
                  onChange={(value) => handleChange("bankInfo", value, "bankName")}
                  className={inputClass}
                >
                  <Option value="Bank of America">Bank of America</Option>
                  <Option value="Chase">Chase</Option>
                  <Option value="Wells Fargo">Wells Fargo</Option>
                </Select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Account Number</label>
                <Input
                  value={data.bankInfo.accountNumber}
                  size="large"
                  onChange={(e) => handleChange("bankInfo", e.target.value, "accountNumber")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Bank Amount</label>
                <Input
                  type="number"
                  value={data.bankInfo.amount}
                  size="large"
                  onChange={(e) => handleChange("bankInfo", Number(e.target.value), "amount")}
                  className={inputClass}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* CREDIT */}
      {data.payMode === "credit" && data.paymentType === "cheque" && (
        <>
          <div>
            <label className="font-semibold text-gray-700">Cheque Amount</label>
            <Input
              type="number"
              value={data.chequeInfo.chequeAmount}
              size="large"
              onChange={(e) => handleChange("chequeInfo", Number(e.target.value), "chequeAmount")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Select Bank</label>
            <Select
              value={data.chequeInfo.bankName}
              size="large"
              onChange={(value) => handleChange("chequeInfo", value, "bankName")}
              className={inputClass}
            >
              <Option value="Bank of America">Bank of America</Option>
              <Option value="Chase">Chase</Option>
              <Option value="Wells Fargo">Wells Fargo</Option>
            </Select>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Cheque Number</label>
            <Input
              value={data.chequeInfo.chequeNumber}
              size="large"
              onChange={(e) => handleChange("chequeInfo", e.target.value, "chequeNumber")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">TDS Amount</label>
            <Input
              type="number"
              value={data.chequeInfo.tdsAmount}
              size="large"
              onChange={(e) => handleChange("chequeInfo", Number(e.target.value), "tdsAmount")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Chalan Number</label>
            <Input
              value={data.chequeInfo.chalanNumber}
              size="large"
              onChange={(e) => handleChange("chequeInfo", e.target.value, "chalanNumber")}
              className={inputClass}
            />
          </div>
        </>
      )}

      {data.payMode === "credit" && data.paymentType === "bftn" && (
        <>
          <div>
            <label className="font-semibold text-gray-700">BFTN Amount</label>
            <Input
              type="number"
              value={data.bftnInfo.bftnAmount}
              size="large"
              onChange={(e) => handleChange("bftnInfo", Number(e.target.value), "bftnAmount")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Select Bank</label>
            <Select
              value={data.bftnInfo.bankName}
              size="large"
              onChange={(value) => handleChange("bftnInfo", value, "bankName")}
              className={inputClass}
            >
              <Option value="Bank of America">Bank of America</Option>
              <Option value="Chase">Chase</Option>
              <Option value="Wells Fargo">Wells Fargo</Option>
            </Select>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Account Number</label>
            <Input
              value={data.bftnInfo.accountNumber}
              size="large"
              onChange={(e) => handleChange("bftnInfo", e.target.value, "accountNumber")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">TDS Amount</label>
            <Input
              type="number"
              value={data.bftnInfo.tdsAmount}
              size="large"
              onChange={(e) => handleChange("bftnInfo", Number(e.target.value), "tdsAmount")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Chalan Number</label>
            <Input
              value={data.bftnInfo.chalanNumber}
              size="large"
              onChange={(e) => handleChange("bftnInfo", e.target.value, "chalanNumber")}
              className={inputClass}
            />
          </div>
        </>
      )}
    </div>
  );
};

/* ---------------------- QuickPayModal ---------------------- */
const QuickPayModal = ({ open, onClose, searchData, setSearchData, triggerSearch, isLoading, onSubmit }) => {
  const [invoiceInput, setInvoiceInput] = useState("");

  const handleSearch = async () => {
    if (!invoiceInput) return message.error("Please enter an invoice number");
    try {
      const result = await triggerSearch(invoiceInput).unwrap();
      if (result.success) {
        setSearchData({
          ...result.data,
          paymentType: "",
          cashAmount: 0,
          bankInfo: { bankName: "", accountNumber: "", amount: 0 },
          chequeInfo: { chequeAmount: 0, bankName: "", chequeNumber: "", tdsAmount: 0, chalanNumber: "" },
          bftnInfo: { bftnAmount: 0, bankName: "", accountNumber: "", tdsAmount: 0, chalanNumber: "" },
        });
      } else message.error(result.message || "Invoice not found");
    } catch {
      message.error("Invoice not found");
    }
  };

  return (
    <Modal
      title="Quick Pay"
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "24px" }}
      centered
    >
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Enter Invoice No"
          value={invoiceInput}
          size="large"
          onChange={(e) => setInvoiceInput(e.target.value)}
          className="flex-1 rounded-lg shadow-sm"
        />
        <Button type="primary" onClick={handleSearch} loading={isLoading} size="large">
          Search
        </Button>
      </div>

      {searchData && (
        <>
          <PaymentInputs data={searchData} setData={setSearchData} />
          <Button
            type="primary"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
            size="large"
            onClick={onSubmit}
          >
            Submit Payment
          </Button>
        </>
      )}
    </Modal>
  );
};

/* ---------------------- OrderTable ---------------------- */
const OrderTable = ({ modalTitle }) => {
  const { data: statusData, isLoading } = useGetOrderStatusInfoQuery(modalTitle.toLowerCase(), {
    skip: !modalTitle || modalTitle === "Quick Pay",
  });

  const columns = [
    { title: "SL No", key: "serial", render: (_, __, index) => index + 1, width: 80 },
    { title: "Invoice", dataIndex: "invoiceNo" },
    { title: "Order Date", dataIndex: "orderDate", render: (text) => new Date(text).toLocaleDateString() },
    { title: "Total Payable", dataIndex: "totalPayable" },
  ];

  return isLoading ? (
    <div className="flex justify-center py-10">
      <Spin size="large" />
    </div>
  ) : (
    <Table
      columns={columns}
      dataSource={statusData?.data || []}
      rowKey="invoiceNo"
      pagination={{ pageSize: 8 }}
      bordered
      size="middle"
      className="shadow-sm rounded-lg bg-white"
    />
  );
};

/* ---------------------- SidebarActions ---------------------- */
const SidebarActions = ({ modalTitle, setModalTitle, setQuickPayModal }) => {
  const buttons = ["Delivered", "pending", "Outstanding", "Paid", "Returned"];
  return (
    <div className="w-60 bg-white rounded-xl shadow-lg p-5 flex flex-col gap-4 mt-20">
      {buttons.map((btn) => (
        <Button
          key={btn}
          type={modalTitle === btn ? "primary" : "default"}
          size="large"
          className="font-semibold"
          onClick={() => setModalTitle(btn)}
        >
          {btn.toUpperCase()}
        </Button>
      ))}
      <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700 mt-2" onClick={() => setQuickPayModal(true)}>
        Quick Pay
      </Button>
    </div>
  );
};

/* ---------------------- Main Component ---------------------- */
const InvoiceAndPayment = () => {
  const [modalTitle, setModalTitle] = useState("pending");
  const [quickPayModal, setQuickPayModal] = useState(false);
  const [searchData, setSearchData] = useState(null);

  const [triggerSearch, { isLoading: isSearchLoading }] = useLazySearchOrderQuery();

  const handlePaymentSubmit = async () => {
    if (!searchData) return;

    const { payMode, paymentType, totalPayable, cashAmount, bankInfo, chequeInfo, bftnInfo, _id } = searchData;

    let payload = { payMode, paymentType, totalAmount: totalPayable };
    if (paymentType === "cash") payload.cashAmount = cashAmount || totalPayable;
    else if (paymentType === "bank") payload.bankInfo = bankInfo;
    else if (paymentType === "cash_bank") payload.cashAmount = cashAmount || 0, payload.bankInfo = bankInfo;
    else if (paymentType === "cheque") payload.chequeInfo = chequeInfo;
    else if (paymentType === "bftn") payload.bftnInfo = bftnInfo;

    try {
      const res = await fetch(`http://localhost:5000/api/payments/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        message.success("Payment recorded successfully!");
        setQuickPayModal(false);
        setSearchData(null);
      } else message.error(data.message || "Payment failed");
    } catch (err) {
      console.error(err);
      message.error("Server error, please try again");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6 gap-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{modalTitle.toUpperCase()} Orders</h2>
        <OrderTable modalTitle={modalTitle} />
      </div>

      <SidebarActions modalTitle={modalTitle} setModalTitle={setModalTitle} setQuickPayModal={setQuickPayModal} />

      <QuickPayModal
        open={quickPayModal}
        onClose={() => setQuickPayModal(false)}
        searchData={searchData}
        setSearchData={setSearchData}
        triggerSearch={triggerSearch}
        isLoading={isSearchLoading}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default InvoiceAndPayment;