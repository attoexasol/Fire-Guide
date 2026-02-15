import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, MoreVertical, Eye, Pencil, Trash2, Plus } from "lucide-react";
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
import { fetchPropertyTypes } from "../api/servicesService";
import { toast } from "sonner";
import { getApiToken, getProfessionalId } from "../lib/auth";

interface FRABasePriceContentProps {
  /** When true, shows all records (Admin). When false, filters by current professional (Professional). */
  isAdmin?: boolean;
}

export function FRABasePriceContent({ isAdmin = false }: FRABasePriceContentProps) {
  const [records, setRecords] = useState<ProfessionalFraBasePriceItem[]>([]);
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

      const response = await getProfessionalFraBasePricesAll(apiToken);
      if (response.status && Array.isArray(response.data)) {
        let data = response.data;

        if (!isAdmin) {
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
          setRecords(data);
        }
      } else {
        setRecords([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch FRA base price records");
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        <h1 className="text-[#0A1A2F] text-xl font-semibold mb-1">FRA Base Price</h1>
        <p className="text-sm text-gray-500">
          Fire Risk Assessment base prices by property type
        </p>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-[#0A1A2F]">FRA Base Prices</CardTitle>
            <Button size="sm" className="shrink-0 w-fit" onClick={handleAddFraPrice}>
              <Plus className="w-4 h-4 mr-2" />
              Add FRA Price
            </Button>
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

          {!isLoading && !error && records.length > 0 && (
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

          {!isLoading && !error && records.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No FRA base price records found</p>
            </div>
          )}
        </CardContent>
      </Card>

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
