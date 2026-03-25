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
	useCreateAreaMutation,
	useGetAllAreasQuery,
	useGetAllAreaManagersQuery,
	useUpdateAreaMutation,
} from "../../../redux/features/areas/areaApi";
import { useGetZonesQuery } from "../../../redux/features/zones/zoneAPI";
import {
	areaCreatePayloadExample,
} from "../hierarchyMockData";

const toArray = (value) => (Array.isArray(value) ? value : []);

const formatList = (items = []) => {
	const normalizedItems = items.filter(Boolean);
	return normalizedItems.length ? normalizedItems.join(", ") : "-";
};

const renderCompactList = (items = [], emptyText = "-") => {
	const normalized = toArray(items).filter(Boolean);

	if (!normalized.length) {
		return <span className="text-gray-400">{emptyText}</span>;
	}

	const previewItems = normalized.slice(0, 2);
	const remainingCount = normalized.length - previewItems.length;

	return (
		<div className="flex flex-wrap items-center gap-1" title={normalized.join(", ")}>
			{previewItems.map((item, index) => (
				<span
					key={`${item}-${index}`}
					className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium"
				>
					{item}
				</span>
			))}
			{remainingCount > 0 && (
				<span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs font-medium">
					+{remainingCount} more
				</span>
			)}
		</div>
	);
};

const normalizeInputList = (value) => {
	if (Array.isArray(value)) {
		return value;
	}

	if (value && typeof value === "object") {
		return Object.values(value);
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return [];

		if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
			try {
				const parsed = JSON.parse(trimmed);
				if (Array.isArray(parsed)) {
					return parsed;
				}
			} catch {
				return [];
			}
		}

		if (trimmed.includes(",")) {
			return trimmed
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
		}

		return [trimmed];
	}

	return [];
};

const getNonEmptyArray = (...values) => {
	for (const value of values) {
		const arr = toArray(value).filter(Boolean);
		if (arr.length) {
			return arr;
		}
	}
	return [];
};

const getItemName = (item, keys = []) => {
	if (!item) return "";
	if (typeof item === "string" || typeof item === "number") {
		return String(item);
	}

	for (const key of keys) {
		const value = item?.[key];
		if (typeof value === "string" || typeof value === "number") {
			return String(value);
		}
	}

	return "";
};

const flattenDeep = (items = []) => {
	const result = [];
	const stack = [...items];

	while (stack.length) {
		const item = stack.shift();
		if (Array.isArray(item)) {
			stack.unshift(...item);
		} else {
			result.push(item);
		}
	}

	return result;
};

const extractUniqueNames = (items = [], keys = []) => {
	const names = flattenDeep(items)
		.map((item) => getItemName(item, keys))
		.filter(Boolean);

	return [...new Set(names)];
};

const normalizeArea = (area, index) => {
	const rawTerritories = toArray(area?.territories ?? area?.territoryList);
	const topLevelTerritories = normalizeInputList(
		area?.allTerritories ??
			area?.all_territories ??
			area?.territoryNames ??
			area?.allTerritoryNames
	);
	const territories = getNonEmptyArray(rawTerritories, topLevelTerritories);

	const rawMarketPoints = toArray(area?.marketPoints ?? area?.marketPointList);
	const territoryMarketPoints = rawTerritories.flatMap((territory) =>
		toArray(territory?.marketPoints ?? territory?.marketPointList)
	);
	const topLevelMarketPoints = normalizeInputList(
		area?.allMarketPoints ??
			area?.all_market_points ??
			area?.marketPointNames ??
			area?.allMarketPointNames
	);
	const marketPoints = getNonEmptyArray(
		rawMarketPoints,
		territoryMarketPoints,
		topLevelMarketPoints
	);

	const allTerritoryNames = getNonEmptyArray(
		extractUniqueNames(topLevelTerritories, [
			"territoryName",
			"name",
			"label",
			"title",
			"territory",
		]),
		extractUniqueNames(territories, [
			"territoryName",
			"name",
			"label",
			"title",
			"territory",
		])
	);
	const allMarketPointNames = getNonEmptyArray(
		extractUniqueNames(topLevelMarketPoints, [
			"name",
			"marketPointName",
			"label",
			"title",
			"market",
		]),
		extractUniqueNames(marketPoints, [
			"name",
			"marketPointName",
			"label",
			"title",
			"market",
		])
	);

	const areaManagerName =
		area?.areaManagerName ||
		area?.area_manager_name ||
		area?.areaManager?.name ||
		area?.managerName ||
		(typeof area?.areaManager === "string" ? area.areaManager : "-");

	const areaManagerId =
		area?.areaManagerId ||
		area?.areaManager?._id ||
		"";

	const zoneId = area?.zoneId || area?.zone?._id || "";
	const zoneName = area?.zoneName || area?.zone?.zoneName || area?.zone?.name || "";

	return {
		id: area?._id || area?.id || area?.areaName || area?.name || `area-${index}`,
		areaName: area?.areaName || area?.name || "",
		zoneId,
		zoneName,
		areaManagerId,
		areaManagerName,
		territories,
		marketPoints,
		allTerritoryNames,
		allMarketPointNames,
	};
};

const Areas = () => {
	const [activeTab, setActiveTab] = useState("list");
	const [areas, setAreas] = useState([]);
	const [detailsAreaId, setDetailsAreaId] = useState("");
	const [selectedAreaId, setSelectedAreaId] = useState("");
	const [filters, setFilters] = useState({
		searchName: "",
		zoneId: "",
		areaManagerId: "",
	});
	const [formData, setFormData] = useState({
		areaName: "",
		zoneId: "",
		areaManagerId: "",
	});
	const [errors, setErrors] = useState({
		areaName: "",
		zoneId: "",
		areaManagerId: "",
	});
	const [updateFormData, setUpdateFormData] = useState({
		areaName: "",
		zoneId: "",
		areaManagerId: "",
	});
	const [updateErrors, setUpdateErrors] = useState({
		areaName: "",
		zoneId: "",
		areaManagerId: "",
	});

	const { data: areasResponse, isLoading, isError } = useGetAllAreasQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const { data: zonesResponse } = useGetZonesQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const { data: areaManagersResponse } = useGetAllAreaManagersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const [createAreaMutation, { isLoading: isCreatingArea }] = useCreateAreaMutation();
	const [updateAreaMutation, { isLoading: isUpdatingArea }] = useUpdateAreaMutation();

	useEffect(() => {
		if (areasResponse?.success === false) {
			setAreas([]);
			return;
		}

		const rawAreas = Array.isArray(areasResponse)
			? areasResponse
			: Array.isArray(areasResponse?.data)
				? areasResponse.data
				: Array.isArray(areasResponse?.data?.data)
					? areasResponse.data.data
					: [];

		if (!rawAreas.length) {
			setAreas([]);
			return;
		}

		setAreas(rawAreas.map((area, index) => normalizeArea(area, index)));
	}, [areasResponse]);

	const apiZones = useMemo(() => {
		const rawZones = Array.isArray(zonesResponse)
			? zonesResponse
			: Array.isArray(zonesResponse?.data)
				? zonesResponse.data
				: Array.isArray(zonesResponse?.data?.data)
					? zonesResponse.data.data
					: [];
		return rawZones
			.map((zone) => ({
				id: zone?._id || zone?.id || "",
				name: zone?.zoneName || zone?.name || "",
			}))
			.filter((zone) => zone.id && zone.name);
	}, [zonesResponse]);

	const zoneOptions = useMemo(() => {
		return apiZones.map((zone) => ({
			label: zone.name,
			value: zone.id,
		}));
	}, [apiZones]);

	const zoneById = useMemo(() => {
		return zoneOptions.reduce((acc, zone) => {
			acc[zone.value] = zone.label;
			return acc;
		}, {});
	}, [zoneOptions]);

	const areaManagerApiList = useMemo(() => {
		return Array.isArray(areaManagersResponse?.data)
			? areaManagersResponse.data
			: [];
	}, [areaManagersResponse]);

	const areaManagerById = useMemo(() => {
		return areaManagerApiList.reduce((acc, manager) => {
			const id = manager?.areaManagerId || manager?._id || manager?.id;
			if (!id) return acc;
			acc[id] = manager;
			return acc;
		}, {});
	}, [areaManagerApiList]);

	const areaManagerOptions = useMemo(() => {
		return areaManagerApiList
			.map((manager) => {
				const id = manager?.areaManagerId || manager?._id || manager?.id;
				const name = manager?.areaManagerName || manager?.name;
				if (!id || !name) return null;
				return {
					label: name,
					value: id,
				};
			})
			.filter(Boolean);
	}, [areaManagerApiList]);

	const allAreaRows = useMemo(() => {
		return areas.map((area) => {
			const areaManager =
				area.areaManagerName ||
				areaManagerById[area.areaManagerId]?.areaManagerName ||
				areaManagerById[area.areaManagerId]?.name ||
				area.areaManagerId ||
				"-";

			return {
				...area,
				zoneName: area.zoneName || zoneById[area.zoneId] || "-",
				areaManager,
				allTerritories: formatList(area.allTerritoryNames),
				allMarketPoints: formatList(area.allMarketPointNames),
			};
		});
	}, [areas, areaManagerById, zoneById]);

	const filteredAreaRows = useMemo(() => {
		return allAreaRows.filter((area) => {
			const matchesName = area.areaName
				.toLowerCase()
				.includes(filters.searchName.toLowerCase().trim());
			const matchesZone = filters.zoneId ? area.zoneId === filters.zoneId : true;
			const matchesManager = filters.areaManagerId
				? area.areaManagerId === filters.areaManagerId
				: true;

			return matchesName && matchesZone && matchesManager;
		});
	}, [allAreaRows, filters]);

	const tableData = useMemo(() => {
		return filteredAreaRows.map((area, index) => ({
			...area,
			slNo: index + 1,
		}));
	}, [filteredAreaRows]);

	const selectedArea = useMemo(() => {
		return areas.find((area) => area.id === selectedAreaId) || null;
	}, [areas, selectedAreaId]);

	const detailsArea = useMemo(() => {
		return areas.find((area) => area.id === detailsAreaId) || null;
	}, [areas, detailsAreaId]);

	const detailsTerritoryBlocks = useMemo(() => {
		const territories = toArray(detailsArea?.territories);
		return territories.map((territory, territoryIndex) => ({
			id:
				territory?._id ||
				territory?.id ||
				`${detailsArea?.id}-territory-${territoryIndex}`,
			territoryName:
				getItemName(territory, ["territoryName", "name", "label", "title"]) ||
				`Territory ${territoryIndex + 1}`,
			marketPoints: extractUniqueNames(
				territory?.marketPoints ?? territory?.marketPointList ?? [],
				["name", "marketPointName", "label", "title"]
			),
		}));
	}, [detailsArea]);

	const columns = (isUpdateMode = false) => [
		{
			key: "slNo",
			label: isUpdateMode ? "Select (Sl No)" : "Sl No",
			render: (value, row) => {
				if (!isUpdateMode) return value;

				const isSelected = row.id === selectedAreaId;
				return (
					<button
						type="button"
						onClick={() => handleSelectArea(row.id)}
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
		{ key: "areaName", label: "Area Name" },
		{ key: "zoneName", label: "Zone" },
		{
			key: "allTerritories",
			label: "All Territories",
			render: (_, row) => renderCompactList(row.allTerritoryNames),
		},
		{
			key: "allMarketPoints",
			label: "All Market Points",
			render: (_, row) => renderCompactList(row.allMarketPointNames),
		},
		{
			key: "areaManager",
			label: "Area Manager",
			render: (value) =>
				value && value !== "-" ? (
					<span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
						{value}
					</span>
				) : (
					<span className="text-gray-400">-</span>
				),
		},
		{
			key: "details",
			label: "Details",
			render: (_, row) => {
				const isOpen = row.id === detailsAreaId;
				return (
					<button
						type="button"
						onClick={() => setDetailsAreaId(isOpen ? "" : row.id)}
						className={`px-3 py-1 rounded-md text-xs font-semibold border ${
							isOpen
								? "bg-blue-600 text-white border-blue-600"
								: "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
						}`}
					>
						{isOpen ? "Hide Details" : "Show Details"}
					</button>
				);
			},
		},
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
			areaName: "",
			zoneId: "",
			areaManagerId: "",
		};

		if (!formData.areaName.trim()) {
			nextErrors.areaName = "Area name is required";
		}

		if (!formData.zoneId) {
			nextErrors.zoneId = "Please select a zone";
		}

		setErrors(nextErrors);
		return !nextErrors.areaName && !nextErrors.zoneId;
	};

	const handleCreateArea = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		const payload = {
			areaName: formData.areaName.trim(),
			zoneId: formData.zoneId,
			...(formData.areaManagerId ? { areaManagerId: formData.areaManagerId } : {}),
		};

		try {
			await createAreaMutation(payload).unwrap();
			toast.success("Area created successfully");
			setFormData({ areaName: "", zoneId: "", areaManagerId: "" });
			setErrors({ areaName: "", zoneId: "", areaManagerId: "" });
			setActiveTab("list");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const handleSelectArea = (areaId) => {
		const area = areas.find((item) => item.id === areaId);
		if (!area) return;

		setSelectedAreaId(areaId);
		setUpdateFormData({
			areaName: area.areaName,
			zoneId: area.zoneId,
			areaManagerId: area.areaManagerId || "",
		});
		setUpdateErrors({ areaName: "", zoneId: "", areaManagerId: "" });
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
			areaName: "",
			zoneId: "",
			areaManagerId: "",
		};

		if (!updateFormData.areaName.trim()) {
			nextErrors.areaName = "Area name is required";
		}

		if (!updateFormData.zoneId) {
			nextErrors.zoneId = "Please select a zone";
		}

		setUpdateErrors(nextErrors);
		return !nextErrors.areaName && !nextErrors.zoneId;
	};

	const handleUpdateArea = async (event) => {
		event.preventDefault();

		if (!selectedArea) {
			toast.warning("Select an area by clicking serial number first");
			return;
		}

		if (!validateUpdateForm()) {
			return;
		}

		const nextAreaName = updateFormData.areaName.trim();
		const nextZoneId = updateFormData.zoneId;
		const nextAreaManagerId = String(updateFormData.areaManagerId || "").trim();
		const hadPreviousManager = Boolean(selectedArea.areaManagerId);
		const managerWasCleared = !nextAreaManagerId && hadPreviousManager;

		if (
			nextAreaName === selectedArea.areaName &&
			nextZoneId === selectedArea.zoneId &&
			!managerWasCleared &&
			nextAreaManagerId === (selectedArea.areaManagerId || "")
		) {
			toast.info("No changes detected to update");
			return;
		}

		const payload = {
			id: selectedArea.id,
			areaName: nextAreaName,
			zoneId: nextZoneId,
		};

		if (nextAreaManagerId) {
			payload.areaManagerId = nextAreaManagerId;
		}

		try {
			await updateAreaMutation(payload).unwrap();
			toast.success("Area updated successfully");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const renderListSection = (isUpdateMode = false) => (
		<>
			{isLoading && <p className="text-sm text-gray-500 mb-4">Loading areas...</p>}
			{isError && (
				<p className="text-sm text-red-600 mb-4">
					Failed to load areas from API. Showing available local data.
				</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
				<FormInput
					label="Area Name"
					placeholder="Search area name"
					value={filters.searchName}
					onChange={(event) =>
						setFilters((prev) => ({ ...prev, searchName: event.target.value }))
					}
				/>

				<FormSelect
					label="Zone"
					placeholder="All zones"
					options={zoneOptions}
					value={filters.zoneId}
					onChange={(event) =>
						setFilters((prev) => ({ ...prev, zoneId: event.target.value }))
					}
				/>

				<FormSelect
					label="Area Manager"
					placeholder="All area managers"
					options={areaManagerOptions}
					value={filters.areaManagerId}
					onChange={(event) =>
						setFilters((prev) => ({ ...prev, areaManagerId: event.target.value }))
					}
				/>
			</div>

			<div className="mb-4 flex justify-end">
				<Button
					variant="secondary"
					size="small"
					onClick={() =>
						setFilters({ searchName: "", zoneId: "", areaManagerId: "" })
					}
				>
					Clear Filters
				</Button>
			</div>

			{isUpdateMode && (
				<p className="text-xs text-blue-700 mb-3">
					Click the Sl No button from any row to select that area for update.
				</p>
			)}

			<Table
				columns={columns(isUpdateMode)}
				data={tableData}
				striped
				hover
				emptyMessage={
					isLoading
						? "Loading areas..."
						: "No areas found for selected filters"
				}
			/>

			{detailsArea && (
				<div className="mt-6 border border-slate-200 rounded-xl bg-white shadow-sm">
					<div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-t-xl">
						<div>
							<p className="text-sm font-semibold text-slate-900">
								Area Details: {detailsArea.areaName || "-"}
							</p>
							<p className="text-xs text-slate-500">
								Detailed view of territories and market points
							</p>
						</div>
						<button
							type="button"
							onClick={() => setDetailsAreaId("")}
							className="px-3 py-1 rounded-md text-xs font-semibold border bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
						>
							Close
						</button>
					</div>

					<div className="p-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
							<div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
								<p className="text-xs text-blue-700 font-medium">Zone</p>
								<p className="text-sm font-semibold text-blue-900 mt-1">{detailsArea.zoneName || zoneById[detailsArea.zoneId] || "-"}</p>
							</div>
							<div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
								<p className="text-xs text-blue-700 font-medium">Area Manager</p>
								<p className="text-sm font-semibold text-blue-900 mt-1">{detailsArea.areaManagerName || "-"}</p>
							</div>
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-600 font-medium">Total Territories</p>
								<p className="text-lg font-bold text-slate-900 mt-1">{toArray(detailsArea.allTerritoryNames).length}</p>
							</div>
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-600 font-medium">Total Market Points</p>
								<p className="text-lg font-bold text-slate-900 mt-1">{toArray(detailsArea.allMarketPointNames).length}</p>
							</div>
						</div>

						<div className="overflow-x-auto rounded-lg border border-slate-200">
							<table className="w-full text-sm">
								<thead className="bg-slate-50">
									<tr>
										<th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Territory</th>
										<th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Market Points</th>
									</tr>
								</thead>
								<tbody>
									{detailsTerritoryBlocks.length ? (
										detailsTerritoryBlocks.map((territory) => (
											<tr key={territory.id} className="border-t border-slate-100">
												<td className="px-3 py-2 align-top text-slate-700">{territory.territoryName}</td>
												<td className="px-3 py-2 align-top">
													<div className="flex flex-wrap gap-1">
														{territory.marketPoints.length ? (
															territory.marketPoints.map((marketPoint, marketPointIndex) => (
																<span
																	key={`${territory.id}-mp-${marketPointIndex}`}
																	className="inline-flex items-center rounded-full bg-violet-50 text-violet-700 px-2 py-0.5 text-xs font-medium"
																>
																	{marketPoint}
																</span>
															))
														) : (
															<span className="text-slate-400">-</span>
														)}
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={2} className="px-3 py-6 text-center text-slate-400">
												No territory details available for this area
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
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
								<span className="text-gray-900 font-bold">AREAS</span>
							</h2>
						</div>
					</div>
					<div className="text-sm text-neutral-500 mr-2">
						Total Records: {allAreaRows.length}
					</div>
				</div>
			</Card>

			<Card className="mb-6" padding="md">
				<div className="flex flex-wrap items-center gap-3">
					<Button
						variant={activeTab === "list" ? "primary" : "outline"}
						onClick={() => setActiveTab("list")}
					>
						All Areas List
					</Button>
					<Button
						variant={activeTab === "create" ? "primary" : "outline"}
						onClick={() => setActiveTab("create")}
					>
						Create New Area
					</Button>
					<Button
						variant={activeTab === "update" ? "primary" : "outline"}
						onClick={() => setActiveTab("update")}
					>
						Update Area
					</Button>
				</div>
			</Card>

			{activeTab === "list" ? (
				<Card
					title="All Areas"
					subtitle={`Showing ${filteredAreaRows.length} of ${allAreaRows.length} records`}
				>
					{renderListSection(false)}
				</Card>
			) : activeTab === "create" ? (
				<Card
					title="Create Area"
					subtitle="Create payload with area name, zone id and optional area manager id"
				>
					<form onSubmit={handleCreateArea} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
							<FormInput
								label="Area Name"
								placeholder="Enter area name"
								value={formData.areaName}
								onChange={(event) =>
									handleFormChange("areaName", event.target.value)
								}
								required
								error={errors.areaName}
							/>

							<FormSelect
								label="Zone"
								placeholder="Select zone"
								options={zoneOptions}
								value={formData.zoneId}
								onChange={(event) => handleFormChange("zoneId", event.target.value)}
								required
								error={errors.zoneId}
							/>

							<FormSelect
								label="Area Manager"
								placeholder="Select area manager"
								options={areaManagerOptions}
								value={formData.areaManagerId}
								onChange={(event) =>
									handleFormChange("areaManagerId", event.target.value)
								}
								error={errors.areaManagerId}
							/>
						</div>

						<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-sm font-semibold text-gray-700 mb-2">Payload preview</p>
							<pre className="text-sm text-gray-700 whitespace-pre-wrap">
								{JSON.stringify(
									{
										areaName: formData.areaName || areaCreatePayloadExample.areaName,
										zoneId: formData.zoneId || areaCreatePayloadExample.zoneId,
										...(formData.areaManagerId
											? { areaManagerId: formData.areaManagerId }
											: {}),
									},
									null,
									2
								)}
							</pre>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button type="submit" variant="primary" disabled={isCreatingArea}>
								Create Area
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setFormData({ areaName: "", zoneId: "", areaManagerId: "" });
									setErrors({ areaName: "", zoneId: "", areaManagerId: "" });
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
						title="Update Area"
						subtitle={`Showing ${filteredAreaRows.length} of ${allAreaRows.length} records`}
					>
						{renderListSection(true)}
					</Card>

					<Card
						className="mt-6"
						title="Edit Selected Area"
						subtitle={
							selectedArea
								? `Selected: ${selectedArea.areaName}`
								: "Select a row from the list first"
						}
					>
						<form onSubmit={handleUpdateArea} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
								<FormInput
									label="Area Name"
									placeholder="Enter area name"
									value={updateFormData.areaName}
									onChange={(event) =>
										handleUpdateFormChange("areaName", event.target.value)
									}
									disabled={!selectedArea}
									error={updateErrors.areaName}
								/>

								<FormSelect
									label="Zone"
									placeholder="Select zone"
									options={zoneOptions}
									value={updateFormData.zoneId}
									onChange={(event) =>
										handleUpdateFormChange("zoneId", event.target.value)
									}
									disabled={!selectedArea}
									error={updateErrors.zoneId}
								/>

								<FormSelect
									label="Area Manager"
									placeholder="Select area manager"
									options={areaManagerOptions}
									value={updateFormData.areaManagerId}
									onChange={(event) =>
										handleUpdateFormChange("areaManagerId", event.target.value)
									}
									disabled={!selectedArea}
									error={updateErrors.areaManagerId}
								/>
							</div>

							{selectedArea && (
								<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
									<p className="text-sm font-semibold text-gray-700 mb-2">Payload preview</p>
									<pre className="text-sm text-gray-700 whitespace-pre-wrap">
										{JSON.stringify(
											{
												areaName: updateFormData.areaName || selectedArea.areaName,
												zoneId: updateFormData.zoneId || selectedArea.zoneId,
												...(updateFormData.areaManagerId ? { areaManagerId: updateFormData.areaManagerId } : {}),
											},
											null,
											2
										)}
									</pre>
								</div>
							)}

							<div className="flex flex-wrap gap-3">
								<Button
									type="submit"
									variant="primary"
									disabled={!selectedArea || isUpdatingArea}
								>
									Update Area
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										if (!selectedArea) return;
										setUpdateFormData({
											areaName: selectedArea.areaName,
											zoneId: selectedArea.zoneId,
											areaManagerId: selectedArea.areaManagerId || "",
										});
										setUpdateErrors({
											areaName: "",
											zoneId: "",
											areaManagerId: "",
										});
									}}
									disabled={!selectedArea}
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

export default Areas;
