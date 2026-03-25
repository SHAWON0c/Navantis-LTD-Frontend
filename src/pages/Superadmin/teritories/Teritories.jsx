import React, { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import Table from "../../../component/common/Table";
import FormInput from "../../../component/common/FormInput";
import FormSelect from "../../../component/common/FormSelect";
import toast from "../../../utils/toast";
import getErrorMessage from "../../../utils/getErrorMessage";
import {
	territoryCreatePayloadExample,
} from "../hierarchyMockData";
import {
	useCreateTerritoryMutation,
	useGetAllTerritoriesQuery,
	useUpdateTerritoryMutation,
} from "../../../redux/features/teritory/territoryApi";
import { useGetAllAreasQuery } from "../../../redux/features/areas/areaApi";
import { useGetAllMarketPointsQuery } from "../../../redux/features/marketPoint/marketPointApi";

const toArray = (value) => (Array.isArray(value) ? value : []);

const formatList = (items = []) => (items.length ? items.join(", ") : "-");

const normalizeTerritory = (territory, index) => {
	const marketPoints = toArray(territory?.marketPoints ?? territory?.marketPointList);
	const allMarketPointNames = marketPoints
		.map((marketPoint) => marketPoint?.name || marketPoint?.marketPointName || "")
		.filter(Boolean);

	return {
		id:
			territory?._id ||
			territory?.id ||
			territory?.territoryName ||
			`territory-${index}`,
		territoryName: territory?.territoryName || territory?.name || "",
		areaId: territory?.areaId || territory?.area?._id || "",
		areaName: territory?.areaName || territory?.area?.areaName || territory?.area?.name || "-",
		zoneName: territory?.zoneName || territory?.zone?.zoneName || territory?.zone?.name || "-",
		areaManagerName:
			territory?.areaManagerName ||
			territory?.areaManager?.name ||
			territory?.areaManager ||
			"-",
		zonalManagerName:
			territory?.zonalManagerName ||
			territory?.zonalManager?.name ||
			territory?.zonalManager ||
			"-",
		marketPoints,
		allMarketPointNames,
	};
};

const Teritories = () => {
	const [activeTab, setActiveTab] = useState("list");
	const [territories, setTerritories] = useState([]);
	const [selectedTerritoryId, setSelectedTerritoryId] = useState("");
	const [filters, setFilters] = useState({
		searchName: "",
		areaId: "",
	});
	const [formData, setFormData] = useState({
		territoryName: "",
		areaId: "",
	});
	const [errors, setErrors] = useState({
		territoryName: "",
		areaId: "",
	});
	const [updateFormData, setUpdateFormData] = useState({
		territoryName: "",
		areaId: "",
	});
	const [updateErrors, setUpdateErrors] = useState({
		territoryName: "",
		areaId: "",
	});

	const { data: territoriesResponse, isLoading, isError } = useGetAllTerritoriesQuery(
		undefined,
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);
	const { data: areasResponse } = useGetAllAreasQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const { data: marketPointsResponse } = useGetAllMarketPointsQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const [createTerritoryMutation, { isLoading: isCreatingTerritory }] =
		useCreateTerritoryMutation();
	const [updateTerritoryMutation, { isLoading: isUpdatingTerritory }] =
		useUpdateTerritoryMutation();

	useEffect(() => {
		if (territoriesResponse?.success === false) {
			setTerritories([]);
			return;
		}

		const rawTerritories = Array.isArray(territoriesResponse)
			? territoriesResponse
			: Array.isArray(territoriesResponse?.data)
				? territoriesResponse.data
				: Array.isArray(territoriesResponse?.data?.data)
					? territoriesResponse.data.data
					: [];

		if (!rawTerritories.length) {
			setTerritories([]);
			return;
		}

		setTerritories(rawTerritories.map((territory, index) => normalizeTerritory(territory, index)));
	}, [territoriesResponse]);

	const areaApiList = useMemo(() => {
		return Array.isArray(areasResponse)
			? areasResponse
			: Array.isArray(areasResponse?.data)
				? areasResponse.data
				: Array.isArray(areasResponse?.data?.data)
					? areasResponse.data.data
					: [];
	}, [areasResponse]);

	const areaOptions = useMemo(() => {
		return areaApiList
			.map((area) => ({
				label: area?.areaName || area?.name || "",
				value: area?._id || area?.id || "",
			}))
			.filter((area) => area.label && area.value);
	}, [areaApiList]);

	const marketPointsList = useMemo(() => {
		return Array.isArray(marketPointsResponse)
			? marketPointsResponse
			: Array.isArray(marketPointsResponse?.data)
				? marketPointsResponse.data
				: Array.isArray(marketPointsResponse?.data?.data)
					? marketPointsResponse.data.data
					: [];
	}, [marketPointsResponse]);

	const marketPointsByTerritory = useMemo(() => {
		return marketPointsList.reduce((acc, marketPoint) => {
			const territoryId = marketPoint?.territoryId || marketPoint?.territory?._id;
			if (territoryId) {
				if (!acc[territoryId]) {
					acc[territoryId] = [];
				}
				acc[territoryId].push({
					id: marketPoint?._id || marketPoint?.id,
					name: marketPoint?.marketPointName || marketPoint?.name,
					territoryId,
					territoryName: marketPoint?.territoryName,
					areaName: marketPoint?.areaName,
					zoneName: marketPoint?.zoneName,
				});
			}
			return acc;
		}, {});
	}, [marketPointsList]);

	const allTerritoryRows = useMemo(() => {
		return territories.map((territory) => {
			// Merge API market points with territory market points
			const apiMarketPoints = marketPointsByTerritory[territory.id] || [];
			const territoryMarketPoints = toArray(territory?.marketPoints);
			const allMarketPoints = [...apiMarketPoints, ...territoryMarketPoints];
			const uniqueMarketPoints = allMarketPoints
				.filter((mp, index, self) => 
					index === self.findIndex(m => (m.id || m._id) === (mp.id || mp._id))
				);
			const marketPointNames = uniqueMarketPoints
				.map(mp => mp.name || mp.marketPointName || "")
				.filter(Boolean);

			return {
				...territory,
				areaName: territory.areaName || "-",
				zoneName: territory.zoneName || "-",
				areaManager: territory.areaManagerName || "-",
				zonalManager: territory.zonalManagerName || "-",
				allMarketPoints: formatList(marketPointNames),
			};
		});
	}, [territories, marketPointsByTerritory]);

	const filteredTerritoryRows = useMemo(() => {
		return allTerritoryRows.filter((territory) => {
			const matchesName = territory.territoryName
				.toLowerCase()
				.includes(filters.searchName.toLowerCase().trim());
			const matchesArea = filters.areaId ? territory.areaId === filters.areaId : true;

			return matchesName && matchesArea;
		});
	}, [allTerritoryRows, filters]);

	const tableData = useMemo(() => {
		return filteredTerritoryRows.map((territory, index) => ({
			...territory,
			slNo: index + 1,
		}));
	}, [filteredTerritoryRows]);

	const selectedTerritory = useMemo(() => {
		return territories.find((territory) => territory.id === selectedTerritoryId) || null;
	}, [territories, selectedTerritoryId]);

	const columns = (isUpdateMode = false) => [
		{
			key: "slNo",
			label: isUpdateMode ? "Select (Sl No)" : "Sl No",
			render: (value, row) => {
				if (!isUpdateMode) return value;

				const isSelected = row.id === selectedTerritoryId;
				return (
					<button
						type="button"
						onClick={() => handleSelectTerritory(row.id)}
						className={`px-2 py-1 rounded-md border text-xs font-semibold ${
							isSelected
								? "bg-blue-600 text-white border-blue-600"
								: "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
						}`}
					>
						{value}
					</button>
				);
			},
		},
		{ key: "territoryName", label: "Territory Name" },
		{ key: "allMarketPoints", label: "All Market Points" },
		{ key: "areaName", label: "Area" },
		{ key: "zoneName", label: "Zone" },
		{ key: "areaManager", label: "Area Manager" },
		{ key: "zonalManager", label: "Zonal Manager" },
	];

	const handleFormChange = (key, value) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));

		if (errors[key]) {
			setErrors((prev) => ({
				...prev,
				[key]: "",
			}));
		}
	};

	const validateForm = () => {
		const nextErrors = {
			territoryName: "",
			areaId: "",
		};

		if (!formData.territoryName.trim()) {
			nextErrors.territoryName = "Territory name is required";
		}

		if (!formData.areaId) {
			nextErrors.areaId = "Please select an area";
		}

		setErrors(nextErrors);
		return !nextErrors.territoryName && !nextErrors.areaId;
	};

	const handleCreateTerritory = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		const payload = {
			territoryName: formData.territoryName.trim(),
			areaId: formData.areaId,
		};

		try {
			await createTerritoryMutation(payload).unwrap();
			toast.success("Territory created successfully");
			setFormData({ territoryName: "", areaId: "" });
			setErrors({ territoryName: "", areaId: "" });
			setActiveTab("list");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const handleSelectTerritory = (territoryId) => {
		const territory = territories.find((item) => item.id === territoryId);
		if (!territory) return;

		setSelectedTerritoryId(territoryId);
		setUpdateFormData({
			territoryName: territory.territoryName,
			areaId: territory.areaId,
		});
		setUpdateErrors({ territoryName: "", areaId: "" });
	};

	const handleUpdateFormChange = (key, value) => {
		setUpdateFormData((prev) => ({
			...prev,
			[key]: value,
		}));

		if (updateErrors[key]) {
			setUpdateErrors((prev) => ({
				...prev,
				[key]: "",
			}));
		}
	};

	const validateUpdateForm = () => {
		const nextErrors = {
			territoryName: "",
			areaId: "",
		};

		if (!updateFormData.territoryName.trim()) {
			nextErrors.territoryName = "Territory name is required";
		}

		if (!updateFormData.areaId) {
			nextErrors.areaId = "Please select an area";
		}

		setUpdateErrors(nextErrors);
		return !nextErrors.territoryName && !nextErrors.areaId;
	};

	const handleUpdateTerritory = async (event) => {
		event.preventDefault();

		if (!selectedTerritory) {
			toast.warning("Select a territory by clicking serial number first");
			return;
		}

		if (!validateUpdateForm()) {
			return;
		}

		const nextTerritoryName = updateFormData.territoryName.trim();
		const nextAreaId = updateFormData.areaId;

		if (
			nextTerritoryName === selectedTerritory.territoryName &&
			nextAreaId === selectedTerritory.areaId
		) {
			toast.info("No changes detected to update");
			return;
		}

		const payload = {
			id: selectedTerritory.id,
			territoryName: nextTerritoryName,
			areaId: nextAreaId,
		};

		try {
			await updateTerritoryMutation(payload).unwrap();
			toast.success("Territory updated successfully");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const renderListSection = (isUpdateMode = false) => (
		<>
			{isLoading && <p className="text-sm text-gray-500 mb-4">Loading territories...</p>}
			{isError && (
				<p className="text-sm text-red-600 mb-4">
					Failed to load territories from API. Showing available local data.
				</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
				<FormInput
					label="Territory Name"
					placeholder="Search territory name"
					value={filters.searchName}
					onChange={(event) =>
						setFilters((prev) => ({ ...prev, searchName: event.target.value }))
					}
				/>

				<FormSelect
					label="Area"
					placeholder="All areas"
					options={areaOptions}
					value={filters.areaId}
					onChange={(event) =>
						setFilters((prev) => ({ ...prev, areaId: event.target.value }))
					}
				/>
			</div>

			<div className="mb-4 flex justify-end">
				<Button
					variant="secondary"
					size="small"
					onClick={() => setFilters({ searchName: "", areaId: "" })}
				>
					Clear Filters
				</Button>
			</div>

			{isUpdateMode && (
				<p className="text-xs text-blue-700 mb-3">
					Click the Sl No button from any row to select that territory for update.
				</p>
			)}

			<Table
				columns={columns(isUpdateMode)}
				data={tableData}
				striped
				hover
				emptyMessage={
					isLoading
						? "Loading territories..."
						: "No territories found for selected filters"
				}
			/>
		</>
	);

	return (
		<div className="min-h-screen">
			<Card className="mb-6">
				<div className="flex items-center justify-between gap-4">
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
								<span>SUPERADMIN</span>
								<ChevronRight size={14} className="text-gray-400" />
								<span className="text-gray-900 font-bold">TERRITORIES</span>
							</h2>
						</div>
					</div>
					<div className="text-sm text-neutral-500 mr-2">
						Total Records: {allTerritoryRows.length}
					</div>
				</div>
			</Card>

			<Card className="mb-6" padding="md">
				<div className="flex flex-wrap items-center gap-3">
					<Button
						variant={activeTab === "list" ? "primary" : "outline"}
						onClick={() => setActiveTab("list")}
					>
						All Territories List
					</Button>
					<Button
						variant={activeTab === "create" ? "primary" : "outline"}
						onClick={() => setActiveTab("create")}
					>
						Create New Territory
					</Button>
					<Button
						variant={activeTab === "update" ? "primary" : "outline"}
						onClick={() => setActiveTab("update")}
					>
						Update Territory
					</Button>
				</div>
			</Card>

			{activeTab === "list" ? (
				<Card
					title="All Territories"
					subtitle={`Showing ${filteredTerritoryRows.length} of ${allTerritoryRows.length} records`}
				>
					{renderListSection(false)}
				</Card>
			) : activeTab === "create" ? (
				<Card
					title="Create Territory"
					subtitle="Create payload with territory name and area id"
				>
					<form onSubmit={handleCreateTerritory} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormInput
								label="Territory Name"
								placeholder="Enter territory name"
								value={formData.territoryName}
								onChange={(event) =>
									handleFormChange("territoryName", event.target.value)
								}
								required
								error={errors.territoryName}
							/>

							<FormSelect
								label="Area"
								placeholder="Select area"
								options={areaOptions}
								value={formData.areaId}
								onChange={(event) => handleFormChange("areaId", event.target.value)}
								required
								error={errors.areaId}
							/>
						</div>

						<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-sm font-semibold text-gray-700 mb-2">Payload preview</p>
							<pre className="text-sm text-gray-700 whitespace-pre-wrap">
								{JSON.stringify(
									{
										territoryName:
											formData.territoryName ||
											territoryCreatePayloadExample.territoryName,
										areaId: formData.areaId || territoryCreatePayloadExample.areaId,
									},
									null,
									2
								)}
							</pre>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button type="submit" variant="primary" disabled={isCreatingTerritory}>
								Create Territory
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setFormData({ territoryName: "", areaId: "" });
									setErrors({ territoryName: "", areaId: "" });
								}}
							>
								Reset
							</Button>
						</div>
					</form>
				</Card>
			) : (
				<>
					<Card
						title="Update Territory"
						subtitle={`Showing ${filteredTerritoryRows.length} of ${allTerritoryRows.length} records`}
					>
						{renderListSection(true)}
					</Card>

					<Card
						className="mt-6"
						title="Edit Selected Territory"
						subtitle={
							selectedTerritory
								? `Selected: ${selectedTerritory.territoryName}`
								: "Select a row from the list first"
						}
					>
						<form onSubmit={handleUpdateTerritory} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormInput
									label="Territory Name"
									placeholder="Enter territory name"
									value={updateFormData.territoryName}
									onChange={(event) =>
										handleUpdateFormChange("territoryName", event.target.value)
									}
									disabled={!selectedTerritory}
									error={updateErrors.territoryName}
								/>

								<FormSelect
									label="Area"
									placeholder="Select area"
									options={areaOptions}
									value={updateFormData.areaId}
									onChange={(event) =>
										handleUpdateFormChange("areaId", event.target.value)
									}
									disabled={!selectedTerritory}
									error={updateErrors.areaId}
								/>
							</div>

							<div className="flex flex-wrap gap-3">
								<Button
									type="submit"
									variant="primary"
									disabled={!selectedTerritory || isUpdatingTerritory}
								>
									Update Territory
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										if (!selectedTerritory) return;
										setUpdateFormData({
											territoryName: selectedTerritory.territoryName,
											areaId: selectedTerritory.areaId,
										});
										setUpdateErrors({ territoryName: "", areaId: "" });
									}}
									disabled={!selectedTerritory}
								>
									Reset Changes
								</Button>
							</div>
						</form>
					</Card>
				</>
			)}
		</div>
	);
};

export default Teritories;
