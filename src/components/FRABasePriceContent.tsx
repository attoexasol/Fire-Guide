import React, { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, MoreVertical, Eye, Pencil, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  getProfessionalFraBasePricesAll,
  updateProfessionalFraBasePrice,
  deleteProfessionalFraBasePrice,
  storeProfessionalFraBasePrice,
  ProfessionalFraBasePriceItem,
} from "../api/professionalFraBasePricesService";
import { getFraAllPrices, FraAllPricesProfessionalItem, getAlarmAllPrices, AlarmAllPricesProfessionalItem, getExtinguisherAllPrices, ExtinguisherAllPricesProfessionalItem, getLightTestingAllPrices, LightTestingAllPricesProfessionalItem, getMarshalAllPrices, MarshalAllPricesProfessionalItem } from "../api/adminService";
import { fetchPropertyTypes } from "../api/servicesService";
import { toast } from "sonner";
import { getApiToken, getProfessionalId } from "../lib/auth";

interface FRABasePriceContentProps {
  /** When true, shows all records (Admin). When false, filters by current professional (Professional). */
  isAdmin?: boolean;
}

export function FRABasePriceContent({ isAdmin = false }: FRABasePriceContentProps) {
  const [records, setRecords] = useState<ProfessionalFraBasePriceItem[]>([]);
  const [fraAllPrices, setFraAllPrices] = useState<FraAllPricesProfessionalItem[] | null>(null);
  const [selectedSystemByPro, setSelectedSystemByPro] = useState<Record<number, string>>({});
  const [fraExpandedByPro, setFraExpandedByPro] = useState<Record<number, boolean>>({});
  const [alarmAllPrices, setAlarmAllPrices] = useState<AlarmAllPricesProfessionalItem[] | null>(null);
  const [selectedAlarmSystemByPro, setSelectedAlarmSystemByPro] = useState<Record<number, string>>({});
  const [alarmExpandedByPro, setAlarmExpandedByPro] = useState<Record<number, boolean>>({});
  const [extinguisherAllPrices, setExtinguisherAllPrices] = useState<ExtinguisherAllPricesProfessionalItem[] | null>(null);
  const [selectedExtinguisherSystemByPro, setSelectedExtinguisherSystemByPro] = useState<Record<number, string>>({});
  const [extinguisherExpandedByPro, setExtinguisherExpandedByPro] = useState<Record<number, boolean>>({});
  const [loadingExtinguisherPrices, setLoadingExtinguisherPrices] = useState(false);
  const [errorExtinguisher, setErrorExtinguisher] = useState<string | null>(null);
  const [extinguisherFetchKey, setExtinguisherFetchKey] = useState(0);
  const [lightTestingAllPrices, setLightTestingAllPrices] = useState<LightTestingAllPricesProfessionalItem[] | null>(null);
  const [selectedLightTestingSystemByPro, setSelectedLightTestingSystemByPro] = useState<Record<number, string>>({});
  const [lightTestingExpandedByPro, setLightTestingExpandedByPro] = useState<Record<number, boolean>>({});
  const [loadingLightTestingPrices, setLoadingLightTestingPrices] = useState(false);
  const [errorLightTesting, setErrorLightTesting] = useState<string | null>(null);
  const [lightTestingFetchKey, setLightTestingFetchKey] = useState(0);
  const [marshalAllPrices, setMarshalAllPrices] = useState<MarshalAllPricesProfessionalItem[] | null>(null);
  const [selectedMarshalSystemByPro, setSelectedMarshalSystemByPro] = useState<Record<number, string>>({});
  const [marshalExpandedByPro, setMarshalExpandedByPro] = useState<Record<number, boolean>>({});
  const [loadingMarshalPrices, setLoadingMarshalPrices] = useState(false);
  const [errorMarshal, setErrorMarshal] = useState<string | null>(null);
  const [marshalFetchKey, setMarshalFetchKey] = useState(0);
  const [loadingAlarmPrices, setLoadingAlarmPrices] = useState(false);
  const [errorAlarm, setErrorAlarm] = useState<string | null>(null);
  const [alarmFetchKey, setAlarmFetchKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverRecordId, setHoverRecordId] = useState<number | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsData, setDetailsData] = useState<ProfessionalFraBasePriceItem | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateRecord, setUpdateRecord] = useState<ProfessionalFraBasePriceItem | null>(null);
  const [updateNonIntrusive, setUpdateNonIntrusive] = useState<string>("");
  const [updateIntrusive, setUpdateIntrusive] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<ProfessionalFraBasePriceItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addPropertyTypeId, setAddPropertyTypeId] = useState<string>("");
  const [addNonIntrusive, setAddNonIntrusive] = useState<string>("");
  const [addIntrusive, setAddIntrusive] = useState<string>("");
  const [addPropertyTypesList, setAddPropertyTypesList] = useState<{ id: number; property_type_name: string }[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const HOVER_CLOSE_DELAY_MS = 400;

  const [fraPriceTab, setFraPriceTab] = useState<string>("fra-price");

  const scheduleClose = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setHoverRecordId(null), HOVER_CLOSE_DELAY_MS);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleViewDetails = (record: ProfessionalFraBasePriceItem) => {
    setHoverRecordId(null);
    setDetailsData(record);
    setDetailsModalOpen(true);
  };

  const handleUpdate = (record: ProfessionalFraBasePriceItem) => {
    setHoverRecordId(null);
    setUpdateRecord(record);
    setUpdateNonIntrusive(record.non_intrusive_base_price ?? "");
    setUpdateIntrusive(record.intrusive_base_price ?? "");
    setUpdateError(null);
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    const apiToken = getApiToken();
    if (!apiToken) {
      toast.error("Please log in to update.");
      return;
    }
    if (!updateRecord) return;
    const nonIntrusive = parseFloat(updateNonIntrusive.trim());
    const intrusive = parseFloat(updateIntrusive.trim());
    if (isNaN(nonIntrusive) || nonIntrusive < 0) {
      toast.error("Please enter a valid non-intrusive base price.");
      return;
    }
    if (isNaN(intrusive) || intrusive < 0) {
      toast.error("Please enter a valid intrusive base price.");
      return;
    }
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      await updateProfessionalFraBasePrice(apiToken, updateRecord.id, nonIntrusive, intrusive);
      toast.success("FRA base price updated successfully.");
      setUpdateModalOpen(false);
      setUpdateRecord(null);
      fetchData();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = (record: ProfessionalFraBasePriceItem) => {
    setHoverRecordId(null);
    setDeleteRecord(record);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const apiToken = getApiToken();
    if (!apiToken) {
      toast.error("Please log in to delete.");
      return;
    }
    if (!deleteRecord) return;
    setDeleteLoading(true);
    try {
      await deleteProfessionalFraBasePrice(
        apiToken,
        deleteRecord.id,
        deleteRecord.professional_id
      );
      toast.success("FRA base price deleted successfully.");
      setDeleteModalOpen(false);
      setDeleteRecord(null);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete FRA base price.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddFraPrice = () => {
    setAddPropertyTypeId("");
    setAddNonIntrusive("");
    setAddIntrusive("");
    setAddError(null);
    setAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    const apiToken = getApiToken();
    if (!apiToken) {
      toast.error("Please log in to add FRA base price.");
      return;
    }
    const propertyTypeId = parseInt(addPropertyTypeId, 10);
    const nonIntrusive = parseFloat(addNonIntrusive.trim());
    const intrusive = parseFloat(addIntrusive.trim());
    if (!addPropertyTypeId || isNaN(propertyTypeId)) {
      toast.error("Please select a property type.");
      return;
    }
    if (isNaN(nonIntrusive) || nonIntrusive < 0) {
      toast.error("Please enter a valid non-intrusive base price.");
      return;
    }
    if (isNaN(intrusive) || intrusive < 0) {
      toast.error("Please enter a valid intrusive base price.");
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      await storeProfessionalFraBasePrice(apiToken, propertyTypeId, nonIntrusive, intrusive);
      toast.success("FRA base price added successfully.");
      setAddModalOpen(false);
      setAddPropertyTypeId("");
      setAddNonIntrusive("");
      setAddIntrusive("");
      fetchData();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add FRA base price.");
    } finally {
      setAddLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiToken = getApiToken();
      if (!apiToken) {
        setError("Please log in to view FRA base price records.");
        return;
      }

      if (isAdmin) {
        const response = await getFraAllPrices(apiToken);
        if (response.status && Array.isArray(response.data)) {
          setFraAllPrices(response.data);
        } else {
          setFraAllPrices([]);
        }
        return;
      }

      const response = await getProfessionalFraBasePricesAll(apiToken);
      if (response.status && Array.isArray(response.data)) {
        let data = response.data;
        const professionalId = getProfessionalId();
        if (professionalId != null) {
          const numericId = Number(professionalId);
          const filtered = data.filter(
            (r) => Number(r.professional_id) === numericId
          );
          setRecords(filtered.length > 0 ? filtered : data);
        } else {
          setRecords(data);
        }
      } else {
        setRecords([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch FRA base price records");
      setRecords([]);
      if (isAdmin) setFraAllPrices(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!isAdmin || fraPriceTab !== "fire-alarm") return;
    const apiToken = getApiToken();
    if (!apiToken) return;
    let cancelled = false;
    setLoadingAlarmPrices(true);
    setErrorAlarm(null);
    getAlarmAllPrices(apiToken)
      .then((res) => {
        if (cancelled) return;
        if (res?.status && Array.isArray(res.data)) {
          setAlarmAllPrices(res.data);
        } else {
          setAlarmAllPrices([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorAlarm(err instanceof Error ? err.message : "Failed to fetch Fire Alarm prices");
          setAlarmAllPrices(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingAlarmPrices(false);
      });
    return () => { cancelled = true; };
  }, [isAdmin, fraPriceTab, alarmFetchKey]);

  useEffect(() => {
    if (!isAdmin || fraPriceTab !== "extinguishers") return;
    const apiToken = getApiToken();
    if (!apiToken) return;
    let cancelled = false;
    setLoadingExtinguisherPrices(true);
    setErrorExtinguisher(null);
    getExtinguisherAllPrices(apiToken)
      .then((res) => {
        if (cancelled) return;
        if (res?.status && Array.isArray(res.data)) {
          setExtinguisherAllPrices(res.data);
        } else {
          setExtinguisherAllPrices([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorExtinguisher(err instanceof Error ? err.message : "Failed to fetch Extinguisher prices");
          setExtinguisherAllPrices(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingExtinguisherPrices(false);
      });
    return () => { cancelled = true; };
  }, [isAdmin, fraPriceTab, extinguisherFetchKey]);

  useEffect(() => {
    if (!isAdmin || fraPriceTab !== "emergency-lighting") return;
    const apiToken = getApiToken();
    if (!apiToken) return;
    let cancelled = false;
    setLoadingLightTestingPrices(true);
    setErrorLightTesting(null);
    getLightTestingAllPrices(apiToken)
      .then((res) => {
        if (cancelled) return;
        if (res?.status && Array.isArray(res.data)) {
          setLightTestingAllPrices(res.data);
        } else {
          setLightTestingAllPrices([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorLightTesting(err instanceof Error ? err.message : "Failed to fetch Emergency Lighting prices");
          setLightTestingAllPrices(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingLightTestingPrices(false);
      });
    return () => { cancelled = true; };
  }, [isAdmin, fraPriceTab, lightTestingFetchKey]);

  useEffect(() => {
    if (!isAdmin || fraPriceTab !== "training") return;
    const apiToken = getApiToken();
    if (!apiToken) return;
    let cancelled = false;
    setLoadingMarshalPrices(true);
    setErrorMarshal(null);
    getMarshalAllPrices(apiToken)
      .then((res) => {
        if (cancelled) return;
        if (res?.status && Array.isArray(res.data)) {
          setMarshalAllPrices(res.data);
        } else {
          setMarshalAllPrices([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMarshal(err instanceof Error ? err.message : "Failed to fetch Training (Marshal) prices");
          setMarshalAllPrices(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingMarshalPrices(false);
      });
    return () => { cancelled = true; };
  }, [isAdmin, fraPriceTab, marshalFetchKey]);

  useEffect(() => {
    if (!addModalOpen) return;
    let cancelled = false;
    fetchPropertyTypes()
      .then((types) => {
        if (!cancelled) {
          setAddPropertyTypesList(types.map((t) => ({ id: t.id, property_type_name: t.property_type_name })));
        }
      })
      .catch(() => {
        if (!cancelled) setAddPropertyTypesList([]);
      });
    return () => { cancelled = true; };
  }, [addModalOpen]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price || "0");
    return isNaN(num) ? "—" : `£${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6 px-4 md:px-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-[#0A1A2F] text-xl font-semibold mb-1">Pricing</h1>
        <p className="text-sm text-gray-500">
          {isAdmin
            ? "Property types, floors, people and durations by professional"
            : "Fire Risk Assessment base prices by property type"}
        </p>
      </div>

      <Tabs value={fraPriceTab} onValueChange={setFraPriceTab} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-gray-100 rounded-lg mb-6">
          <TabsTrigger
            value="fra-price"
            className="flex-1 min-w-[120px] py-3 px-4 rounded-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 cursor-pointer hover:bg-gray-200 data-[state=inactive]:text-gray-700"
          >
            FRA Price
          </TabsTrigger>
          <TabsTrigger
            value="fire-alarm"
            className="flex-1 min-w-[120px] py-3 px-4 rounded-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 cursor-pointer hover:bg-gray-200 data-[state=inactive]:text-gray-700"
          >
            Fire Alarm
          </TabsTrigger>
          <TabsTrigger
            value="extinguishers"
            className="flex-1 min-w-[120px] py-3 px-4 rounded-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 cursor-pointer hover:bg-gray-200 data-[state=inactive]:text-gray-700"
          >
            Extinguishers
          </TabsTrigger>
          <TabsTrigger
            value="emergency-lighting"
            className="flex-1 min-w-[120px] py-3 px-4 rounded-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 cursor-pointer hover:bg-gray-200 data-[state=inactive]:text-gray-700"
          >
            Emergency Lighting
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="flex-1 min-w-[120px] py-3 px-4 rounded-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 cursor-pointer hover:bg-gray-200 data-[state=inactive]:text-gray-700"
          >
            Training
          </TabsTrigger>
          <TabsTrigger
            value="consultancy"
            className="flex-1 min-w-[120px] py-3 px-4 rounded-md font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 cursor-pointer hover:bg-gray-200 data-[state=inactive]:text-gray-700"
          >
            Consultancy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fra-price" className="mt-0">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-[#0A1A2F]">
              {isAdmin ? "All professionals' FRA prices" : "FRA Base Prices"}
            </CardTitle>
            {!isAdmin && (
              <Button size="sm" className="shrink-0 w-fit" onClick={handleAddFraPrice}>
                <Plus className="w-4 h-4 mr-2" />
                Add FRA Price
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading FRA base price records...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                type="button"
                onClick={fetchData}
                className="text-sm text-red-600 hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && isAdmin && fraAllPrices !== null && (
            <>
              {fraAllPrices.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No professionals' FRA prices found.</div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-24">Reference</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 min-w-0">Professional</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Systems</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {fraAllPrices.map((pro) => {
                        const selectedSystem = selectedSystemByPro[pro.professional_id] ?? "";
                        return (
                          <React.Fragment key={pro.professional_id}>
                            <tr className="bg-red-50 hover:bg-red-100/60 transition-colors">
                              <td className="p-4">
                                <p className="font-medium text-gray-900">BS-{pro.professional_id}</p>
                              </td>
                              <td className="p-4">
                                <p className="text-gray-900 font-normal">{pro.professional_name}</p>
                              </td>
                              <td className="p-4 min-w-0">
                                <div className="flex items-center gap-1 w-full">
                                  <Select
                                    value={selectedSystem}
                                    onValueChange={(value) => {
                                      setSelectedSystemByPro((prev) => ({
                                        ...prev,
                                        [pro.professional_id]: value,
                                      }));
                                      setFraExpandedByPro((prev) => ({ ...prev, [pro.professional_id]: true }));
                                    }}
                                  >
                                    <SelectTrigger className="flex-1 min-w-0 h-9 text-sm border-gray-200">
                                      <SelectValue placeholder="Select system" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="property_type">Property type</SelectItem>
                                      <SelectItem value="floor">Floor</SelectItem>
                                      <SelectItem value="people">People</SelectItem>
                                      <SelectItem value="duration">Duration</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 shrink-0 border-gray-200"
                                    onClick={() =>
                                      setFraExpandedByPro((prev) => ({
                                        ...prev,
                                        [pro.professional_id]: !(prev[pro.professional_id] !== false),
                                      }))
                                    }
                                    aria-label={fraExpandedByPro[pro.professional_id] !== false ? "Minimize" : "Expand"}
                                  >
                                    {fraExpandedByPro[pro.professional_id] !== false ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronUp className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            {selectedSystem && fraExpandedByPro[pro.professional_id] !== false && (
                              <tr className="bg-white">
                                <td colSpan={3} className="p-0 align-top">
                                  <div className="bg-white px-4 pb-4 pt-1 w-full">
                                    <div className="rounded border border-gray-200 bg-white overflow-hidden w-full">
                                      <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                          <tr>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600">Option</th>
                                            <th className="text-right py-2 px-3 font-medium text-gray-600">Base Price</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                          {selectedSystem === "property_type" &&
                                            pro.property_types.map((pt) => (
                                              <tr key={pt.id}>
                                                <td className="py-2 px-3 text-gray-900">{pt.property_type_name}</td>
                                                <td className="py-2 px-3 text-right font-medium">{formatPrice(pt.price)}</td>
                                              </tr>
                                            ))}
                                          {selectedSystem === "floor" &&
                                            pro.floors.map((f) => (
                                              <tr key={f.id}>
                                                <td className="py-2 px-3 text-gray-900">{f.floor}</td>
                                                <td className="py-2 px-3 text-right font-medium">{formatPrice(f.price)}</td>
                                              </tr>
                                            ))}
                                          {selectedSystem === "people" &&
                                            pro.people.map((p) => (
                                              <tr key={p.id}>
                                                <td className="py-2 px-3 text-gray-900">{p.people_name ?? `People #${p.id}`}</td>
                                                <td className="py-2 px-3 text-right font-medium">{formatPrice(p.price)}</td>
                                              </tr>
                                            ))}
                                          {selectedSystem === "duration" &&
                                            pro.durations.map((d) => (
                                              <tr key={d.id}>
                                                <td className="py-2 px-3 text-gray-900">{d.duration_name}</td>
                                                <td className="py-2 px-3 text-right font-medium">{formatPrice(d.price)}</td>
                                              </tr>
                                            ))}
                                          {selectedSystem === "property_type" && pro.property_types.length === 0 && (
                                            <tr>
                                              <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">
                                                No property types configured
                                              </td>
                                            </tr>
                                          )}
                                          {selectedSystem === "floor" && pro.floors.length === 0 && (
                                            <tr>
                                              <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">
                                                No floors configured
                                              </td>
                                            </tr>
                                          )}
                                          {selectedSystem === "people" && pro.people.length === 0 && (
                                            <tr>
                                              <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">
                                                No people options configured
                                              </td>
                                            </tr>
                                          )}
                                          {selectedSystem === "duration" && pro.durations.length === 0 && (
                                            <tr>
                                              <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">
                                                No durations configured
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!isLoading && !error && !isAdmin && records.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Reference
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Property Type
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Non‑Intrusive
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Intrusive
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Updated
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-gray-700 w-12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <p className="font-medium text-gray-900">FA-{record.id}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900 font-medium">
                            {record.property_type?.property_type_name ?? "—"}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(record.non_intrusive_base_price)}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(record.intrusive_base_price)}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900">
                            {formatDate(record.updated_at)}
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          <div
                            className="relative inline-block"
                            onMouseEnter={() => {
                              cancelClose();
                              setHoverRecordId(record.id);
                            }}
                            onMouseLeave={scheduleClose}
                          >
                            <DropdownMenu
                              open={hoverRecordId === record.id}
                              onOpenChange={(open) => !open && setHoverRecordId(null)}
                            >
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                hideBackdrop
                                className="min-w-[10rem]"
                                onMouseEnter={cancelClose}
                                onMouseLeave={scheduleClose}
                              >
                                <DropdownMenuItem onClick={() => handleViewDetails(record)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdate(record)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Update
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDelete(record)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card layout */}
              <div className="md:hidden space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900">
                        {record.property_type?.property_type_name ?? "—"}
                      </p>
                      <div
                        className="relative"
                        onMouseEnter={() => {
                          cancelClose();
                          setHoverRecordId(record.id);
                        }}
                        onMouseLeave={scheduleClose}
                      >
                        <DropdownMenu
                          open={hoverRecordId === record.id}
                          onOpenChange={(open) => !open && setHoverRecordId(null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={(e) => e.preventDefault()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            hideBackdrop
                            className="min-w-[10rem]"
                            onMouseEnter={cancelClose}
                            onMouseLeave={scheduleClose}
                          >
                            <DropdownMenuItem onClick={() => handleViewDetails(record)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdate(record)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(record)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Non‑Intrusive</p>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(record.non_intrusive_base_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Intrusive</p>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(record.intrusive_base_price)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 pt-2 border-t">
                      Updated {formatDate(record.updated_at)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {!isLoading && !error && !isAdmin && records.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No FRA base price records found</p>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="fire-alarm" className="mt-0">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">
                All professionals' Fire Alarm prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAlarmPrices && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Loading Fire Alarm prices...</p>
                </div>
              )}
              {!loadingAlarmPrices && errorAlarm && (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-2">{errorAlarm}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorAlarm(null);
                      setAlarmFetchKey((k) => k + 1);
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!loadingAlarmPrices && !errorAlarm && isAdmin && alarmAllPrices !== null && (
                <>
                  {alarmAllPrices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No Fire Alarm prices found.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 w-24">Reference</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 min-w-0">Professional</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Systems</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {alarmAllPrices.map((pro) => {
                            const selectedSystem = selectedAlarmSystemByPro[pro.professional_id] ?? "";
                            return (
                              <React.Fragment key={pro.professional_id}>
                                <tr className="bg-red-50 hover:bg-red-100/60 transition-colors">
                                  <td className="p-4">
                                    <p className="font-medium text-gray-900">BS-{pro.professional_id}</p>
                                  </td>
                                  <td className="p-4">
                                    <p className="text-gray-900 font-normal">{pro.professional_name}</p>
                                  </td>
                                  <td className="p-4 min-w-0">
                                    <div className="flex items-center gap-1 w-full">
                                      <Select
                                        value={selectedSystem}
                                        onValueChange={(value) => {
                                          setSelectedAlarmSystemByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: value,
                                          }));
                                          setAlarmExpandedByPro((prev) => ({ ...prev, [pro.professional_id]: true }));
                                        }}
                                      >
                                        <SelectTrigger className="flex-1 min-w-0 h-9 text-sm border-gray-200">
                                          <SelectValue placeholder="Select system" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="base_price">Base price</SelectItem>
                                          <SelectItem value="smoke_detectors">Smoke detectors</SelectItem>
                                          <SelectItem value="call_points">Call points</SelectItem>
                                          <SelectItem value="floors">Floors</SelectItem>
                                          <SelectItem value="panels">Panels</SelectItem>
                                          <SelectItem value="last_services">Last services</SelectItem>
                                          <SelectItem value="system_types">System types</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 border-gray-200"
                                        onClick={() =>
                                          setAlarmExpandedByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: !(prev[pro.professional_id] !== false),
                                          }))
                                        }
                                        aria-label={alarmExpandedByPro[pro.professional_id] !== false ? "Minimize" : "Expand"}
                                      >
                                        {alarmExpandedByPro[pro.professional_id] !== false ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronUp className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                {selectedSystem && alarmExpandedByPro[pro.professional_id] !== false && (
                                  <tr className="bg-white">
                                    <td colSpan={3} className="p-0 align-top">
                                      <div className="bg-white px-4 pb-4 pt-1 w-full">
                                        <div className="rounded border border-gray-200 bg-white overflow-hidden w-full">
                                          <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                              <tr>
                                                <th className="text-left py-2 px-3 font-medium text-gray-600">Option</th>
                                                <th className="text-right py-2 px-3 font-medium text-gray-600">Base Price</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                              {selectedSystem === "base_price" &&
                                                (pro.base_prices?.length
                                                  ? pro.base_prices.map((bp, idx) => (
                                                      <tr key={idx}>
                                                        <td className="py-2 px-3 text-gray-900">Base price</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(bp.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No base price configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "smoke_detectors" &&
                                                (pro.smoke_detectors?.length
                                                  ? pro.smoke_detectors.map((s) => (
                                                      <tr key={s.id}>
                                                        <td className="py-2 px-3 text-gray-900">{s.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(s.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No smoke detectors configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "call_points" &&
                                                (pro.call_points?.length
                                                  ? pro.call_points.map((c) => (
                                                      <tr key={c.id}>
                                                        <td className="py-2 px-3 text-gray-900">{c.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(c.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No call points configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "floors" &&
                                                (pro.floors?.length
                                                  ? pro.floors.map((f) => (
                                                      <tr key={f.id}>
                                                        <td className="py-2 px-3 text-gray-900">{f.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(f.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No floors configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "panels" &&
                                                (pro.panels?.length
                                                  ? pro.panels.map((p) => (
                                                      <tr key={p.id}>
                                                        <td className="py-2 px-3 text-gray-900">{p.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(p.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No panels configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "last_services" &&
                                                (pro.last_services?.length
                                                  ? pro.last_services.map((l) => (
                                                      <tr key={l.id}>
                                                        <td className="py-2 px-3 text-gray-900">{l.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(l.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No last services configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "system_types" &&
                                                (pro.system_types?.length
                                                  ? pro.system_types.map((st) => (
                                                      <tr key={st.id}>
                                                        <td className="py-2 px-3 text-gray-900">{st.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(st.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No system types configured</td>
                                                      </tr>
                                                    ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="extinguishers" className="mt-0">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">All professionals' Extinguisher prices</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingExtinguisherPrices && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Loading Extinguisher prices...</p>
                </div>
              )}
              {!loadingExtinguisherPrices && errorExtinguisher && (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-2">{errorExtinguisher}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorExtinguisher(null);
                      setExtinguisherFetchKey((k) => k + 1);
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!loadingExtinguisherPrices && !errorExtinguisher && isAdmin && extinguisherAllPrices !== null && (
                <>
                  {extinguisherAllPrices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No Extinguisher prices found.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 w-24">Reference</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 min-w-0">Professional</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Systems</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {extinguisherAllPrices.map((pro) => {
                            const selectedSystem = selectedExtinguisherSystemByPro[pro.professional_id] ?? "";
                            return (
                              <React.Fragment key={pro.professional_id}>
                                <tr className="bg-red-50 hover:bg-red-100/60 transition-colors">
                                  <td className="p-4">
                                    <p className="font-medium text-gray-900">BS-{pro.professional_id}</p>
                                  </td>
                                  <td className="p-4">
                                    <p className="text-gray-900 font-normal">{pro.professional_name}</p>
                                  </td>
                                  <td className="p-4 min-w-0">
                                    <div className="flex items-center gap-1 w-full">
                                      <Select
                                        value={selectedSystem}
                                        onValueChange={(value) => {
                                          setSelectedExtinguisherSystemByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: value,
                                          }));
                                          setExtinguisherExpandedByPro((prev) => ({ ...prev, [pro.professional_id]: true }));
                                        }}
                                      >
                                        <SelectTrigger className="flex-1 min-w-0 h-9 text-sm border-gray-200">
                                          <SelectValue placeholder="Select system" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="base_price">Base price</SelectItem>
                                          <SelectItem value="extinguishers">Extinguishers</SelectItem>
                                          <SelectItem value="floors">Floors</SelectItem>
                                          <SelectItem value="last_services">Last services</SelectItem>
                                          <SelectItem value="extinguisher_types">Extinguisher types</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 border-gray-200"
                                        onClick={() =>
                                          setExtinguisherExpandedByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: !(prev[pro.professional_id] !== false),
                                          }))
                                        }
                                        aria-label={extinguisherExpandedByPro[pro.professional_id] !== false ? "Minimize" : "Expand"}
                                      >
                                        {extinguisherExpandedByPro[pro.professional_id] !== false ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronUp className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                {selectedSystem && extinguisherExpandedByPro[pro.professional_id] !== false && (
                                  <tr className="bg-white">
                                    <td colSpan={3} className="p-0 align-top">
                                      <div className="bg-white px-4 pb-4 pt-1 w-full">
                                        <div className="rounded border border-gray-200 bg-white overflow-hidden w-full">
                                          <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                              <tr>
                                                <th className="text-left py-2 px-3 font-medium text-gray-600">Option</th>
                                                <th className="text-right py-2 px-3 font-medium text-gray-600">Base Price</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                              {selectedSystem === "base_price" &&
                                                (pro.base_prices?.length
                                                  ? pro.base_prices.map((bp, idx) => (
                                                      <tr key={idx}>
                                                        <td className="py-2 px-3 text-gray-900">Base price</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(bp.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No base price configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "extinguishers" &&
                                                (pro.extinguishers?.length
                                                  ? pro.extinguishers.map((e) => (
                                                      <tr key={e.id}>
                                                        <td className="py-2 px-3 text-gray-900">{e.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(e.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No extinguishers configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "floors" &&
                                                (pro.floors?.length
                                                  ? pro.floors.map((f) => (
                                                      <tr key={f.id}>
                                                        <td className="py-2 px-3 text-gray-900">{f.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(f.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No floors configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "last_services" &&
                                                (pro.last_services?.length
                                                  ? pro.last_services.map((l) => (
                                                      <tr key={l.id}>
                                                        <td className="py-2 px-3 text-gray-900">{l.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(l.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No last services configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "extinguisher_types" &&
                                                (pro.extinguisher_types?.length
                                                  ? pro.extinguisher_types.map((et) => (
                                                      <tr key={et.id}>
                                                        <td className="py-2 px-3 text-gray-900">{et.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(et.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No extinguisher types configured</td>
                                                      </tr>
                                                    ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emergency-lighting" className="mt-0">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">All professionals' Emergency Lighting prices</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingLightTestingPrices && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Loading Emergency Lighting prices...</p>
                </div>
              )}
              {!loadingLightTestingPrices && errorLightTesting && (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-2">{errorLightTesting}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorLightTesting(null);
                      setLightTestingFetchKey((k) => k + 1);
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!loadingLightTestingPrices && !errorLightTesting && isAdmin && lightTestingAllPrices !== null && (
                <>
                  {lightTestingAllPrices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No Emergency Lighting prices found.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 w-24">Reference</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 min-w-0">Professional</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Systems</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {lightTestingAllPrices.map((pro) => {
                            const selectedSystem = selectedLightTestingSystemByPro[pro.professional_id] ?? "";
                            return (
                              <React.Fragment key={pro.professional_id}>
                                <tr className="bg-red-50 hover:bg-red-100/60 transition-colors">
                                  <td className="p-4">
                                    <p className="font-medium text-gray-900">BS-{pro.professional_id}</p>
                                  </td>
                                  <td className="p-4">
                                    <p className="text-gray-900 font-normal">{pro.professional_name}</p>
                                  </td>
                                  <td className="p-4 min-w-0">
                                    <div className="flex items-center gap-1 w-full">
                                      <Select
                                        value={selectedSystem}
                                        onValueChange={(value) => {
                                          setSelectedLightTestingSystemByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: value,
                                          }));
                                          setLightTestingExpandedByPro((prev) => ({ ...prev, [pro.professional_id]: true }));
                                        }}
                                      >
                                        <SelectTrigger className="flex-1 min-w-0 h-9 text-sm border-gray-200">
                                          <SelectValue placeholder="Select system" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="base_price">Base price</SelectItem>
                                          <SelectItem value="lights">Lights</SelectItem>
                                          <SelectItem value="floors">Floors</SelectItem>
                                          <SelectItem value="light_tests">Light tests</SelectItem>
                                          <SelectItem value="light_types">Light types</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 border-gray-200"
                                        onClick={() =>
                                          setLightTestingExpandedByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: !(prev[pro.professional_id] !== false),
                                          }))
                                        }
                                        aria-label={lightTestingExpandedByPro[pro.professional_id] !== false ? "Minimize" : "Expand"}
                                      >
                                        {lightTestingExpandedByPro[pro.professional_id] !== false ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronUp className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                {selectedSystem && lightTestingExpandedByPro[pro.professional_id] !== false && (
                                  <tr className="bg-white">
                                    <td colSpan={3} className="p-0 align-top">
                                      <div className="bg-white px-4 pb-4 pt-1 w-full">
                                        <div className="rounded border border-gray-200 bg-white overflow-hidden w-full">
                                          <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                              <tr>
                                                <th className="text-left py-2 px-3 font-medium text-gray-600">Option</th>
                                                <th className="text-right py-2 px-3 font-medium text-gray-600">Base Price</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                              {selectedSystem === "base_price" &&
                                                (pro.base_prices?.length
                                                  ? pro.base_prices.map((bp, idx) => (
                                                      <tr key={idx}>
                                                        <td className="py-2 px-3 text-gray-900">Base price</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(bp.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No base price configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "lights" &&
                                                (pro.lights?.length
                                                  ? pro.lights.map((e) => (
                                                      <tr key={e.id}>
                                                        <td className="py-2 px-3 text-gray-900">{e.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(e.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No lights configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "floors" &&
                                                (pro.floors?.length
                                                  ? pro.floors.map((f) => (
                                                      <tr key={f.id}>
                                                        <td className="py-2 px-3 text-gray-900">{f.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(f.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No floors configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "light_tests" &&
                                                (pro.light_tests?.length
                                                  ? pro.light_tests.map((l) => (
                                                      <tr key={l.id}>
                                                        <td className="py-2 px-3 text-gray-900">{l.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(l.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No light tests configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "light_types" &&
                                                (pro.light_types?.length
                                                  ? pro.light_types.map((lt) => (
                                                      <tr key={lt.id}>
                                                        <td className="py-2 px-3 text-gray-900">{lt.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(lt.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No light types configured</td>
                                                      </tr>
                                                    ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="training" className="mt-0">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">All professionals' Training (Marshal) prices</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMarshalPrices && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Loading Training prices...</p>
                </div>
              )}
              {!loadingMarshalPrices && errorMarshal && (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-2">{errorMarshal}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMarshal(null);
                      setMarshalFetchKey((k) => k + 1);
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!loadingMarshalPrices && !errorMarshal && isAdmin && marshalAllPrices !== null && (
                <>
                  {marshalAllPrices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No Training (Marshal) prices found.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 w-24">Reference</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700 min-w-0">Professional</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-700">Systems</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {marshalAllPrices.map((pro) => {
                            const selectedSystem = selectedMarshalSystemByPro[pro.professional_id] ?? "";
                            return (
                              <React.Fragment key={pro.professional_id}>
                                <tr className="bg-red-50 hover:bg-red-100/60 transition-colors">
                                  <td className="p-4">
                                    <p className="font-medium text-gray-900">BS-{pro.professional_id}</p>
                                  </td>
                                  <td className="p-4">
                                    <p className="text-gray-900 font-normal">{pro.professional_name}</p>
                                  </td>
                                  <td className="p-4 min-w-0">
                                    <div className="flex items-center gap-1 w-full">
                                      <Select
                                        value={selectedSystem}
                                        onValueChange={(value) => {
                                          setSelectedMarshalSystemByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: value,
                                          }));
                                          setMarshalExpandedByPro((prev) => ({ ...prev, [pro.professional_id]: true }));
                                        }}
                                      >
                                        <SelectTrigger className="flex-1 min-w-0 h-9 text-sm border-gray-200">
                                          <SelectValue placeholder="Select system" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="base_price">Base price</SelectItem>
                                          <SelectItem value="people">People</SelectItem>
                                          <SelectItem value="places">Places</SelectItem>
                                          <SelectItem value="training_on">Training On</SelectItem>
                                          <SelectItem value="experience">Experience</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 border-gray-200"
                                        onClick={() =>
                                          setMarshalExpandedByPro((prev) => ({
                                            ...prev,
                                            [pro.professional_id]: !(prev[pro.professional_id] !== false),
                                          }))
                                        }
                                        aria-label={marshalExpandedByPro[pro.professional_id] !== false ? "Minimize" : "Expand"}
                                      >
                                        {marshalExpandedByPro[pro.professional_id] !== false ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronUp className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                {selectedSystem && marshalExpandedByPro[pro.professional_id] !== false && (
                                  <tr className="bg-white">
                                    <td colSpan={3} className="p-0 align-top">
                                      <div className="bg-white px-4 pb-4 pt-1 w-full">
                                        <div className="rounded border border-gray-200 bg-white overflow-hidden w-full">
                                          <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                              <tr>
                                                <th className="text-left py-2 px-3 font-medium text-gray-600">Option</th>
                                                <th className="text-right py-2 px-3 font-medium text-gray-600">Price</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                              {selectedSystem === "base_price" &&
                                                (pro.base_prices?.length
                                                  ? pro.base_prices.map((bp, idx) => (
                                                      <tr key={idx}>
                                                        <td className="py-2 px-3 text-gray-900">Base price</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(bp.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No base price configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "people" &&
                                                (pro.people?.length
                                                  ? pro.people.map((e) => (
                                                      <tr key={e.id}>
                                                        <td className="py-2 px-3 text-gray-900">{e.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(e.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No people configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "places" &&
                                                (pro.places?.length
                                                  ? pro.places.map((f) => (
                                                      <tr key={f.id}>
                                                        <td className="py-2 px-3 text-gray-900">{f.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(f.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No places configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "training_on" &&
                                                (pro.training_on?.length
                                                  ? pro.training_on.map((t) => (
                                                      <tr key={t.id}>
                                                        <td className="py-2 px-3 text-gray-900">{t.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(t.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No training on configured</td>
                                                      </tr>
                                                    ))}
                                              {selectedSystem === "experience" &&
                                                (pro.experience?.length
                                                  ? pro.experience.map((exp) => (
                                                      <tr key={exp.id}>
                                                        <td className="py-2 px-3 text-gray-900">{exp.value}</td>
                                                        <td className="py-2 px-3 text-right font-medium">{formatPrice(exp.price)}</td>
                                                      </tr>
                                                    ))
                                                  : (
                                                      <tr>
                                                        <td colSpan={2} className="py-3 px-3 text-gray-500 text-center">No experience configured</td>
                                                      </tr>
                                                    ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="consultancy" className="mt-0">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="py-12 text-center text-gray-500">
              Consultancy pricing content coming soon.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Details Modal */}
      <Dialog
        open={detailsModalOpen}
        onOpenChange={(open) => {
          setDetailsModalOpen(open);
          if (!open) setDetailsData(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0A1A2F]">FRA Base Price Details</DialogTitle>
          </DialogHeader>
          {detailsData && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium text-gray-900">FA-{detailsData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Property Type</p>
                  <p className="font-medium text-gray-900">
                    {detailsData.property_type?.property_type_name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Non‑Intrusive Base Price</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(detailsData.non_intrusive_base_price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Intrusive Base Price</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(detailsData.intrusive_base_price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-gray-900">{formatDate(detailsData.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated</p>
                  <p className="text-gray-900">{formatDate(detailsData.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog
        open={updateModalOpen}
        onOpenChange={(open) => {
          setUpdateModalOpen(open);
          if (!open) setUpdateRecord(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0A1A2F]">Update FRA Base Price</DialogTitle>
          </DialogHeader>
          {updateRecord && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <p className="text-sm font-medium text-gray-900">
                  {updateRecord.property_type?.property_type_name ?? "—"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-non-intrusive">Non‑Intrusive Base Price (£)</Label>
                <Input
                  id="update-non-intrusive"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={updateNonIntrusive}
                  onChange={(e) => setUpdateNonIntrusive(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-intrusive">Intrusive Base Price (£)</Label>
                <Input
                  id="update-intrusive"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={updateIntrusive}
                  onChange={(e) => setUpdateIntrusive(e.target.value)}
                />
              </div>
              {updateError && (
                <p className="text-sm text-red-500">{updateError}</p>
              )}
            </div>
          )}
          <DialogFooter className="mt-5">
            <Button
              variant="outline"
              onClick={() => setUpdateModalOpen(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setDeleteRecord(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0A1A2F]">Delete FRA Base Price</DialogTitle>
          </DialogHeader>
          {deleteRecord && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete the FRA base price for{" "}
                <span className="font-semibold">{deleteRecord.property_type?.property_type_name ?? "—"}</span>{" "}
                (Non‑intrusive: {formatPrice(deleteRecord.non_intrusive_base_price)}, Intrusive: {formatPrice(deleteRecord.intrusive_base_price)})?
              </p>
            </div>
          )}
          <DialogFooter className="mt-5">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add FRA Price Modal */}
      <Dialog
        open={addModalOpen}
        onOpenChange={(open) => {
          setAddModalOpen(open);
          if (!open) setAddError(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0A1A2F]">Add FRA Base Price</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-property-type">Property Type</Label>
              <Select value={addPropertyTypeId} onValueChange={setAddPropertyTypeId}>
                <SelectTrigger id="add-property-type">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {addPropertyTypesList.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.property_type_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-non-intrusive">Non‑Intrusive Base Price (£)</Label>
              <Input
                id="add-non-intrusive"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={addNonIntrusive}
                onChange={(e) => setAddNonIntrusive(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-intrusive">Intrusive Base Price (£)</Label>
              <Input
                id="add-intrusive"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={addIntrusive}
                onChange={(e) => setAddIntrusive(e.target.value)}
              />
            </div>
            {addError && <p className="text-sm text-red-500">{addError}</p>}
          </div>
          <DialogFooter className="mt-5">
            <Button
              variant="outline"
              onClick={() => setAddModalOpen(false)}
              disabled={addLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSubmit} disabled={addLoading}>
              {addLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
