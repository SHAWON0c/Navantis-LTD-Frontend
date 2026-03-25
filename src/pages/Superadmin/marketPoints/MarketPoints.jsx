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
	createMarketPointPayloadExample,
} from "./mockMarketPointsData";
import {
	useCreateMarketPointMutation,
	useGetAllMarketPointsQuery,
	useUpdateMarketPointMutation,
} from "../../../redux/features/marketPoint/marketPointApi";
import { useGetAllTerritoriesQuery } from "../../../redux/features/teritory/territoryApi";

const EMPTY_FILTERS = {
	searchName: "",
	territoryId: "",
	areaName: "",
	zoneName: "",
	areaManager: "",
	zonalManager: "",
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizeMarketPoint = (mp, index) => {
	return {
		id:
			mp?._id ||
			mp?.id ||
			mp?.marketPointName ||
			mp?.name ||
			`market-point-${index}`,
		name: mp?.marketPointName || mp?.name || "",
		territoryId: mp?.territoryId || mp?.territory?._id || "",
		territoryName: mp?.territoryName || mp?.territory?.territoryName || mp?.territory?.name || "-",
		areaName: mp?.areaName || mp?.area?.areaName || mp?.area?.name || "-",
		zoneName: mp?.zoneName || mp?.zone?.zoneName || mp?.zone?.name || "-",
		areaManager: mp?.areaManagerName || mp?.areaManager?.name || mp?.areaManager || "-",
		zonalManager: mp?.zonalManagerName || mp?.zonalManager?.name || mp?.zonalManager || "-",
	};
};

const MarketPoints = () => {
	const [activeTab, setActiveTab] = useState("list");
	const [marketPoints, setMarketPoints] = useState([]);
	const [selectedMarketPointId, setSelectedMarketPointId] = useState("");
	const [filters, setFilters] = useState(EMPTY_FILTERS);
	const [formData, setFormData] = useState({
		name: "",
		territoryId: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		territoryId: "",
	});
	const [updateFormData, setUpdateFormData] = useState({
		name: "",
		territoryId: "",
	});
	const [updateErrors, setUpdateErrors] = useState({
		name: "",
		territoryId: "",
	});

	const { data: marketPointsResponse, isLoading, isError } = useGetAllMarketPointsQuery(
		undefined,
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);
	const { data: territoriesResponse } = useGetAllTerritoriesQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const [createMarketPointMutation, { isLoading: isCreatingMarketPoint }] =
		useCreateMarketPointMutation();
	const [updateMarketPointMutation, { isLoading: isUpdatingMarketPoint }] =
		useUpdateMarketPointMutation();

	useEffect(() => {
		if (marketPointsResponse?.success === false) {
			setMarketPoints([]);
			return;
		}

		const rawMarketPoints = Array.isArray(marketPointsResponse)
			? marketPointsResponse
			: Array.isArray(marketPointsResponse?.data)
				? marketPointsResponse.data
				: Array.isArray(marketPointsResponse?.data?.data)
					? marketPointsResponse.data.data
					: [];

		if (!rawMarketPoints.length) {
			setMarketPoints([]);
			return;
		}

		setMarketPoints(rawMarketPoints.map((mp, index) => normalizeMarketPoint(mp, index)));
	}, [marketPointsResponse]);

	const territoriesList = useMemo(() => {
		return Array.isArray(territoriesResponse)
			? territoriesResponse
			: Array.isArray(territoriesResponse?.data)
				? territoriesResponse.data
				: Array.isArray(territoriesResponse?.data?.data)
					? territoriesResponse.data.data
					: [];
	}, [territoriesResponse]);

	const territoryById = useMemo(() => {
		return territoriesList.reduce((acc, territory) => {
			const id = territory?._id || territory?.id;
			if (id) {
				acc[id] = territory;
			}
			return acc;
		}, {});
	}, [territoriesList]);

	// Market points are already normalized with all fields from API
	const enrichedMarketPoints = useMemo(() => {
		return marketPoints;
	}, [marketPoints]);

	const filteredMarketPoints = useMemo(() => {
		return enrichedMarketPoints.filter((item) => {
			const matchesName = item.name
				.toLowerCase()
				.includes(filters.searchName.toLowerCase().trim());
			const matchesTerritory = filters.territoryId
				? item.territoryId === filters.territoryId
				: true;
			const matchesArea = filters.areaName
				? item.areaName === filters.areaName
				: true;
			const matchesZone = filters.zoneName
				? item.zoneName === filters.zoneName
				: true;
			const matchesAreaManager = filters.areaManager
				? item.areaManager === filters.areaManager
				: true;
			const matchesZonalManager = filters.zonalManager
				? item.zonalManager === filters.zonalManager
				: true;

			return (
				matchesName &&
				matchesTerritory &&
				matchesArea &&
				matchesZone &&
				matchesAreaManager &&
				matchesZonalManager
			);
		});
	}, [enrichedMarketPoints, filters]);

	const tableData = useMemo(() => {
		return filteredMarketPoints.map((item, index) => ({
			...item,
			slNo: index + 1,
		}));
	}, [filteredMarketPoints]);

	const uniqueOptions = (key) => {
		const values = Array.from(
			new Set(enrichedMarketPoints.map((item) => item[key]).filter(Boolean))
		);

		return values.map((value) => ({
			label: value,
			value,
		}));
	};

	const territoryOptions = useMemo(() => {
		return territoriesList
			.map((territory) => ({
				label: territory?.territoryName || territory?.name || "",
				value: territory?._id || territory?.id || "",
			}))
			.filter((territory) => territory.label && territory.value);
	}, [territoriesList]);

	const selectedMarketPoint = useMemo(() => {
		return marketPoints.find((item) => item.id === selectedMarketPointId) || null;
	}, [marketPoints, selectedMarketPointId]);

	const columns = (isUpdateMode = false) => [
		{
			key: "slNo",
			label: isUpdateMode ? "Select (Sl No)" : "Sl No",
			render: (value, row) => {
				if (!isUpdateMode) return value;

				const isSelected = row.id === selectedMarketPointId;
				return (
					<button
						type="button"
						onClick={() => handleSelectMarketPoint(row.id)}
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
		{ key: "name", label: "Market Point Name" },
		{ key: "territoryName", label: "Territory" },
		{ key: "areaName", label: "Area" },
		{ key: "zoneName", label: "Zone" },
		{ key: "areaManager", label: "Area Manager" },
		{ key: "zonalManager", label: "Zonal Manager" },
	];

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const clearFilters = () => {
		setFilters(EMPTY_FILTERS);
	};

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
			name: "",
			territoryId: "",
		};

		if (!formData.name.trim()) {
			nextErrors.name = "Market point name is required";
		}

		if (!formData.territoryId) {
			nextErrors.territoryId = "Please select a territory";
		}

		setErrors(nextErrors);
		return !nextErrors.name && !nextErrors.territoryId;
	};

	const handleCreateMarketPoint = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		const payload = {
			name: formData.name.trim(),
			territoryId: formData.territoryId,
		};

		try {
			await createMarketPointMutation(payload).unwrap();
			toast.success("Market point created successfully");
			setFormData({ name: "", territoryId: "" });
			setErrors({ name: "", territoryId: "" });
			setActiveTab("list");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const handleSelectMarketPoint = (marketPointId) => {
		const marketPoint = marketPoints.find((item) => item.id === marketPointId);
		if (!marketPoint) return;

		setSelectedMarketPointId(marketPointId);
		setUpdateFormData({
			name: marketPoint.name,
			territoryId: marketPoint.territoryId,
		});
		setUpdateErrors({ name: "", territoryId: "" });
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
			name: "",
			territoryId: "",
		};

		if (!updateFormData.name.trim()) {
			nextErrors.name = "Market point name is required";
		}

		if (!updateFormData.territoryId) {
			nextErrors.territoryId = "Please select a territory";
		}

		setUpdateErrors(nextErrors);
		return !nextErrors.name && !nextErrors.territoryId;
	};

const handleUpdateMarketPoint = async (event) => {
		event.preventDefault();

		if (!selectedMarketPoint) {
			toast.warning("Select a market point by clicking serial number first");
			return;
		}

		if (!validateUpdateForm()) {
			return;
		}

		const nextName = updateFormData.name.trim();
		const nextTerritoryId = updateFormData.territoryId;

		if (
			nextName === selectedMarketPoint.name &&
			nextTerritoryId === selectedMarketPoint.territoryId
		) {
			toast.info("No changes detected to update");
			return;
		}

		const payload = {
			id: selectedMarketPoint.id,
			name: nextName,
			territoryId: nextTerritoryId,
		};

		try {
			await updateMarketPointMutation(payload).unwrap();
			toast.success("Market point updated successfully");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const renderListSection = (isUpdateMode = false) => (
		<>
			{isLoading && <p className="text-sm text-gray-500 mb-4">Loading market points...</p>}
			{isError && (
				<p className="text-sm text-red-600 mb-4">
					Failed to load market points from API. Showing available local data.
				</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
				<FormInput
					label="Market Point Name"
					placeholder="Search market point name"
					value={filters.searchName}
					onChange={(event) =>
						handleFilterChange("searchName", event.target.value)
					}
				/>

				<FormSelect
					label="Territory"
					placeholder="All territories"
					options={territoryOptions}
					value={filters.territoryId}
					onChange={(event) =>
						handleFilterChange("territoryId", event.target.value)
					}
				/>

				<FormSelect
					label="Area"
					placeholder="All areas"
					options={uniqueOptions("areaName")}
					value={filters.areaName}
					onChange={(event) =>
						handleFilterChange("areaName", event.target.value)
					}
				/>

				<FormSelect
					label="Zone"
					placeholder="All zones"
					options={uniqueOptions("zoneName")}
					value={filters.zoneName}
					onChange={(event) =>
						handleFilterChange("zoneName", event.target.value)
					}
				/>

				<FormSelect
					label="Area Manager"
					placeholder="All area managers"
					options={uniqueOptions("areaManager")}
					value={filters.areaManager}
					onChange={(event) =>
						handleFilterChange("areaManager", event.target.value)
					}
				/>

				<FormSelect
					label="Zonal Manager"
					placeholder="All zonal managers"
					options={uniqueOptions("zonalManager")}
					value={filters.zonalManager}
					onChange={(event) =>
						handleFilterChange("zonalManager", event.target.value)
					}
				/>
			</div>

			<div className="mb-4 flex justify-end">
				<Button variant="secondary" size="small" onClick={clearFilters}>
					Clear Filters
				</Button>
			</div>

			{isUpdateMode && (
				<p className="text-xs text-blue-700 mb-3">
					Click the Sl No button from any row to select that market point for update.
				</p>
			)}

			<Table
				columns={columns(isUpdateMode)}
				data={tableData}
				striped
				hover
				emptyMessage={
					isLoading
						? "Loading market points..."
						: "No market points found for selected filters"
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
								<span className="text-gray-900 font-bold">MARKET POINTS</span>
							</h2>
						</div>
					</div>
					<div className="text-sm text-neutral-500 mr-2">
						Total Records: {enrichedMarketPoints.length}
					</div>
				</div>
			</Card>

			<Card className="mb-6" padding="md">
				<div className="flex flex-wrap items-center gap-3">
					<Button
						variant={activeTab === "list" ? "primary" : "outline"}
						onClick={() => setActiveTab("list")}
					>
						All Market Points List
					</Button>
					<Button
						variant={activeTab === "create" ? "primary" : "outline"}
						onClick={() => setActiveTab("create")}
					>
						Create New Market Point
					</Button>
					<Button
						variant={activeTab === "update" ? "primary" : "outline"}
						onClick={() => setActiveTab("update")}
					>
						Update Market Point
					</Button>
				</div>
			</Card>

			{activeTab === "list" ? (
				<Card
					title="All Market Points"
					subtitle={`Showing ${filteredMarketPoints.length} of ${enrichedMarketPoints.length} records`}
				>
					{renderListSection(false)}
				</Card>
			) : activeTab === "create" ? (
				<Card title="Create Market Point" subtitle="Create payload with market point name and territory id">
					<form onSubmit={handleCreateMarketPoint} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormInput
								label="Market Point Name"
								placeholder="Enter market point name"
								value={formData.name}
								onChange={(event) => handleFormChange("name", event.target.value)}
								required
								error={errors.name}
							/>

							<FormSelect
								label="Territory Name"
								placeholder="Select territory"
								options={territoryOptions}
								value={formData.territoryId}
								onChange={(event) =>
									handleFormChange("territoryId", event.target.value)
								}
								required
								error={errors.territoryId}
							/>
						</div>

						<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-sm font-semibold text-gray-700 mb-2">Payload preview</p>
							<pre className="text-sm text-gray-700 whitespace-pre-wrap">
								{JSON.stringify(
									{
										name: formData.name || createMarketPointPayloadExample.name,
										territoryId:
											formData.territoryId ||
											createMarketPointPayloadExample.territoryId,
									},
									null,
									2
								)}
							</pre>
						</div>

						<div className="flex flex-wrap gap-3">
						<Button type="submit" variant="primary" disabled={isCreatingMarketPoint}>
								Create Market Point
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setFormData({ name: "", territoryId: "" });
									setErrors({ name: "", territoryId: "" });
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
						title="Update Market Point"
						subtitle={`Showing ${filteredMarketPoints.length} of ${enrichedMarketPoints.length} records`}
					>
						{renderListSection(true)}
					</Card>

					<Card
						className="mt-6"
						title="Edit Selected Market Point"
						subtitle={
							selectedMarketPoint
								? `Selected: ${selectedMarketPoint.name}`
								: "Select a row from the list first"
						}
					>
						<form onSubmit={handleUpdateMarketPoint} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormInput
									label="Market Point Name"
									placeholder="Enter market point name"
									value={updateFormData.name}
									onChange={(event) =>
										handleUpdateFormChange("name", event.target.value)
									}
									disabled={!selectedMarketPoint}
									error={updateErrors.name}
								/>

								<FormSelect
									label="Territory Name"
									placeholder="Select territory"
									options={territoryOptions}
									value={updateFormData.territoryId}
									onChange={(event) =>
										handleUpdateFormChange(
												"territoryId",
												event.target.value
											)
									}
									disabled={!selectedMarketPoint}
									error={updateErrors.territoryId}
								/>
							</div>

							<div className="flex flex-wrap gap-3">
								<Button type="submit" variant="primary" disabled={!selectedMarketPoint}>
									Update Market Point
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										if (!selectedMarketPoint) return;
										setUpdateFormData({
											name: selectedMarketPoint.name,
											territoryId: selectedMarketPoint.territoryId,
										});
										setUpdateErrors({ name: "", territoryId: "" });
									}}
									disabled={!selectedMarketPoint}
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

export default MarketPoints;
