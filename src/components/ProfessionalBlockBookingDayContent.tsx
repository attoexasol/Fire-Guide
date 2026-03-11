import React, { useState, useEffect } from "react";
import { CalendarX2, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { getApiToken } from "../lib/auth";
import {
  blockProfessionalBookingDays,
  getBlockedBookingDaysList,
  deleteBlockedBookingDay,
  updateBlockedBookingDay,
  BlockedBookingDayItem,
} from "../api/professionalsService";
import { toast } from "sonner";

function formatBlockDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function toDateInputValue(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ProfessionalBlockBookingDayContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockList, setBlockList] = useState<BlockedBookingDayItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BlockedBookingDayItem | null>(null);

  const fetchBlockList = async () => {
    const apiToken = getApiToken();
    if (!apiToken) {
      setBlockList([]);
      setIsLoadingList(false);
      return;
    }
    try {
      setIsLoadingList(true);
      const data = await getBlockedBookingDaysList(apiToken);
      setBlockList(data ?? []);
    } catch {
      setBlockList([]);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchBlockList();
  }, []);

  const handleOpenModal = () => {
    setEditingId(null);
    setStartDay("");
    setEndDay("");
    setModalOpen(true);
  };

  const handleEdit = (item: BlockedBookingDayItem) => {
    setEditingId(item.id);
    setStartDay(toDateInputValue(item.start_day));
    setEndDay(toDateInputValue(item.end_day) || toDateInputValue(item.start_day));
    setModalOpen(true);
  };

  const handleDeleteClick = (item: BlockedBookingDayItem) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const apiToken = getApiToken();
    if (!apiToken) {
      toast.error("Please log in to delete.");
      setItemToDelete(null);
      return;
    }
    setDeletingId(itemToDelete.id);
    try {
      await deleteBlockedBookingDay(apiToken, itemToDelete.id);
      toast.success("Blocked period removed.");
      setItemToDelete(null);
      fetchBlockList();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = startDay.trim();
    const end = endDay.trim();
    if (!start) {
      toast.error("Please select a start date.");
      return;
    }
    const endDate = end || start;
    if (endDate < start) {
      toast.error("End date must be on or after start date.");
      return;
    }

    const apiToken = getApiToken();
    if (!apiToken) {
      toast.error("Please log in to block booking days.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId !== null) {
        await updateBlockedBookingDay(apiToken, editingId, start, endDate);
        toast.success("Block updated.");
      } else {
        await blockProfessionalBookingDays({
          api_token: apiToken,
          start_day: start,
          end_day: endDate,
        });
        toast.success("Booking days blocked successfully.");
      }
      setModalOpen(false);
      setEditingId(null);
      setStartDay("");
      setEndDay("");
      fetchBlockList();
    } catch (err: any) {
      toast.error(err?.message || "Failed to block booking days.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-row items-start justify-between gap-4 mb-6 w-full">
        <div className="flex-1 min-w-0">
          <h1 className="text-[#0A1A2F] text-xl font-semibold mb-1">Block Booking Day</h1>
          <p className="text-gray-600">
            Block specific days when you are not available for bookings.
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          className="bg-red-600 hover:bg-red-700 flex-shrink-0"
        >
          Add Block
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {isLoadingList ? (
            <div className="py-12 text-center text-gray-500">Loading blocked days…</div>
          ) : blockList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <CalendarX2 className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600">
                Block a single day or a date range to prevent customers from booking.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {blockList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <CalendarX2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatBlockDate(item.start_day)}
                        {item.start_day !== item.end_day && item.end_day
                          ? ` – ${formatBlockDate(item.end_day)}`
                          : ""}
                      </p>
                      {item.professional?.name && (
                        <p className="text-sm text-gray-500">{item.professional.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteClick(item)}
                      disabled={deletingId === item.id}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingId(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0A1A2F]">
              {editingId !== null ? "Edit block" : "Block booking days"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="start_day" className="block text-sm font-medium text-gray-700 mb-1">
                Start date
              </label>
              <input
                id="start_day"
                type="date"
                required
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div>
              <label htmlFor="end_day" className="block text-sm font-medium text-gray-700 mb-1">
                End date (optional — leave same as start for one day)
              </label>
              <input
                id="end_day"
                type="date"
                value={endDay}
                min={startDay || undefined}
                onChange={(e) => setEndDay(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                {isSubmitting ? (editingId !== null ? "Updating…" : "Submitting…") : editingId !== null ? "Update" : "Block days"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0A1A2F]">Remove blocked period?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            {itemToDelete ? (
              <>
                Remove the block from{" "}
                <strong>
                  {formatBlockDate(itemToDelete.start_day)}
                  {itemToDelete.start_day !== itemToDelete.end_day && itemToDelete.end_day
                    ? ` – ${formatBlockDate(itemToDelete.end_day)}`
                    : ""}
                </strong>
                ? This cannot be undone.
              </>
            ) : (
              "This blocked period will be removed."
            )}
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setItemToDelete(null)}
              disabled={deletingId !== null}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
              disabled={deletingId !== null}
            >
              {deletingId === itemToDelete?.id ? "Deleting…" : "Sure"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
