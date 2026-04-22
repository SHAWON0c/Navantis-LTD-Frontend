import React, { useMemo, useState } from "react";
import { ImSearch } from "react-icons/im";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import Loader from "../../component/Loader";
import { useUserProfile } from "../../hooks/useUserProfile";
import {
	useApproveCustomerMutation,
	useActivateCustomerMutation,
	useGetMyPendingCustomersAutoQuery,
	useGetapprovedCustomersByStatusQuery,
} from "../../redux/features/managers/zmApi";

const CustomerList = () => {
	const { data: userProfile } = useUserProfile();
	const userRole = String(userProfile?.role || localStorage.getItem("role") || "").toLowerCase();

	console.log("User role check:", { roleFromProfile: userProfile?.role, userRole });

	// Map approval levels to role abbreviations
	const levelToRoleMap = {
		zonalManager: "zm",
		managingDirector: "md",
		areaManager: "am",
		mpo: "mpo",
		depositManager: "dm",
	};

	// Check if user can approve based on currentLevel matching user role
	const canApprove = (currentLevel) => {
		if (!userRole) return false;
		const requiredRole = levelToRoleMap[currentLevel];
		return userRole === requiredRole;
	};

	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [customersPerPage, setCustomersPerPage] = useState(20);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [statusFilter, setStatusFilter] = useState("pending");
	const [approveCustomer, { isLoading: isApproving }] = useApproveCustomerMutation();
	const [activateCustomer, { isLoading: isActivating }] = useActivateCustomerMutation();

	const pendingQuery = useGetMyPendingCustomersAutoQuery();
	const approvedQuery = useGetapprovedCustomersByStatusQuery("approved", { skip: statusFilter !== "approved" });

	const { data: response, isLoading, isError, isFetching, refetch } =
		statusFilter === "pending" ? pendingQuery : approvedQuery;

	const customers = response?.data || [];

	const filteredCustomers = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return customers;

		return customers.filter((customer) => {
			const name = String(customer?.customerName || "").toLowerCase();
			const mobile = String(customer?.mobile || "").toLowerCase();
			const email = String(customer?.email || "").toLowerCase();
			const tradeLicense = String(customer?.tradeLicense || "").toLowerCase();
			const drugLicense = String(customer?.drugLicense || "").toLowerCase();

			return (
				name.includes(term) ||
				mobile.includes(term) ||
				email.includes(term) ||
				tradeLicense.includes(term) ||
				drugLicense.includes(term)
			);
		});
	}, [customers, searchTerm]);

	const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / customersPerPage));
	const startIndex = (currentPage - 1) * customersPerPage;
	const currentCustomers = filteredCustomers.slice(startIndex, startIndex + customersPerPage);

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1);
	};

	const changePage = (page) => {
		setCurrentPage(Math.min(Math.max(1, page), totalPages));
	};

	const openDetailsModal = (customer) => {
		setSelectedCustomer(customer);
	};

	const closeDetailsModal = () => {
		setSelectedCustomer(null);
	};

	const approveSelectedCustomer = async () => {
		if (!selectedCustomer?._id) return;

		try {
			await approveCustomer(selectedCustomer._id).unwrap();

			setSelectedCustomer((prev) => {
				if (!prev) return prev;
				return { ...prev, status: "approved" };
			});

			refetch();
		} catch (error) {
			const message = error?.data?.message || "Failed to approve customer.";
			window.alert(message);
		}
	};

	const activateSelectedCustomer = async () => {
		if (!selectedCustomer?._id) return;

		try {
			await activateCustomer(selectedCustomer._id).unwrap();

			setSelectedCustomer((prev) => {
				if (!prev) return prev;
				return { ...prev, status: "active" };
			});

			refetch();
		} catch (error) {
			const message = error?.data?.message || "Failed to activate customer.";
			window.alert(message);
		}
	};

	const getDisplayStatus = (customer) => {
		return customer?.status || "pending";
	};

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="text-center">
					<p className="text-error text-lg">Failed to load pending customers.</p>
					<Button variant="primary" className="mt-4" onClick={refetch}>
						Try Again
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<Card className="mb-6">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
								<span>ZM</span>
								<ChevronRight size={14} className="text-gray-400" />
								<span className="text-gray-900 font-bold">PENDING CUSTOMERS</span>
							</h2>
						</div>
					</div>

					<div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
						Total Records: {filteredCustomers.length}
					</div>
				</div>
			</Card>

			<Card
				title="Pending Customer List"
				subtitle={`Showing ${currentCustomers.length} of ${filteredCustomers.length} records`}
			>
				<div className="mb-4 flex flex-col gap-3">
					<div className="flex gap-3">
						<Button
							variant={statusFilter === "pending" ? "primary" : "outline"}
							size="small"
							onClick={() => {
								setStatusFilter("pending");
								setCurrentPage(1);
							}}
						>
							Pending
						</Button>
						<Button
							variant={statusFilter === "approved" ? "primary" : "outline"}
							size="small"
							onClick={() => {
								setStatusFilter("approved");
								setCurrentPage(1);
							}}
						>
							Approved
						</Button>
					</div>
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="w-full md:w-auto flex border border-gray-300 rounded-lg overflow-hidden">
						<div className="border-r border-gray-300 p-2 bg-gray-50 flex items-center">
							<ImSearch className="text-gray-500" />
						</div>
						<input
							type="text"
							placeholder="Search by name, mobile, email, or license"
							value={searchTerm}
							onChange={handleSearch}
							className="px-3 py-2 w-full md:w-80 focus:outline-none text-sm"
						/>
					</div>
				</div>

				<div className="flex items-center gap-3">
						<select
							value={customersPerPage}
							onChange={(event) => {
								setCustomersPerPage(Number(event.target.value));
								setCurrentPage(1);
							}}
							className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
						>
							<option value={5}>5 / page</option>
							<option value={10}>10 / page</option>
							<option value={20}>20 / page</option>
						</select>

						<Button variant="outline" size="small" onClick={refetch}>
							{isFetching ? "Refreshing..." : "Refresh"}
						</Button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-xs">
						<thead>
							<tr className="bg-gray-100 border-b border-gray-200">
								<th className="text-center py-3 px-4 font-semibold text-gray-700">Sl</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Customer Name</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Mobile</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Address</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Trade License</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-700">Drug License</th>
								<th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
								<th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
							</tr>
						</thead>
						<tbody>
							{currentCustomers.length === 0 ? (
								<tr>
									<td colSpan="9" className="text-center py-8 text-gray-500">
										No pending customers found.
									</td>
								</tr>
							) : (
								currentCustomers.map((customer, index) => (
									<tr key={customer._id} className="border-b border-gray-200 hover:bg-gray-50">
										<td className="text-center py-3 px-4">{startIndex + index + 1}</td>
										<td className="text-left py-3 px-4">{customer.customerName || "-"}</td>
										<td className="text-left py-3 px-4">{customer.mobile || "-"}</td>
										<td className="text-left py-3 px-4">{customer.email || "-"}</td>
										<td className="text-left py-3 px-4 max-w-xs truncate" title={customer.address || ""}>
											{customer.address || "-"}
										</td>
										<td className="text-left py-3 px-4">{customer.tradeLicense || "-"}</td>
										<td className="text-left py-3 px-4">{customer.drugLicense || "-"}</td>
										<td className="text-center py-3 px-4">
											{getDisplayStatus(customer) === "approved" ? (
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
													approved
												</span>										) : getDisplayStatus(customer) === "active" ? (
											<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
												active
											</span>											) : (
												<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 capitalize">
													pending
												</span>
											)}
										</td>
										<td className="text-center py-3 px-4">
											<Button
												variant="outline"
												size="small"
												onClick={() => openDetailsModal(customer)}
											>
												Details
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</Card>

			{filteredCustomers.length > 0 && (
				<Card className="mt-6">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="text-sm text-neutral-600">
							Page {currentPage} of {totalPages}
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="small"
								disabled={currentPage === 1}
								onClick={() => changePage(currentPage - 1)}
								icon={BsArrowLeftSquareFill}
							>
								Previous
							</Button>

							<div className="flex gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const pageStart = Math.max(1, Math.min(totalPages - 4, currentPage - 2));
									const pageNum = pageStart + i;

									if (pageNum > totalPages) return null;

									return (
										<Button
											key={pageNum}
											variant={currentPage === pageNum ? "primary" : "outline"}
											size="small"
											onClick={() => changePage(pageNum)}
										>
											{pageNum}
										</Button>
									);
								})}
							</div>

							<Button
								variant="outline"
								size="small"
								disabled={currentPage === totalPages}
								onClick={() => changePage(currentPage + 1)}
								icon={BsArrowRightSquareFill}
								iconPosition="right"
							>
								Next
							</Button>
						</div>
					</div>
				</Card>
			)}

			{selectedCustomer && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/40" onClick={closeDetailsModal}></div>
					<div className="relative bg-white w-full max-w-3xl rounded-xl shadow-xl max-h-[85vh] overflow-y-auto">
						<div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
							<button
								type="button"
								onClick={closeDetailsModal}
								className="text-gray-500 hover:text-gray-700 text-xl leading-none"
							>
								x
							</button>
						</div>

						<div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-gray-500">Customer Name</p>
								<p className="font-medium text-gray-800">{selectedCustomer.customerName || "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Mobile</p>
								<p className="font-medium text-gray-800">{selectedCustomer.mobile || "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Email</p>
								<p className="font-medium text-gray-800">{selectedCustomer.email || "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Contact Person</p>
								<p className="font-medium text-gray-800">{selectedCustomer.contactPerson || "-"}</p>
							</div>
							<div className="md:col-span-2">
								<p className="text-gray-500">Address</p>
								<p className="font-medium text-gray-800">{selectedCustomer.address || "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Trade License</p>
								<p className="font-medium text-gray-800">{selectedCustomer.tradeLicense || "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Drug License</p>
								<p className="font-medium text-gray-800">{selectedCustomer.drugLicense || "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Credit Limit</p>
								<p className="font-medium text-gray-800">{selectedCustomer.creditLimit ?? "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Day Limit</p>
								<p className="font-medium text-gray-800">{selectedCustomer.dayLimit ?? "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Discount</p>
								<p className="font-medium text-gray-800">{selectedCustomer.discount ?? "-"}%</p>
							</div>
							<div>
								<p className="text-gray-500">Pay Mode</p>
								<p className="font-medium text-gray-800">
									{Array.isArray(selectedCustomer.payMode) && selectedCustomer.payMode.length > 0
										? selectedCustomer.payMode.join(", ")
										: "-"}
								</p>
							</div>
							<div>
								<p className="text-gray-500">Current Level</p>
								<p className="font-medium text-gray-800">{selectedCustomer?.approvalStatus?.currentLevel || "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Added By</p>
								<p className="font-medium text-gray-800">{selectedCustomer?.addedBy?.email || "-"}</p>
							</div>
							<div className="md:col-span-2">
								<p className="text-gray-500">Status</p>
								{getDisplayStatus(selectedCustomer) === "approved" ? (
									<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
										approved
									</span>
								) : getDisplayStatus(selectedCustomer) === "active" ? (
									<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
										active
									</span>
								) : (
									<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 capitalize">
										pending
									</span>
								)}
							</div>
						</div>

						<div className="border-t border-gray-200 px-5 py-4 flex items-center justify-end gap-3">
							<Button variant="outline" onClick={closeDetailsModal}>
								Close
							</Button>
							{getDisplayStatus(selectedCustomer) === "approved" ? (
								<Button
									variant="primary"
									onClick={activateSelectedCustomer}
									disabled={isActivating || userRole !== "md"}
									title={userRole !== "md" ? "Only Managing Director can activate customers" : ""}
								>
									{isActivating ? "Activating..." : "Activate"}
								</Button>
							) : (
								<Button
									variant="primary"
									onClick={approveSelectedCustomer}
									disabled={getDisplayStatus(selectedCustomer) !== "pending" || isApproving || !canApprove(selectedCustomer?.approvalStatus?.currentLevel)}
									title={!canApprove(selectedCustomer?.approvalStatus?.currentLevel) ? `Requires ${levelToRoleMap[selectedCustomer?.approvalStatus?.currentLevel]?.toUpperCase()} role` : ""}
								>
									{getDisplayStatus(selectedCustomer) === "active"
										? "Active"
										: isApproving
											? "Approving..."
											: "Approve"}
								</Button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomerList;
