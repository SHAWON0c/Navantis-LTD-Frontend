import React, { useState } from "react";
import { Button, Modal, Table, Input, message, Spin, Select } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import {
  useGetOrderStatusInfoQuery,
  useLazySearchOrderQuery,
  useSubmitPaymentMutation,
} from "../../redux/features/orders/orderApi";
import Card from "../../component/common/Card";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
const QuickPayModal = ({
  open,
  onClose,
  searchData,
  setSearchData,
  triggerSearch,
  isLoading,
  onSubmit,
  isSubmitting,
}) => {
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
            loading={isSubmitting}
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
  const navigate = useNavigate();
  const normalizedStatus = String(modalTitle || "").toLowerCase().trim();

  const { data: statusData, isLoading } = useGetOrderStatusInfoQuery(normalizedStatus, {
    skip: !normalizedStatus || normalizedStatus === "quick pay",
  });

  const orders = Array.isArray(statusData?.data)
    ? statusData.data
    : Array.isArray(statusData?.orders)
      ? statusData.orders
      : Array.isArray(statusData)
        ? statusData
        : [];

  const handlePrintInvoice = (record) => {
    const orderId = record?._id;
    const invoiceNo = record?.invoiceNo || record?.invoice;

    if (!orderId) {
      message.error("Order ID not found for print");
      return;
    }

    const entityType = String(record?.entityType || "customer").toLowerCase();
    const isInstituteOrder = entityType === "institute";

    navigate(isInstituteOrder ? "/institutes/invoice-print" : "/invoice-print", {
      state: {
        orderId,
        invoiceNo,
        orderType: isInstituteOrder ? "institute" : "customer",
        prefilledOrder: record,
        sourcePage: "invoice-payment",
      },
    });
  };

  const columns = [
    { title: "SL No", key: "serial", render: (_, __, index) => index + 1, width: 60 },
    {
      title: "Invoice No",
      key: "invoiceNo",
      render: (_, record) => record?.invoiceNo || record?.invoice || "N/A",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
      title: "Ordered By (MPO)",
      key: "orderedBy",
      render: (_, record) => record?.orderedBy || record?.mpo?.mpoName || record?.mpo?.name || "N/A",
    },
    {
      title: "Customer Name",
      key: "customerName",
      render: (_, record) => record?.customerName || record?.customer?.customerName || "N/A",
    },
    {
      title: "Order Value (Tk)",
      key: "orderValue",
      align: "right",
      render: (_, record) => Number(record?.netAmount ?? 0).toLocaleString(),
    },
    {
      title: "Payable Amount (Tk)",
      key: "payableAmount",
      align: "right",
      render: (_, record) => Number(record?.totalPayable ?? 0).toLocaleString(),
    },
    ...(normalizedStatus === "returned"
      ? [
          {
            title: "Returned Quantity",
            key: "returnedQuantity",
            align: "right",
            render: (_, record) => {
              if (typeof record?.returnedQuantity === "number") return record.returnedQuantity;
              if (!Array.isArray(record?.products)) return 0;
              return record.products.reduce(
                (sum, product) => sum + Number(product?.returnedQuantity || 0),
                0
              );
            },
          },
        ]
      : []),
    {
      title: "Print",
      key: "print",
      width: 64,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          icon={<PrinterOutlined style={{ fontSize: 14 }} />}
          onClick={() => handlePrintInvoice(record)}
          aria-label="Print invoice"
        />
      ),
    },
  ];

  return isLoading ? (
    <div className="flex justify-center py-8">
      <Spin size="large" />
    </div>
  ) : (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey={(record) => record?._id || record?.invoiceNo || record?.invoice}
      pagination={{ pageSize: 10, size: "small" }}
      scroll={{ x: 900 }}
      bordered
      size="small"
      className="shadow-sm rounded-md bg-white text-[11px] [&_.ant-table-thead>tr>th]:py-1 [&_.ant-table-thead>tr>th]:px-2 [&_.ant-table-thead>tr>th]:text-[11px] [&_.ant-table-tbody>tr>td]:py-1 [&_.ant-table-tbody>tr>td]:px-2 [&_.ant-table-tbody>tr>td]:text-[11px] [&_.ant-pagination]:text-[11px]"
    />
  );
};

/* ---------------------- SidebarActions ---------------------- */
const SidebarActions = ({ modalTitle, setModalTitle, setQuickPayModal }) => {
  const buttons = ["Delivered", "pending", "Outstanding", "Paid", "Returned"];
  return (
    <div className="w-40 bg-white rounded-md shadow-sm p-2 flex flex-col gap-1">
      {buttons.map((btn) => (
        <Button
          key={btn}
          type={modalTitle === btn ? "primary" : "default"}
          size="small"
          className="font-semibold text-[11px] h-7"
          onClick={() => setModalTitle(btn)}
        >
          {btn.toUpperCase()}
        </Button>
      ))}
      <Button type="primary" size="small" className="bg-blue-600 hover:bg-blue-700 mt-1 text-[11px] h-7" onClick={() => setQuickPayModal(true)}>
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
  const [submitPayment, { isLoading: isSubmittingPayment }] = useSubmitPaymentMutation();

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
      const data = await submitPayment({ paymentId: _id, payload }).unwrap();
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
    <div className="min-h-screen flex flex-col text-xs">
      {/* ---------------- HEADER (Top) ---------------- */}
      <Card className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-1 text-[11px] h-7 px-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-2 py-1 sm:h-9">
              <h2 className="flex flex-wrap items-center text-[10px] md:text-[11px] font-semibold text-gray-800 gap-1 leading-tight">
                <span>EMS</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span className="text-gray-900 font-bold">INVOICE & PAYMENT || <span className="bg-blue-100 text-[10px] text-red-400 px-1 py-0.5"> {modalTitle.toUpperCase()} ORDERS</span></span>
              </h2>
            </div>
          </div>
          <div className="text-[10px] text-neutral-500 mr-1">
            Totals:
          </div>
        </div>
      </Card>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex flex-1 gap-2">
        {/* Table on Left */}
        <div className="flex-1">

          <OrderTable modalTitle={modalTitle} />
        </div>

        {/* Status / Sidebar on Right */}
        <div className="w-40 shrink-0">
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
        isSubmitting={isSubmittingPayment}
      />
    </div>
  );
};

export default InvoiceAndPayment;