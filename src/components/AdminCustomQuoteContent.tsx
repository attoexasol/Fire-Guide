import { useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import { Search, Loader2, FileText, MoreVertical, Eye, Pencil, UserPlus, User, Calendar, Building2, FileCheck, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { getAllCustomQuoteRequests, getSingleCustomQuoteRequest, assignProfessionalToQuoteRequest, updateQuoteRequestStatus, AdminQuoteRequestItem } from "../api/customQuoteRequestsService";
import { fetchProfessionals, ProfessionalResponse } from "../api/professionalsService";
import { getApiToken } from "../lib/auth";
import { toast } from "sonner";
import { Label } from "./ui/label";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseRequestData(requestData: string): Record<string, unknown> {
  try {
    return typeof requestData === "string" ? JSON.parse(requestData) : requestData || {};
  } catch {
    return {};
  }
}

export function AdminCustomQuoteContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [records, setRecords] = useState<AdminQuoteRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsRecordId, setDetailsRecordId] = useState<number | null>(null);
  const [detailsRecord, setDetailsRecord] = useState<AdminQuoteRequestItem | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [updateRecord, setUpdateRecord] = useState<AdminQuoteRequestItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [assignRecord, setAssignRecord] = useState<AdminQuoteRequestItem | null>(null);
  const [professionals, setProfessionals] = useState<ProfessionalResponse[]>([]);
  const [professionalsLoading, setProfessionalsLoading] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [hoverRecordId, setHoverRecordId] = useState<number | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const HOVER_CLOSE_DELAY_MS = 400;

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

  const fetchRecords = async () => {
    const token = getApiToken();
    if (!token) {
      setError("Not authenticated");
      setRecords([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllCustomQuoteRequests(token);
      if (response.status && Array.isArray(response.data)) {
        setRecords(response.data);
      } else {
        setRecords([]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load quote requests";
      setError(msg);
      toast.error(msg);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      record.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.service?.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(record.id).includes(searchTerm);

    const matchesFilter =
      filterStatus === "all" || record.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const statusStyle = (status: string): CSSProperties => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" };
      case "reviewed":
        return { backgroundColor: "#e0f2fe", color: "#0369a1", border: "1px solid #7dd3fc" };
      case "quoted":
        return { backgroundColor: "#d1fae5", color: "#047857", border: "1px solid #6ee7b7" };
      case "assigned":
        return { backgroundColor: "#ede9fe", color: "#5b21b6", border: "1px solid #c4b5fd" };
      default:
        return { backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0" };
    }
  };

  const formatStatus = (status: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";

  const handleViewDetails = async (record: AdminQuoteRequestItem) => {
    setHoverRecordId(null);
    setDetailsRecordId(record.id);
    setDetailsRecord(null);
    setDetailsError(null);
    const token = getApiToken();
    if (!token) {
      setDetailsError("Not authenticated");
      return;
    }
    setDetailsLoading(true);
    try {
      const response = await getSingleCustomQuoteRequest(token, record.id);
      if (response.status && response.data) {
        setDetailsRecord(response.data);
      } else {
        setDetailsError("Failed to load details");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load quote request details";
      setDetailsError(msg);
      toast.error(msg);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdate = (record: AdminQuoteRequestItem) => {
    setHoverRecordId(null);
    setUpdateRecord(record);
    setSelectedStatus(record.status || "");
  };

  const STATUS_OPTIONS = ["pending", "reviewed", "quoted", "assigned"];

  const handleUpdateStatusSubmit = async () => {
    const token = getApiToken();
    if (!token || !updateRecord) return;
    if (!selectedStatus.trim()) {
      toast.error("Please select a status");
      return;
    }
    setUpdateLoading(true);
    try {
      await updateQuoteRequestStatus(token, updateRecord.id, selectedStatus);
      toast.success("Status updated successfully");
      setUpdateRecord(null);
      setSelectedStatus("");
      fetchRecords();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAssignProfessional = (record: AdminQuoteRequestItem) => {
    setHoverRecordId(null);
    setAssignRecord(record);
    setSelectedProfessionalId("");
  };

  // Fetch professionals when Assign modal opens
  useEffect(() => {
    if (!assignRecord) return;
    const load = async () => {
      setProfessionalsLoading(true);
      try {
        const list = await fetchProfessionals(1);
        setProfessionals(list);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load professionals");
        setProfessionals([]);
      } finally {
        setProfessionalsLoading(false);
      }
    };
    load();
  }, [assignRecord]);

  const handleAssignSubmit = async () => {
    const token = getApiToken();
    if (!token || !assignRecord) return;
    const profId = parseInt(selectedProfessionalId, 10);
    if (!selectedProfessionalId || isNaN(profId)) {
      toast.error("Please select a professional");
      return;
    }
    setAssignLoading(true);
    try {
      await assignProfessionalToQuoteRequest(token, assignRecord.id, profId);
      toast.success("Professional assigned successfully");
      setAssignRecord(null);
      setSelectedProfessionalId("");
      fetchRecords();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to assign professional");
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-[#0A1A2F] text-xl font-semibold mb-1">Custom Quote</h1>
        <p className="text-sm text-gray-500">Manage custom quote requests from customers.</p>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-[#0A1A2F]">Custom Quote Requests</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="all">All status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="quoted">Quoted</option>
                <option value="assigned">Assigned</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by customer, email, service, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No quote requests found.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">ID</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Service</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Professional</th>
                      <th className="text-right p-4 text-sm font-medium text-gray-700 w-12">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRecords.map((record) => {
                      const rd = parseRequestData(record.request_data);
                      return (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <p className="font-medium text-gray-900">#{record.id}</p>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{record.customer_name}</p>
                              <p className="text-xs text-gray-500">{record.customer_email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">
                              {record.service?.service_name ?? "—"}
                            </p>
                            {(rd.building_type || rd.people_count) && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {[rd.building_type, rd.people_count].filter(Boolean).join(" • ")}
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant="custom" style={statusStyle(record.status)}>{formatStatus(record.status)}</Badge>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">{formatDate(record.created_at)}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700">
                              {record.professional?.name ?? "—"}
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
                                  <DropdownMenuItem onClick={() => handleAssignProfessional(record)}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Assign Professional
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">
                {filteredRecords.map((record) => {
                  const rd = parseRequestData(record.request_data);
                  return (
                    <div
                      key={record.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">#{record.id} • {record.customer_name}</p>
                          <p className="text-sm text-gray-500">{record.service?.service_name ?? "—"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="custom" style={statusStyle(record.status)}>{formatStatus(record.status)}</Badge>
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
                                  className="h-8 w-8"
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
                                <DropdownMenuItem onClick={() => handleAssignProfessional(record)}>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Assign Professional
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{record.customer_email}</p>
                      {(rd.building_type || rd.people_count) && (
                        <p className="text-xs text-gray-600">
                          {rd.building_type} • {rd.people_count}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">{formatDate(record.created_at)}</p>
                      {record.professional?.name && (
                        <p className="text-xs text-gray-600">Professional: {record.professional.name}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog
        open={detailsRecordId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsRecordId(null);
            setDetailsRecord(null);
            setDetailsError(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-[#0A1A2F]">
                Quote Request #{detailsRecordId ?? detailsRecord?.id}
              </DialogTitle>
              {detailsRecord && (
                <Badge variant="custom" style={statusStyle(detailsRecord.status)}>{formatStatus(detailsRecord.status)}</Badge>
              )}
            </div>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
            </div>
          ) : detailsError ? (
            <div className="py-8 text-center">
              <p className="text-red-600 font-medium">{detailsError}</p>
            </div>
          ) : detailsRecord ? (
            <div className="space-y-6 pt-2">
              {/* Top row: Customer & Service */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="font-semibold text-gray-800">Customer</p>
                  </div>
                  <p className="text-gray-900 font-medium">{detailsRecord.customer_name}</p>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="break-words">{detailsRecord.customer_email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{detailsRecord.customer_phone}</span>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="font-semibold text-gray-800">Service</p>
                  </div>
                  <p className="text-gray-900 font-medium">{detailsRecord.service?.service_name ?? "—"}</p>
                </div>
              </div>

              {/* Middle row: Dates, User, Professional */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="font-semibold text-gray-800">Dates</p>
                  </div>
                  <p className="text-sm text-gray-700">Created: {formatDate(detailsRecord.created_at)}</p>
                  <p className="text-sm text-gray-700 mt-0.5">Updated: {formatDate(detailsRecord.updated_at)}</p>
                </div>
                {detailsRecord.user && (
                  <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="font-semibold text-gray-800">User Account</p>
                    </div>
                    <p className="text-gray-900 font-medium">{detailsRecord.user.full_name}</p>
                    <p className="text-sm text-gray-600">{detailsRecord.user.email}</p>
                  </div>
                )}
                {detailsRecord.professional && (
                  <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <p className="font-semibold text-gray-800">Assigned Professional</p>
                    </div>
                    <p className="text-gray-900 font-medium">{detailsRecord.professional.name}</p>
                    {detailsRecord.professional.email && (
                      <p className="text-sm text-gray-600">{detailsRecord.professional.email}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Request Details - full width */}
              {(() => {
                const rd = parseRequestData(detailsRecord.request_data);
                if (Object.keys(rd).length > 0) {
                  return (
                    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="font-semibold text-gray-800">Request Details</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {rd.building_type != null && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Building</p>
                            <p className="text-gray-900 font-medium mt-0.5">{String(rd.building_type)}</p>
                          </div>
                        )}
                        {rd.people_count != null && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">People</p>
                            <p className="text-gray-900 font-medium mt-0.5">{String(rd.people_count)}</p>
                          </div>
                        )}
                        {rd.floors != null && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Floors</p>
                            <p className="text-gray-900 font-medium mt-0.5">{String(rd.floors)}</p>
                          </div>
                        )}
                        {rd.assessment_type != null && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assessment</p>
                            <p className="text-gray-900 font-medium mt-0.5">{String(rd.assessment_type)}</p>
                          </div>
                        )}
                      </div>
                      {rd.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                          <p className="text-gray-700">{String(rd.notes)}</p>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog
        open={!!updateRecord}
        onOpenChange={(open) => {
          if (!open) {
            setUpdateRecord(null);
            setSelectedStatus("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          {updateRecord && (
            <div className="space-y-4 py-4">
              <p className="text-gray-600">
                Update status for quote request #{updateRecord.id} ({updateRecord.customer_name}).
              </p>
              <div>
                <Label htmlFor="status-select">Select Status</Label>
                <select
                  id="status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">Choose a status...</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateRecord(null)} disabled={updateLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatusSubmit}
              disabled={!selectedStatus.trim() || updateLoading}
            >
              {updateLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Professional Modal */}
      <Dialog
        open={!!assignRecord}
        onOpenChange={(open) => {
          if (!open) {
            setAssignRecord(null);
            setSelectedProfessionalId("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Professional</DialogTitle>
          </DialogHeader>
          {assignRecord && (
            <div className="space-y-4 py-4">
              <p className="text-gray-600">
                Assign a professional to quote request #{assignRecord.id} for {assignRecord.customer_name}.
              </p>
              <div>
                <Label htmlFor="professional-select">Select Professional</Label>
                {professionalsLoading ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-500">Loading professionals...</span>
                  </div>
                ) : (
                  <select
                    id="professional-select"
                    value={selectedProfessionalId}
                    onChange={(e) => setSelectedProfessionalId(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">Choose a professional...</option>
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.business_name ? `(${p.business_name})` : ""} - {p.email}
                      </option>
                    ))}
                  </select>
                )}
                {!professionalsLoading && professionals.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No professionals available.</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignRecord(null)} disabled={assignLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubmit}
              disabled={!selectedProfessionalId || assignLoading || professionalsLoading}
            >
              {assignLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
