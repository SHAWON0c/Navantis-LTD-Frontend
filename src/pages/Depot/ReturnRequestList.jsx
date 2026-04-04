import React from "react";
import toast from "react-hot-toast";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import Loader from "../../component/Loader";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import {
	useApproveReturnMutation,
	useGetPendingReturnsListQuery,
} from "../../redux/features/returns/returnsApi";

const formatAmount = (value) => {
	const amount = Number(value || 0);
	return amount.toLocaleString("en-BD", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};

const ReturnRequestList = () => {
	const { data, isLoading, isError, refetch } = useGetPendingReturnsListQuery();
	const [approveReturn, { isLoading: isApproving }] = useApproveReturnMutation();

	const returnRequests = data?.data || [];

	const handleApprove = async (returnId) => {
		try {
			await approveReturn(returnId).unwrap();
			toast.success("Return request approved successfully");
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
		<div className="min-h-screen bg-gray-50 p-4">
			<Card className="mb-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="small"
							icon={<MdArrowBack />}
							onClick={() => window.history.back()}
							className="ml-2"
						>
							Back
						</Button>
						<div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
							<h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
								<span>EMS</span>
								<ChevronRight size={14} className="text-gray-400" />
								<span>DEPOT</span>
								<ChevronRight size={14} className="text-gray-400" />
								<span className="text-gray-900 font-bold">RETURN REQUESTS</span>
							</h2>
						</div>
					</div>
					<div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
						Total Requests: {returnRequests.length}
					</div>
				</div>
			</Card>

			<div className="space-y-4">
				{returnRequests.length === 0 ? (
					<Card className="text-center py-12">
						<p className="text-gray-500 text-lg">No pending return requests found.</p>
					</Card>
				) : (
					returnRequests.map((request, index) => (
						<Card key={request.returnId} className="hover:shadow-md transition-shadow">
							{/* Header Section */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
								<div>
									<p className="text-xs text-gray-500 font-semibold">INVOICE</p>
									<p className="text-lg font-bold text-gray-900">{request.invoice}</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 font-semibold">CUSTOMER</p>
									<p className="text-sm font-medium text-gray-800">{request.customer?.customerName}</p>
									<p className="text-xs text-gray-600">{request.customer?.mobile}</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 font-semibold">RETURN DATE</p>
									<p className="text-sm text-gray-800">{request.returnedDate}</p>
								</div>
							</div>

							{/* Reason Section */}
							<div className="mb-4 pb-4 border-b">
								<p className="text-xs text-gray-500 font-semibold">RETURN REASON</p>
								<p className="text-sm text-gray-800">{request.returnReason}</p>
							</div>

							{/* Batches Table */}
							<div className="mb-4 overflow-x-auto">
								<p className="text-xs text-gray-500 font-semibold mb-2">RETURNED BATCHES</p>
								<table className="w-full text-xs">
									<thead>
										<tr className="bg-gray-100 border-b">
											<th className="px-2 py-2 text-left text-gray-700">Product</th>
											<th className="px-2 py-2 text-left text-gray-700">Batch No</th>
											<th className="px-2 py-2 text-left text-gray-700">Expire Date</th>
											<th className="px-2 py-2 text-center text-gray-700">Ordered</th>
											<th className="px-2 py-2 text-center text-gray-700">Returned</th>
										</tr>
									</thead>
									<tbody>
										{request.returnedBatches?.map((batch, batchIdx) => (
											<tr key={batchIdx} className="border-b hover:bg-gray-50">
												<td className="px-2 py-2 text-gray-800">{batch.product}</td>
												<td className="px-2 py-2 text-gray-800">{batch.batchNo}</td>
												<td className="px-2 py-2 text-gray-800">{batch.expireDate}</td>
												<td className="px-2 py-2 text-center font-semibold text-gray-900">
													{batch.orderedQuantity}
												</td>
												<td className="px-2 py-2 text-center font-semibold text-red-600">
													{batch.returnedQuantity}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Summary and Action */}
							<div className="flex items-center justify-between pt-4 border-t">
								<div className="space-y-1">
									<p className="text-sm text-gray-600">
										<span className="font-semibold">Total Qty:</span>{" "}
										<span className="text-lg font-bold text-blue-600">{request.totalQuantity}</span>
									</p>
									<p className="text-sm text-gray-600">
										<span className="font-semibold">Refund Amount:</span>{" "}
										<span className="text-lg font-bold text-green-600">
											৳ {formatAmount(request.refundAmount)}
										</span>
									</p>
								</div>
								<Button
									variant="primary"
									disabled={isApproving}
									onClick={() => handleApprove(request.returnId)}
									className="bg-blue-600 hover:bg-blue-700"
								>
									{isApproving ? "Approving..." : "Approve Return"}
								</Button>
							</div>
						</Card>
					))
				)}
			</div>
		</div>
	);
};

export default ReturnRequestList;
