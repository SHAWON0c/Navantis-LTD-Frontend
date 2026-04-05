import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loader from "../../component/Loader";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import {
	useGetPendingReturnsListQuery,
	useApproveReturnMutation,
} from "../../redux/features/returns/returnsApi";

const ApproveReturn = () => {
	const { data, isLoading, isError, refetch } = useGetPendingReturnsListQuery();
	const [approveReturn, { isLoading: isApproving }] = useApproveReturnMutation();
	const [approvedReturn, setApprovedReturn] = useState(null);
	const [showApprovedModal, setShowApprovedModal] = useState(false);

	const returnedOrders = data?.data || [];

	const handleApproveReturn = async (returnId, returnOrder) => {
		// Show confirmation modal
		const result = await Swal.fire({
			title: "Approve Return Request?",
			html: `
        <div class="text-left space-y-2">
          <p><strong>Invoice:</strong> ${returnOrder?.invoice}</p>
          <p><strong>Customer:</strong> ${returnOrder?.customer?.customerName}</p>
          <p><strong>Total Qty:</strong> ${returnOrder?.totalQuantity}</p>
          <p><strong>Reason:</strong> ${returnOrder?.returnReason}</p>
        </div>
      `,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Approve",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#3085d6",
		});

		if (!result.isConfirmed) return;

		try {
			await approveReturn(returnId).unwrap();
			toast.success("Return approved successfully!");

			// Show approved modal with the return data
			setApprovedReturn({
				...returnOrder,
				approvedAt: new Date().toISOString(),
			});
			setShowApprovedModal(true);

			// Refetch the list to remove the approved item
			refetch();
		} catch (error) {
			const errMessage =
				error?.data?.message || error?.message || "Failed to approve return request";
			toast.error(errMessage);
		}
	};

	if (isLoading) return <Loader />;

	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="text-center p-6">
					<p className="text-red-600 font-medium">Failed to load return requests.</p>
					<Button variant="primary" className="mt-4" onClick={() => refetch()}>
						Try Again
					</Button>
				</Card>
			</div>
		);
	}

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="small"
              icon={<MdArrowBack />}
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">APPROVE RETURNS</span>
              </h2>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs sm:text-sm text-neutral-500">
              Pending: {returnedOrders.length}
            </div>
          </div>
        </div>
      </Card>

      {/* Pending Returns List */}
      <div className="space-y-4">
        {returnedOrders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 text-lg">No pending return requests</p>
          </Card>
        ) : (
          returnedOrders.map((returnOrder) => (
            <Card key={returnOrder.returnId} className="hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Left side - Order info */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">INVOICE</p>
                    <p className="text-lg font-bold text-gray-900">
                      {returnOrder.invoice}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">CUSTOMER</p>
                    <p className="text-sm text-gray-800">
                      {returnOrder.customer?.customerName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {returnOrder.customer?.mobile}
                    </p>
                  </div>
                </div>

                {/* Right side - Return details */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">RETURN REASON</p>
                    <p className="text-sm text-gray-800">
                      {returnOrder.returnReason}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">RETURNED DATE</p>
                      <p className="text-sm text-gray-800">
                        {returnOrder.returnedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">TOTAL QTY</p>
                      <p className="text-lg font-bold text-blue-600">
                        {returnOrder.totalQuantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch Details Table */}
              <div className="border-t pt-4 mb-4">
                <p className="text-xs text-gray-500 font-semibold mb-2">
                  RETURNED BATCHES
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-3 py-2 text-left text-gray-700">Product</th>
                        <th className="px-3 py-2 text-left text-gray-700">Batch No</th>
                        <th className="px-3 py-2 text-left text-gray-700">Expire Date</th>
                        <th className="px-3 py-2 text-center text-gray-700">Ordered</th>
                        <th className="px-3 py-2 text-center text-gray-700">Returned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnOrder.returnedBatches?.map((batch, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-800">
                            {batch.product}
                          </td>
                          <td className="px-3 py-2 text-gray-800">
                            {batch.batchNo}
                          </td>
                          <td className="px-3 py-2 text-gray-800">
                            {batch.expireDate}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold text-gray-900">
                            {batch.orderedQuantity}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold text-red-600">
                            {batch.returnedQuantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Refund and Action */}
              <div className="border-t pt-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold">REFUND AMOUNT</p>
                  <p className="text-lg font-bold text-green-600">
                    ৳ {returnOrder.refundAmount?.toLocaleString("en-BD")}
                  </p>
                </div>
                <Button
                  variant="primary"
                  icon={<FaCheck />}
                  disabled={isApproving}
                  onClick={() => handleApproveReturn(returnOrder.returnId, returnOrder)}
                  className="bg-green-600 hover:bg-green-700"
                  title="Click to approve this return"
                >
                  {isApproving ? "Approving..." : "Approve Return"}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Approved Modal */}
      {showApprovedModal && approvedReturn && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 text-green-600 p-2 rounded-full">
                  <FaCheck size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Return Approved Successfully
                </h3>
              </div>
              <button
                onClick={() => setShowApprovedModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Approval Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">INVOICE</p>
                  <p className="text-lg font-bold text-gray-900">
                    {approvedReturn.invoice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">APPROVED DATE</p>
                  <p className="text-sm text-gray-800">
                    {new Date(approvedReturn.approvedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">CUSTOMER</p>
                  <p className="text-sm text-gray-800">
                    {approvedReturn.customer?.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">TOTAL QTY</p>
                  <p className="text-lg font-bold text-blue-600">
                    {approvedReturn.totalQuantity}
                  </p>
                </div>
              </div>

              {/* Batches */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 font-semibold mb-2">
                  APPROVED BATCHES
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-3 py-2 text-left text-gray-700">
                          Product
                        </th>
                        <th className="px-3 py-2 text-left text-gray-700">
                          Batch No
                        </th>
                        <th className="px-3 py-2 text-center text-gray-700">Returned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedReturn.returnedBatches?.map((batch, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-800">
                            {batch.product}
                          </td>
                          <td className="px-3 py-2 text-gray-800">
                            {batch.batchNo}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold text-gray-900">
                            {batch.returnedQuantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Refund Approved */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-semibold">REFUND AMOUNT APPROVED</p>
                <p className="text-2xl font-bold text-green-600">
                  ৳ {approvedReturn.refundAmount?.toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowApprovedModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowApprovedModal(false)}
                className="bg-green-600 hover:bg-green-700"
              >
                Done
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApproveReturn;
