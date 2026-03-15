import React from "react";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import Loader from "../../component/Loader";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import {
	useApproveReturnMutation,
	useGetPendingReturnsQuery,
} from "../../redux/features/orders/orderApi";

const formatDate = (value) => {
	if (!value) return "-";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "-";
	return parsed.toLocaleDateString("en-GB");
};

const formatAmount = (value) => {
	const amount = Number(value || 0);
	return amount.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const ReturnRequestList = () => {
	const { data, isLoading, isError, refetch } = useGetPendingReturnsQuery();
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
		<div className="min-h-screen">
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

			<div className="overflow-x-auto bg-white shadow rounded-xl">
				<table className="min-w-full divide-y divide-gray-200 text-sm">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">Invoice</th>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">Batches</th>
							<th className="px-4 py-3 text-center font-semibold text-gray-700">Total Qty</th>
							<th className="px-4 py-3 text-right font-semibold text-gray-700">Refund Amount</th>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">Reason</th>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
							<th className="px-4 py-3 text-left font-semibold text-gray-700">Created At</th>
							<th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-200">
						{returnRequests.length === 0 ? (
							<tr>
								<td colSpan="11" className="px-4 py-8 text-center text-gray-500">
									No pending return requests found.
								</td>
							</tr>
						) : (
							returnRequests.map((request, index) => (
								<tr key={request._id} className="hover:bg-gray-50 align-top">
									<td className="px-4 py-3">{index + 1}</td>
									<td className="px-4 py-3">{request?.orderId?.invoiceNo || "-"}</td>
									<td className="px-4 py-3">{request?.productId?.productName || "-"}</td>
									<td className="px-4 py-3">{request?.customerId?.customerName || "-"}</td>
									<td className="px-4 py-3">
										<div className="space-y-1">
											{(request?.returnedBatches || []).length === 0 ? (
												<p className="text-gray-500">-</p>
											) : (
												(request.returnedBatches || []).map((batch) => (
													<div key={batch._id || batch.depotProductId} className="text-xs text-gray-700 border rounded p-2">
														<p>Batch: {batch.batchNo || "-"}</p>
														<p>Expire: {formatDate(batch.expireDate)}</p>
														<p>Qty: {batch.quantity || 0}</p>
													</div>
												))
											)}
										</div>
									</td>
									<td className="px-4 py-3 text-center">{request?.totalQuantity || 0}</td>
									<td className="px-4 py-3 text-right">{formatAmount(request?.refundAmount)}</td>
									<td className="px-4 py-3 max-w-[220px] break-words">{request?.reason || "-"}</td>
									<td className="px-4 py-3 capitalize">{request?.status || "-"}</td>
									<td className="px-4 py-3">{formatDate(request?.createdAt)}</td>
									<td className="px-4 py-3 text-center">
										<Button
											variant="primary"
											size="small"
											disabled={isApproving || request?.status !== "pending"}
											onClick={() => handleApprove(request._id)}
										>
											{isApproving ? "Approving..." : "Approve"}
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ReturnRequestList;
