import React, { useState, useEffect, type CSSProperties } from "react";
import { Search, Loader2, FileText, MoreVertical, User, Mail, Phone, Calendar, Building2, Eye } from "lucide-react";
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
} from "./ui/dialog";
import {
  getProfessionalCustomQuoteRequests,
  ProfessionalQuoteRequestItem,
  ProfessionalCustomQuoteResponse,
} from "../api/customQuoteRequestsService";
import { getApiToken } from "../lib/auth";

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

function serviceSubline(rd: Record<string, unknown>): string {
  const parts: string[] = [];
  if (rd.building_type) parts.push(String(rd.building_type));
  if (rd.people_count) parts.push(String(rd.people_count));
  if (rd.floors != null) parts.push(String(rd.floors));
  if (rd.training_people_count) parts.push(String(rd.training_people_count));
  return parts.filter(Boolean).join(" • ");
}

export function ProfessionalCustomQuoteContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [data, setData] = useState<ProfessionalCustomQuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsRecord, setDetailsRecord] = useState<ProfessionalQuoteRequestItem | null>(null);

  const requests: ProfessionalQuoteRequestItem[] = data?.requests ?? [];
  const professionalName = data?.professional?.full_name ?? "—";

  const fetchData = async () => {
    const token = getApiToken();
    if (!token) {
      setError("Not authenticated");
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProfessionalCustomQuoteRequests(token);
      setData(response);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load quote requests";
      setError(msg);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRecords = requests.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      record.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.service?.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0A1A2F]">Custom Quote</h1>
        <p className="text-gray-600 mt-1">Manage custom quote requests from customers.</p>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-[#0A1A2F]">Custom Quote Requests</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
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
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">ID</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Service</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Professional</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-700 min-w-[7rem]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredRecords.map((record) => {
                    const rd = parseRequestData(record.request_data);
                    const subline = serviceSubline(rd);
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
                          {subline && (
                            <p className="text-xs text-gray-500 mt-0.5">{subline}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant="custom" style={statusStyle(record.status)}>
                            {formatStatus(record.status)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700">{formatDate(record.created_at)}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700">{professionalName}</p>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1 group/actions">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 opacity-0 group-hover/actions:opacity-100 transition-opacity duration-200 ease-out"
                              onClick={() => setDetailsRecord(record)}
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-[10rem]">
                                <DropdownMenuItem
                                  onClick={() => setDetailsRecord(record)}
                                >
                                  View Details
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
          )}
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Dialog
        open={detailsRecord !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsRecord(null);
        }}
      >
        <DialogContent className="max-w-3xl w-[95vw] max-h-[70vh] overflow-hidden flex flex-col rounded-xl transition-all duration-300 ease-out">
          <DialogHeader className="border-b border-gray-100 pb-4 flex-shrink-0">
            <div>
              <DialogTitle className="text-xl font-bold text-[#0A1A2F]">
                Customer Details
              </DialogTitle>
              {detailsRecord && (
                <p className="text-sm text-gray-600 font-normal mt-1">
                  {detailsRecord.customer_name}
                </p>
              )}
            </div>
          </DialogHeader>
          {detailsRecord && (
            <div className="space-y-6 pt-2 overflow-y-auto flex-1 min-h-0">
              {/* Customer details – primary focus */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="font-semibold text-gray-800">Contact information</p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-900 font-medium text-lg">{detailsRecord.customer_name}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0 text-gray-500" />
                    <a
                      href={`mailto:${detailsRecord.customer_email}`}
                      className="break-all text-blue-600 hover:underline"
                    >
                      {detailsRecord.customer_email}
                    </a>
                  </div>
                  {detailsRecord.customer_phone ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      <a
                        href={`tel:${detailsRecord.customer_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {detailsRecord.customer_phone}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">No phone provided</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related quote request context */}
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <p className="font-semibold text-gray-800 mb-3">Related quote request</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Request #{detailsRecord.id}</span>
                  <Badge variant="custom" style={statusStyle(detailsRecord.status)}>
                    {formatStatus(detailsRecord.status)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service</p>
                    <p className="text-gray-900 mt-0.5">{detailsRecord.service?.service_name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dates</p>
                    <p className="text-gray-700 mt-0.5">Created: {formatDate(detailsRecord.created_at)}</p>
                    <p className="text-gray-700 mt-0.5">Updated: {formatDate(detailsRecord.updated_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Professional</p>
                    <p className="text-gray-700 mt-0.5">{professionalName}</p>
                  </div>
                </div>
              </div>

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
                        {rd.training_people_count != null && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Training</p>
                            <p className="text-gray-900 font-medium mt-0.5">{String(rd.training_people_count)}</p>
                          </div>
                        )}
                      </div>
                      {rd.notes != null && String(rd.notes).trim() !== "" ? (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                          <p className="text-gray-700">{String(rd.notes)}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
