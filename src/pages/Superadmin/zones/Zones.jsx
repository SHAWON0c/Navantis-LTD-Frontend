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
	useCreateZoneMutation,
	useGetZonesQuery,
	useGetZonalManagersQuery,
	useUpdateZoneMutation,
} from "../../../redux/features/zones/zoneAPI";
import { zoneCreatePayloadExample } from "../hierarchyMockData";

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

const toArray = (value) => (Array.isArray(value) ? value : []);

const keyHasAllTokens = (key = "", tokens = []) => {
	const normalized = String(key).toLowerCase();
	return tokens.every((token) => normalized.includes(token.toLowerCase()));
};

const findFirstValueByKeyTokens = (source, tokens = [], validator = () => true) => {
	if (!source || typeof source !== "object") {
		return undefined;
	}

	const queue = [source];

	while (queue.length) {
		const current = queue.shift();
		if (!current || typeof current !== "object") {
			continue;
		}

		for (const [key, value] of Object.entries(current)) {
			if (keyHasAllTokens(key, tokens) && validator(value)) {
				return value;
			}

			if (value && typeof value === "object") {
				queue.push(value);
			}
		}
	}

	return undefined;
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

const resolveFirstNameList = (candidates = [], keys = []) => {
	for (const candidate of candidates) {
		const names = extractUniqueNames(normalizeInputList(candidate), keys);
		if (names.length) {
			return names;
		}
	}

	return [];
};

const getManagerId = (manager) =>
	manager?.zonalManagerId || manager?._id || manager?.id || manager?.userId || "";

const getManagerName = (manager) =>
	manager?.name ||
	manager?.fullName ||
	manager?.employeeName ||
	manager?.zonalManagerName ||
	"";

const normalizeZonalManagerList = (response) => {
	const candidates = [
		response,
		response?.data,
		response?.data?.data,
		response?.result,
		response?.results,
	];

	for (const candidate of candidates) {
		if (Array.isArray(candidate)) {
			return candidate;
		}
	}

	return [];
};

const normalizeZone = (zone, index) => {
	const areas = toArray(zone?.areas ?? zone?.areaList);
	const topLevelAreas = normalizeInputList(
		zone?.allAreas ??
		zone?.all_areas ??
		zone?.areaNames ??
		zone?.allAreaNames ??
		findFirstValueByKeyTokens(zone, ["all", "area"], (value) =>
			Array.isArray(value) || typeof value === "string" || typeof value === "object"
		)
	);

	const directTerritories = toArray(zone?.territories ?? zone?.territoryList);
	const areaTerritories = areas.flatMap((area) =>
		toArray(area?.territories ?? area?.territoryList)
	);
	const topLevelTerritories = normalizeInputList(
		zone?.allTerritories ??
		zone?.all_territories ??
		zone?.territoryNames ??
		zone?.allTerritoryNames ??
		findFirstValueByKeyTokens(zone, ["all", "territor"], (value) =>
			Array.isArray(value) || typeof value === "string" || typeof value === "object"
		)
	);
	const territories = getNonEmptyArray(directTerritories, areaTerritories, topLevelTerritories);

	const directMarketPoints = toArray(zone?.marketPoints ?? zone?.marketPointList);
	const territoryMarketPoints = territories.flatMap((territory) =>
		toArray(territory?.marketPoints ?? territory?.marketPointList)
	);
	const topLevelMarketPoints = normalizeInputList(
		zone?.allMarketPoints ??
		zone?.all_market_points ??
		zone?.marketPointNames ??
		zone?.allMarketPointNames ??
		findFirstValueByKeyTokens(zone, ["all", "market"], (value) =>
			Array.isArray(value) || typeof value === "string" || typeof value === "object"
		)
	);
	const marketPoints = getNonEmptyArray(
		directMarketPoints,
		territoryMarketPoints,
		topLevelMarketPoints
	);

	const allAreaNames = getNonEmptyArray(
		resolveFirstNameList(
			[topLevelAreas, areas],
			["areaName", "name", "label", "title", "area"]
		)
	);
	const allTerritoryNames = getNonEmptyArray(
		resolveFirstNameList(
			[topLevelTerritories, territories],
			["territoryName", "name", "label", "title", "territory"]
		)
	);
	const allMarketPointNames = getNonEmptyArray(
		resolveFirstNameList(
			[topLevelMarketPoints, marketPoints],
			["name", "marketPointName", "label", "title", "market"]
		)
	);

	const zonalManagerName =
		zone?.zonalManagerName ||
		zone?.zonal_manager_name ||
		zone?.zonalManagerFullName ||
		zone?.zonalManager?.name ||
		zone?.zonalManager?.fullName ||
		zone?.zonalManager?.employeeName ||
		findFirstValueByKeyTokens(zone, ["zonal", "manager", "name"], (value) =>
			typeof value === "string" || typeof value === "number"
		) ||
		zone?.managerName ||
		(typeof zone?.zonalManager === "string" ? zone.zonalManager : "-");

	const zonalManagerId =
		zone?.zonalManagerId ||
		zone?.zonalManager?._id ||
		"";

	return {
		id: zone?._id || zone?.id || zone?.zoneName || zone?.name || `zone-${index}`,
		name: zone?.zoneName || zone?.name || "",
		zonalManagerId,
		zonalManagerName,
		areas,
		territories,
		marketPoints,
		allAreaNames,
		allTerritoryNames,
		allMarketPointNames,
	};
};

const Zones = () => {
	const [activeTab, setActiveTab] = useState("list");
	const [zones, setZones] = useState([]);
	const [detailsZoneId, setDetailsZoneId] = useState("");
	const [selectedZoneId, setSelectedZoneId] = useState("");
	const [filters, setFilters] = useState({
		searchName: "",
		zonalManagerName: "",
	});
	const [formData, setFormData] = useState({
		name: "",
		zonalManagerId: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		zonalManagerId: "",
	});
	const [updateFormData, setUpdateFormData] = useState({
		name: "",
		zonalManagerId: "",
	});
	const [updateErrors, setUpdateErrors] = useState({
		name: "",
		zonalManagerId: "",
	});
	const { data: zonesResponse, isLoading, isError } = useGetZonesQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const { data: zonalManagersResponse } = useGetZonalManagersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	});
	const [createZoneMutation, { isLoading: isCreatingZone }] = useCreateZoneMutation();
	const [updateZoneMutation, { isLoading: isUpdatingZone }] = useUpdateZoneMutation();

	useEffect(() => {
		if (zonesResponse?.success === false) {
			setZones([]);
			return;
		}

		const rawZones = Array.isArray(zonesResponse)
			? zonesResponse
			: Array.isArray(zonesResponse?.data)
				? zonesResponse.data
				: Array.isArray(zonesResponse?.data?.data)
					? zonesResponse.data.data
					: [];

		if (!rawZones.length) {
			setZones([]);
			return;
		}

		setZones(rawZones.map((zone, index) => normalizeZone(zone, index)));
	}, [zonesResponse]);

	const zonalManagerApiList = useMemo(() => {
		return normalizeZonalManagerList(zonalManagersResponse);
	}, [zonalManagersResponse]);

	const zonalManagerApiById = useMemo(() => {
		return zonalManagerApiList.reduce((acc, manager) => {
			const id = getManagerId(manager);
			if (!id) return acc;
			acc[id] = manager;
			return acc;
		}, {});
	}, [zonalManagerApiList]);

	const allZoneRows = useMemo(() => {
		return zones.map((zone) => {
			const zonalManagerName =
				zone.zonalManagerName ||
				getManagerName(zonalManagerApiById[zone.zonalManagerId]) ||
				zone.zonalManagerId ||
				"-";

			return {
				...zone,
				zonalManager: zonalManagerName,
				allAreas: formatList(zone.allAreaNames),
				allTerritories: formatList(zone.allTerritoryNames),
				allMarketPoints: formatList(zone.allMarketPointNames),
			};
		});
	}, [zones, zonalManagerApiById]);

	const zonalManagerFilterOptions = useMemo(() => {
		const uniqueNames = [...new Set(
			allZoneRows
				.map((zone) => zone.zonalManager)
				.filter((name) => name && name !== "-")
		)];

		return uniqueNames.map((name) => ({
			label: name,
			value: name,
		}));
	}, [allZoneRows]);

	const zonalManagerSearchOptions = useMemo(() => {
		const apiOptions = [...new Set(
			zonalManagerApiList
				.map((manager) => getManagerName(manager))
				.filter((name) => typeof name === "string" && name.trim())
		)].map((name) => ({
			label: name,
			value: name,
		}));

		if (apiOptions.length) {
			return apiOptions;
		}

		return zonalManagerFilterOptions;
	}, [zonalManagerApiList, zonalManagerFilterOptions]);

	const zonalManagerFormOptions = useMemo(() => {
		return zonalManagerApiList
			.map((manager) => {
				const id = getManagerId(manager);
				const name = getManagerName(manager);
				if (!id || !name) return null;
				return {
					label: name,
					value: id,
				};
			})
			.filter(Boolean);
	}, [zonalManagerApiList]);

	const filteredZoneRows = useMemo(() => {
		return allZoneRows.filter((zone) => {
			const matchesName = zone.name
				.toLowerCase()
				.includes(filters.searchName.toLowerCase().trim());
			const matchesManager = filters.zonalManagerName
				? zone.zonalManager === filters.zonalManagerName
				: true;

			return matchesName && matchesManager;
		});
	}, [allZoneRows, filters]);

	const tableData = useMemo(() => {
		return filteredZoneRows.map((zone, index) => ({
			...zone,
			slNo: index + 1,
		}));
	}, [filteredZoneRows]);

	const hasAnySummaryData = useMemo(() => {
		return tableData.some(
			(zone) =>
				zone.allAreas !== "-" ||
				zone.allTerritories !== "-" ||
				zone.allMarketPoints !== "-" ||
				zone.zonalManager !== "-"
		);
	}, [tableData]);

	const selectedZone = useMemo(() => {
		return zones.find((zone) => zone.id === selectedZoneId) || null;
	}, [zones, selectedZoneId]);

	const detailsZone = useMemo(() => {
		return zones.find((zone) => zone.id === detailsZoneId) || null;
	}, [zones, detailsZoneId]);

	const detailsAreaBlocks = useMemo(() => {
		const areas = toArray(detailsZone?.areas);
		return areas.map((area, areaIndex) => {
			const areaName =
				getItemName(area, ["areaName", "name", "label", "title"]) ||
				`Area ${areaIndex + 1}`;
			const territories = toArray(area?.territories ?? area?.territoryList);

			return {
				id: area?._id || area?.id || `${detailsZone?.id}-area-${areaIndex}`,
				areaName,
				territories: territories.map((territory, territoryIndex) => {
					const territoryName =
						getItemName(territory, ["territoryName", "name", "label", "title"]) ||
						`Territory ${territoryIndex + 1}`;
					const marketPoints = toArray(
						territory?.marketPoints ?? territory?.marketPointList
					);

					return {
						id:
							territory?._id ||
							territory?.id ||
							`${detailsZone?.id}-territory-${areaIndex}-${territoryIndex}`,
						territoryName,
						marketPoints: extractUniqueNames(marketPoints, [
							"name",
							"marketPointName",
							"label",
							"title",
						]),
					};
				}),
			};
		});
	}, [detailsZone]);

	const columns = (isUpdateMode = false) => [
		{
			key: "slNo",
			label: isUpdateMode ? "Select (Sl No)" : "Sl No",
			render: (value, row) => {
				if (!isUpdateMode) {
					return value;
				}

				const isSelected = row.id === selectedZoneId;
				return (
					<button
						type="button"
						onClick={() => handleSelectZone(row.id)}
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
		{ key: "name", label: "Zone Name" },
		{
			key: "allTerritories",
			label: "All Territories",
			render: (_, row) => renderCompactList(row.allTerritoryNames),
		},
		{
			key: "allAreas",
			label: "All Areas",
			render: (_, row) => renderCompactList(row.allAreaNames),
		},
		{
			key: "allMarketPoints",
			label: "All Market Points",
			render: (_, row) => renderCompactList(row.allMarketPointNames),
		},
		{
			key: "zonalManager",
			label: "Zonal Manager",
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
				const isOpen = row.id === detailsZoneId;
				return (
					<button
						type="button"
						onClick={() => setDetailsZoneId(isOpen ? "" : row.id)}
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
			name: "",
			zonalManagerId: "",
		};

		if (!formData.name.trim()) {
			nextErrors.name = "Zone name is required";
		}

		setErrors(nextErrors);
		return !nextErrors.name;
	};

	const handleCreateZone = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		const payload = {
			name: formData.name.trim(),
			...(formData.zonalManagerId
				? {
						zonalManagerId: formData.zonalManagerId,
						zonalManagerName:
							getManagerName(zonalManagerApiById[formData.zonalManagerId]) ||
							formData.zonalManagerId,
				  }
				: {}),
		};

		try {
			await createZoneMutation(payload).unwrap();
			toast.success("Zone created successfully");
			setFormData({ name: "", zonalManagerId: "" });
			setErrors({ name: "", zonalManagerId: "" });
			setActiveTab("list");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const handleSelectZone = (zoneId) => {
		const zone = zones.find((item) => item.id === zoneId);
		if (!zone) return;

		setSelectedZoneId(zoneId);
		setUpdateFormData({
			name: zone.name,
			zonalManagerId: zone.zonalManagerId || "",
		});
		setUpdateErrors({ name: "", zonalManagerId: "" });
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
			zonalManagerId: "",
		};

		if (!updateFormData.name.trim()) {
			nextErrors.name = "Zone name is required";
		}

		setUpdateErrors(nextErrors);
		return !nextErrors.name;
	};

	const handleUpdateZone = async (event) => {
		event.preventDefault();

		if (!selectedZone) {
			toast.warning("Select a zone by clicking serial number first");
			return;
		}

		if (!validateUpdateForm()) {
			return;
		}

		const nextName = updateFormData.name.trim();
		const nextManager = updateFormData.zonalManagerId;
		const shouldUpdateManager = Boolean(nextManager);
		const hadPreviousManager = Boolean(selectedZone.zonalManagerId);
		const managerWasCleared = !nextManager && hadPreviousManager;

		if (
			nextName === selectedZone.name &&
			!managerWasCleared &&
			nextManager === (selectedZone.zonalManagerId || "")
		) {
			toast.info("No changes detected to update");
			return;
		}

		const payload = {
			id: selectedZone.id,
			name: nextName,
			...(shouldUpdateManager ? { zonalManagerId: nextManager } : {}),
		};

		try {
			await updateZoneMutation(payload).unwrap();
			toast.success("Zone updated successfully");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const renderListSection = (isUpdateMode = false) => (
		<>
			{isLoading && (
				<p className="text-sm text-gray-500 mb-4">Loading zones...</p>
			)}
			{isError && (
				<p className="text-sm text-red-600 mb-4">
					Failed to load zones from API. Showing available local data.
				</p>
			)}
			{!isLoading && tableData.length > 0 && !hasAnySummaryData && (
				<p className="text-sm text-amber-700 mb-4">
					API returned zones, but summary fields are empty in this environment for this endpoint.
					 Zone name is present, but areas/territories/market points/manager are missing.
				</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
				<FormInput
					label="Zone Name"
					placeholder="Search zone name"
					value={filters.searchName}
					onChange={(event) =>
						setFilters((prev) => ({ ...prev, searchName: event.target.value }))
					}
				/>

				<FormSelect
					label="Zonal Manager"
					placeholder="All zonal managers"
					options={zonalManagerSearchOptions}
					value={filters.zonalManagerName}
					onChange={(event) =>
						setFilters((prev) => ({
							...prev,
							zonalManagerName: event.target.value,
						}))
					}
				/>
			</div>

			<div className="mb-4 flex justify-end">
				<Button
					variant="secondary"
					size="small"
					onClick={() => setFilters({ searchName: "", zonalManagerName: "" })}
				>
					Clear Filters
				</Button>
			</div>

			{isUpdateMode && (
				<p className="text-xs text-blue-700 mb-3">
					Click the Sl No button from any row to select that zone for update.
				</p>
			)}

			<Table
				columns={columns(isUpdateMode)}
				data={tableData}
				striped
				hover
				emptyMessage={
					isLoading
						? "Loading zones..."
						: "No zones found for selected filters"
				}
			/>

			{detailsZone && (
				<div className="mt-6 border border-slate-200 rounded-xl bg-white shadow-sm">
					<div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-t-xl">
						<div>
							<p className="text-sm font-semibold text-slate-900">Zone Details: {detailsZone.name || "-"}</p>
							<p className="text-xs text-slate-500">
								Detailed backlog-friendly view of areas, territories, and market points
							</p>
						</div>
						<button
							type="button"
							onClick={() => setDetailsZoneId("")}
							className="px-3 py-1 rounded-md text-xs font-semibold border bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
						>
							Close
						</button>
					</div>

					<div className="p-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
							<div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
								<p className="text-xs text-blue-700 font-medium">Zonal Manager</p>
								<p className="text-sm font-semibold text-blue-900 mt-1">{detailsZone.zonalManagerName || "-"}</p>
							</div>
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-600 font-medium">Total Areas</p>
								<p className="text-lg font-bold text-slate-900 mt-1">{toArray(detailsZone.allAreaNames).length}</p>
							</div>
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-600 font-medium">Total Territories</p>
								<p className="text-lg font-bold text-slate-900 mt-1">{toArray(detailsZone.allTerritoryNames).length}</p>
							</div>
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-600 font-medium">Total Market Points</p>
								<p className="text-lg font-bold text-slate-900 mt-1">{toArray(detailsZone.allMarketPointNames).length}</p>
							</div>
						</div>

						<div className="overflow-x-auto rounded-lg border border-slate-200">
							<table className="w-full text-xs">
								<thead className="bg-slate-50">
									<tr>
										<th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Area</th>
										<th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Territory</th>
										<th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Market Points</th>
									</tr>
								</thead>
								<tbody>
									{detailsAreaBlocks.length ? (
										detailsAreaBlocks.map((area) =>
											area.territories.length ? (
												area.territories.map((territory, territoryIndex) => (
													<tr
														key={`${area.id}-${territory.id}`}
														className="border-t border-slate-100"
													>
														<td className="px-3 py-2 align-top text-slate-800 font-medium">
															{territoryIndex === 0 ? area.areaName : ""}
														</td>
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
												<tr key={area.id} className="border-t border-slate-100">
													<td className="px-3 py-2 align-top text-slate-800 font-medium">{area.areaName}</td>
													<td className="px-3 py-2 align-top text-slate-400">-</td>
													<td className="px-3 py-2 align-top text-slate-400">-</td>
												</tr>
											)
										)
									) : (
										<tr>
											<td colSpan={3} className="px-3 py-6 text-center text-slate-400">
												No area/territory details available for this zone
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
								<span className="text-gray-900 font-bold">ZONES</span>
							</h2>
						</div>
					</div>
					<div className="text-sm text-neutral-500 mr-2">
						Total Records: {allZoneRows.length}
					</div>
				</div>
			</Card>

			<Card className="mb-6" padding="md">
				<div className="flex flex-wrap items-center gap-3">
					<Button
						variant={activeTab === "list" ? "primary" : "outline"}
						onClick={() => setActiveTab("list")}
					>
						All Zones List
					</Button>
					<Button
						variant={activeTab === "create" ? "primary" : "outline"}
						onClick={() => setActiveTab("create")}
					>
						Create New Zone
					</Button>
					<Button
						variant={activeTab === "update" ? "primary" : "outline"}
						onClick={() => setActiveTab("update")}
					>
						Update Zone
					</Button>
				</div>
			</Card>

			{activeTab === "list" ? (
				<Card
					title="All Zones"
					subtitle={`Showing ${filteredZoneRows.length} of ${allZoneRows.length} records`}
				>
					{renderListSection(false)}
				</Card>
			) : activeTab === "create" ? (
				<Card title="Create Zone" subtitle="Create payload with name and zonal manager id">
					<form onSubmit={handleCreateZone} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormInput
								label="Zone Name"
								placeholder="Enter zone name"
								value={formData.name}
								onChange={(event) => handleFormChange("name", event.target.value)}
								required
								error={errors.name}
							/>

							<FormSelect
								label="Zonal Manager"
								placeholder="Select zonal manager"
								options={zonalManagerFormOptions}
								value={formData.zonalManagerId}
								onChange={(event) =>
									handleFormChange("zonalManagerId", event.target.value)
								}
								error={errors.zonalManagerId}
							/>
						</div>

						<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-sm font-semibold text-gray-700 mb-2">Payload preview</p>
							<pre className="text-sm text-gray-700 whitespace-pre-wrap">
								{JSON.stringify(
									{
										name: formData.name || zoneCreatePayloadExample.name,
										...(formData.zonalManagerId
											? { zonalManagerId: formData.zonalManagerId }
											: {}),
									},
									null,
									2
								)}
							</pre>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button type="submit" variant="primary" disabled={isCreatingZone}>
								Create Zone
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setFormData({ name: "", zonalManagerId: "" });
									setErrors({ name: "", zonalManagerId: "" });
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
						title="Update Zone"
						subtitle={`Showing ${filteredZoneRows.length} of ${allZoneRows.length} records`}
					>
						{renderListSection(true)}
					</Card>

					<Card
						className="mt-6"
						title="Edit Selected Zone"
						subtitle={
							selectedZone
								? `Selected: ${selectedZone.name}`
								: "Select a row from the list first"
						}
					>
						<form onSubmit={handleUpdateZone} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormInput
									label="Zone Name"
									placeholder="Enter zone name"
									value={updateFormData.name}
									onChange={(event) =>
										handleUpdateFormChange("name", event.target.value)
									}
									disabled={!selectedZone}
									error={updateErrors.name}
								/>

								<FormSelect
									label="Zonal Manager"
									placeholder="Select zonal manager"
									options={zonalManagerFormOptions}
									value={updateFormData.zonalManagerId}
									onChange={(event) =>
										handleUpdateFormChange(
												"zonalManagerId",
												event.target.value
											)
									}
									disabled={!selectedZone}
									error={updateErrors.zonalManagerId}
								/>
							</div>

							<div className="flex flex-wrap gap-3">
								<Button type="submit" variant="primary" disabled={!selectedZone || isUpdatingZone}>
									Update Zone
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										if (!selectedZone) return;
										setUpdateFormData({
											name: selectedZone.name,
											zonalManagerId: selectedZone.zonalManagerId,
										});
										setUpdateErrors({ name: "", zonalManagerId: "" });
									}}
									disabled={!selectedZone}
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

export default Zones;
