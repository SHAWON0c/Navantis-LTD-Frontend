import React, { useState } from "react";
import { Button, Modal, Table, Input, message, Spin, Select } from "antd";
import {
  useGetOrderStatusInfoQuery,
  useLazySearchOrderQuery,
} from "../../redux/features/orders/orderApi";
import Card from "../../component/common/Card";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

const { Option } = Select;

/* ---------------------- PaymentInputs ---------------------- */
const PaymentInputs = ({ data, setData, errors = {} }) => {
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
    if (payMode === "credit") return ["cheque", "beftn"];
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
        <label className="font-semibold text-gray-700">
          Payment Type <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Select Payment Type"
          value={data.paymentType}
          size="large"
          onChange={(value) => handleChange("paymentType", value)}
          className={inputClass}
          status={errors.paymentType ? "error" : ""}
        >
          {getPaymentTypeOptions().map((type) => (
            <Option key={type} value={type}>
              {type.toUpperCase()}
            </Option>
          ))}
        </Select>
        {errors.paymentType && <p className="text-red-500 text-xs mt-1">⚠ {errors.paymentType}</p>}
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
              <label className="font-semibold text-gray-700">
                Cash Amount <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={data.cashAmount}
                size="large"
                onChange={(e) => handleChange("cashAmount", Number(e.target.value))}
                className={inputClass}
                status={errors.cashAmount ? "error" : ""}
                placeholder="0.00"
              />
              {errors.cashAmount && <p className="text-red-500 text-xs mt-1">⚠ {errors.cashAmount}</p>}
            </div>
          )}

          {["bank", "cash_bank"].includes(data.paymentType) && (
            <>
              <div>
                <label className="font-semibold text-gray-700">
                  Select Bank <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Select Bank"
                  value={data.bankInfo.bankName || undefined}
                  size="large"
                  onChange={(value) => handleChange("bankInfo", value, "bankName")}
                  className={inputClass}
                  status={errors.bankName ? "error" : ""}
                >
                  <Option value="Bank of America">Bank of America</Option>
                  <Option value="Chase">Chase</Option>
                  <Option value="Wells Fargo">Wells Fargo</Option>
                </Select>
                {errors.bankName && <p className="text-red-500 text-xs mt-1">⚠ {errors.bankName}</p>}
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.bankInfo.accountNumber}
                  size="large"
                  onChange={(e) => handleChange("bankInfo", e.target.value, "accountNumber")}
                  className={inputClass}
                  status={errors.accountNumber ? "error" : ""}
                  placeholder="Enter account number"
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">⚠ {errors.accountNumber}</p>}
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Bank Amount <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={data.bankInfo.amount}
                  size="large"
                  onChange={(e) => handleChange("bankInfo", Number(e.target.value), "amount")}
                  className={inputClass}
                  status={errors.bankAmount ? "error" : ""}
                  placeholder="0.00"
                />
                {errors.bankAmount && <p className="text-red-500 text-xs mt-1">⚠ {errors.bankAmount}</p>}
              </div>
            </>
          )}
        </>
      )}

      {/* CREDIT CHEQUE */}
      {data.payMode === "credit" && data.paymentType === "cheque" && (
        <>
          <div>
            <label className="font-semibold text-gray-700">
              Cheque Amount <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={data.chequeInfo.chequeAmount}
              size="large"
              onChange={(e) => handleChange("chequeInfo", Number(e.target.value), "chequeAmount")}
              className={inputClass}
              status={errors.chequeAmount ? "error" : ""}
              placeholder="0.00"
            />
            {errors.chequeAmount && <p className="text-red-500 text-xs mt-1">⚠ {errors.chequeAmount}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Select Bank <span className="text-red-500">*</span>
            </label>
            <Select
              value={data.chequeInfo.bankName || undefined}
              size="large"
              onChange={(value) => handleChange("chequeInfo", value, "bankName")}
              className={inputClass}
              status={errors.chequeBankName ? "error" : ""}
            >
              <Option value="Bank of America">Bank of America</Option>
              <Option value="Chase">Chase</Option>
              <Option value="Wells Fargo">Wells Fargo</Option>
            </Select>
            {errors.chequeBankName && <p className="text-red-500 text-xs mt-1">⚠ {errors.chequeBankName}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Cheque Number <span className="text-red-500">*</span>
            </label>
            <Input
              value={data.chequeInfo.chequeNumber}
              size="large"
              onChange={(e) => handleChange("chequeInfo", e.target.value, "chequeNumber")}
              className={inputClass}
              status={errors.chequeNumber ? "error" : ""}
              placeholder="Enter cheque number"
            />
            {errors.chequeNumber && <p className="text-red-500 text-xs mt-1">⚠ {errors.chequeNumber}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              TDS Amount <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={data.chequeInfo.tdsAmount}
              size="large"
              onChange={(e) => handleChange("chequeInfo", Number(e.target.value), "tdsAmount")}
              className={inputClass}
              status={errors.chequeTdsAmount ? "error" : ""}
              placeholder="0.00"
            />
            {errors.chequeTdsAmount && <p className="text-red-500 text-xs mt-1">⚠ {errors.chequeTdsAmount}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Challan Number <span className="text-red-500">*</span>
            </label>
            <Input
              value={data.chequeInfo.chalanNumber}
              size="large"
              onChange={(e) => handleChange("chequeInfo", e.target.value, "chalanNumber")}
              className={inputClass}
              status={errors.chalanNumber ? "error" : ""}
              placeholder="Enter challan number"
            />
            {errors.chalanNumber && <p className="text-red-500 text-xs mt-1">⚠ {errors.chalanNumber}</p>}
          </div>
        </>
      )}

      {/* CREDIT BEFTN */}
      {data.payMode === "credit" && data.paymentType === "beftn" && (
        <>
          <div>
            <label className="font-semibold text-gray-700">
              BEFTN Amount <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={data.beftnInfo.beftnAmount}
              size="large"
              onChange={(e) => handleChange("beftnInfo", Number(e.target.value), "beftnAmount")}
              className={inputClass}
              status={errors.beftnAmount ? "error" : ""}
              placeholder="0.00"
            />
            {errors.beftnAmount && <p className="text-red-500 text-xs mt-1">⚠ {errors.beftnAmount}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Select Bank <span className="text-red-500">*</span>
            </label>
            <Select
              value={data.beftnInfo.bankName || undefined}
              size="large"
              onChange={(value) => handleChange("beftnInfo", value, "bankName")}
              className={inputClass}
              status={errors.beftnBankName ? "error" : ""}
            >
              <Option value="Bank of America">Bank of America</Option>
              <Option value="Chase">Chase</Option>
              <Option value="Wells Fargo">Wells Fargo</Option>
            </Select>
            {errors.beftnBankName && <p className="text-red-500 text-xs mt-1">⚠ {errors.beftnBankName}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Account Number <span className="text-red-500">*</span>
            </label>
            <Input
              value={data.beftnInfo.accountNumber}
              size="large"
              onChange={(e) => handleChange("beftnInfo", e.target.value, "accountNumber")}
              className={inputClass}
              status={errors.beftnAccountNumber ? "error" : ""}
              placeholder="Enter account number"
            />
            {errors.beftnAccountNumber && <p className="text-red-500 text-xs mt-1">⚠ {errors.beftnAccountNumber}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              TDS Amount <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={data.beftnInfo.tdsAmount}
              size="large"
              onChange={(e) => handleChange("beftnInfo", Number(e.target.value), "tdsAmount")}
              className={inputClass}
              status={errors.beftnTdsAmount ? "error" : ""}
              placeholder="0.00"
            />
            {errors.beftnTdsAmount && <p className="text-red-500 text-xs mt-1">⚠ {errors.beftnTdsAmount}</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Challan Number <span className="text-red-500">*</span>
            </label>
            <Input
              value={data.beftnInfo.chalanNumber}
              size="large"
              onChange={(e) => handleChange("beftnInfo", e.target.value, "chalanNumber")}
              className={inputClass}
              status={errors.beftnChalanNumber ? "error" : ""}
              placeholder="Enter challan number"
            />
            {errors.beftnChalanNumber && <p className="text-red-500 text-xs mt-1">⚠ {errors.beftnChalanNumber}</p>}
          </div>
        </>
      )}
    </div>
  );
};

/* ---------------------- QuickPayModal ---------------------- */
const QuickPayModal = ({ open, onClose, searchData, setSearchData, triggerSearch, isLoading, onSubmit }) => {
  const [invoiceInput, setInvoiceInput] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const validatePaymentData = (data) => {
    const errors = {};

    // Check payment type is selected
    if (!data.paymentType) {
      errors.paymentType = "Payment Type is required";
      return errors;
    }

    // CASH/STC/SPIC validations
    if (["cash", "stc", "spic"].includes(data.payMode)) {
      if (data.paymentType === "cash" || data.paymentType === "cash_bank") {
        if (data.cashAmount === null || data.cashAmount === undefined || data.cashAmount === "") {
          errors.cashAmount = "Cash Amount is required";
        }
      }

      if (["bank", "cash_bank"].includes(data.paymentType)) {
        if (!data.bankInfo.bankName) {
          errors.bankName = "Bank Name is required";
        }
        if (!data.bankInfo.accountNumber) {
          errors.accountNumber = "Account Number is required";
        }
        if (data.bankInfo.amount === null || data.bankInfo.amount === undefined || data.bankInfo.amount === "") {
          errors.bankAmount = "Bank Amount is required";
        }
      }
    }

    // CREDIT CHEQUE validations
    if (data.payMode === "credit" && data.paymentType === "cheque") {
      if (data.chequeInfo.chequeAmount === null || data.chequeInfo.chequeAmount === undefined || data.chequeInfo.chequeAmount === "") {
        errors.chequeAmount = "Cheque Amount is required";
      }
      if (!data.chequeInfo.bankName) {
        errors.chequeBankName = "Bank Name is required";
      }
      if (!data.chequeInfo.chequeNumber) {
        errors.chequeNumber = "Cheque Number is required";
      }
      if (!data.chequeInfo.tdsAmount && data.chequeInfo.tdsAmount !== 0) {
        errors.chequeTdsAmount = "TDS Amount is required";
      }
      if (!data.chequeInfo.chalanNumber) {
        errors.chalanNumber = "Challan Number is required";
      }
    }

    // CREDIT BEFTN validations
    if (data.payMode === "credit" && data.paymentType === "beftn") {
      if (data.beftnInfo.beftnAmount === null || data.beftnInfo.beftnAmount === undefined || data.beftnInfo.beftnAmount === "") {
        errors.beftnAmount = "BEFTN Amount is required";
      }
      if (!data.beftnInfo.bankName) {
        errors.beftnBankName = "Bank Name is required";
      }
      if (!data.beftnInfo.accountNumber) {
        errors.beftnAccountNumber = "Account Number is required";
      }
      if (!data.beftnInfo.tdsAmount && data.beftnInfo.tdsAmount !== 0) {
        errors.beftnTdsAmount = "TDS Amount is required";
      }
      if (!data.beftnInfo.chalanNumber) {
        errors.beftnChalanNumber = "Challan Number is required";
      }
    }

    return errors;
  };

  const handleSearch = async () => {
    if (!invoiceInput) return message.error("Please enter an invoice number");
    try {
      const result = await triggerSearch(invoiceInput).unwrap();
      if (result.success) {
        const orderData = Array.isArray(result.data) ? result.data[0] : result.data;
        setSearchData({
          ...orderData,
          paymentType: "",
          cashAmount: 0,
          bankInfo: { bankName: "", accountNumber: "", amount: 0 },
          chequeInfo: { chequeAmount: 0, bankName: "", chequeNumber: "", tdsAmount: 0, chalanNumber: "" },
          beftnInfo: { beftnAmount: 0, bankName: "", accountNumber: "", tdsAmount: 0, chalanNumber: "" },
        });
        setValidationErrors({});
      } else message.error(result.message || "Invoice not found");
    } catch {
      message.error("Invoice not found");
    }
  };

  const handleSubmitClick = () => {
    const errors = validatePaymentData(searchData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const errorMessages = Object.values(errors).join("\n");
      message.error(`Please fill all required fields:\n${errorMessages}`);
      return;
    }
    setValidationErrors({});
    onSubmit();
  };

  return (
    <Modal
      title="Quick Pay"
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
      centered
      styles={{
        body: { maxHeight: "70vh", overflowY: "auto", padding: "24px" }, // replaces bodyStyle
      }}
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
          <PaymentInputs data={searchData} setData={setSearchData} errors={validationErrors} />
          <Button
            type="primary"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            size="large"
            onClick={handleSubmitClick}
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
    { title: "Order Date", dataIndex: "orderDate", render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A' },
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
    <div className="w-60 bg-white rounded-xl shadow-lg p-8 flex flex-col gap-2 ">
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

    const { payMode, paymentType, totalPayable, cashAmount, bankInfo, chequeInfo, beftnInfo, _id } = searchData;

    let payload = { payMode, paymentType, totalAmount: totalPayable };
    if (paymentType === "cash") payload.cashAmount = cashAmount || totalPayable;
    else if (paymentType === "bank") payload.bankInfo = bankInfo;
    else if (paymentType === "cash_bank") payload.cashAmount = cashAmount || 0, payload.bankInfo = bankInfo;
    else if (paymentType === "cheque") payload.chequeInfo = chequeInfo;
    else if (paymentType === "beftn") payload.beftnInfo = beftnInfo;

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
    <div className="min-h-screen flex flex-col">
      {/* ---------------- HEADER (Top) ---------------- */}
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
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">INVOICE & PAYMENT   ||  <span className="bg-blue-100 text-sm text-red-400 p-1"> {modalTitle.toUpperCase()} ORDERS</span></span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Totals:
          </div>
        </div>
      </Card>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex flex-1 gap-6">
        {/* Table on Left */}
        <div className="flex-1">

          <OrderTable modalTitle={modalTitle} />
        </div>

        {/* Status / Sidebar on Right */}
        <div className="w-60">
          <SidebarActions
            modalTitle={modalTitle}
            setModalTitle={setModalTitle}
            setQuickPayModal={setQuickPayModal}
          />
        </div>
      </div>

      {/* ---------------- QUICK PAY MODAL ---------------- */}
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