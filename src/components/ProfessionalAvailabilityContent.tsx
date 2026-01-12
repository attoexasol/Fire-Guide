import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  X,
  Plus,
  Info,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getWorkingDays, WorkingDayResponse, createProfessionalDay, getBlockedDays, deleteProfessionalDay, ProfessionalDayResponse } from "../api/professionalsService";
import { getProfessionalId, getApiToken } from "../lib/auth";
import { getUpcomingBookings, UpcomingBookingItem } from "../api/bookingService";

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
  start_time?: string;
  end_time?: string;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  client: string;
  status: "confirmed" | "pending" | "completed";
  additional_notes?: string;
}

export function ProfessionalAvailabilityContent() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loadingBlockedDates, setLoadingBlockedDates] = useState(true);

  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [newBlockStartTime, setNewBlockStartTime] = useState("");
  const [newBlockEndTime, setNewBlockEndTime] = useState("");
  const [isAddingBlock, setIsAddingBlock] = useState(false);

  const [workingDays, setWorkingDays] = useState<WorkingDayResponse[]>([]);
  const [loadingWorkingDays, setLoadingWorkingDays] = useState(true);

  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
console.log(upcomingBookings);
  const removeBlockedDate = async (id: string) => {
    try {
      const apiToken = getApiToken();
      
      if (!apiToken) {
        console.error("API token not found");
        return;
      }

      // Call delete API
      const response = await deleteProfessionalDay({
        api_token: apiToken,
        id: parseInt(id, 10)
      });

      if (response.status === true) {
        // Refresh blocked dates list by fetching from API
        const blockedResponse = await getBlockedDays({ api_token: apiToken });
        if (blockedResponse.status === true && blockedResponse.data) {
          const mappedBlockedDates: BlockedDate[] = blockedResponse.data.map((item: ProfessionalDayResponse) => ({
            id: item.id.toString(),
            date: item.date.split('T')[0], // Extract date from ISO string
            reason: item.reason,
            start_time: item.start_time,
            end_time: item.end_time
          }));
          setBlockedDates(mappedBlockedDates);
        }
      }
    } catch (error) {
      console.error("Error deleting blocked date:", error);
      // You could add a toast notification here to show error message
    }
  };

  const handleAddBlock = async () => {
    if (newBlockDate && newBlockReason && newBlockStartTime && newBlockEndTime) {
      try {
        setIsAddingBlock(true);
        const apiToken = getApiToken();
        
        if (!apiToken) {
          console.error("API token not found");
          setIsAddingBlock(false);
          return;
        }

        // Format time from HH:MM to HH:MM format (API expects "09:00" format)
        const formatTimeForAPI = (time: string): string => {
          // If time is in HH:MM format, return as is
          if (time.match(/^\d{2}:\d{2}$/)) {
            return time;
          }
          // If time is in HH:MM:SS format, remove seconds
          if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
            return time.substring(0, 5);
          }
          return time;
        };

        const response = await createProfessionalDay({
          api_token: apiToken,
          type: "block",
          date: newBlockDate,
          start_time: formatTimeForAPI(newBlockStartTime),
          end_time: formatTimeForAPI(newBlockEndTime),
          reason: newBlockReason
        });

        if (response.status === true && response.data) {
          // Refresh blocked dates list by fetching from API
          const apiToken = getApiToken();
          if (apiToken) {
            const blockedResponse = await getBlockedDays({ api_token: apiToken });
            if (blockedResponse.status === true && blockedResponse.data) {
              const mappedBlockedDates: BlockedDate[] = blockedResponse.data.map((item: ProfessionalDayResponse) => ({
                id: item.id.toString(),
                date: item.date.split('T')[0], // Extract date from ISO string
                reason: item.reason,
                start_time: item.start_time,
                end_time: item.end_time
              }));
              setBlockedDates(mappedBlockedDates);
            }
          }
          
          // Reset form
          setNewBlockDate("");
          setNewBlockReason("");
          setNewBlockStartTime("");
          setNewBlockEndTime("");
          setIsAddBlockModalOpen(false);
        }
      } catch (error) {
        console.error("Error adding blocked date:", error);
        // You could add a toast notification here
      } finally {
        setIsAddingBlock(false);
      }
    }
  };

  const handleCancelAddBlock = () => {
    setNewBlockDate("");
    setNewBlockReason("");
    setNewBlockStartTime("");
    setNewBlockEndTime("");
    setIsAddBlockModalOpen(false);
  };

  // Format time from "HH:MM:SS" to "HH:MM AM/PM"
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Fetch blocked dates on mount
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        setLoadingBlockedDates(true);
        const apiToken = getApiToken();
        
        if (!apiToken) {
          setLoadingBlockedDates(false);
          return;
        }

        const response = await getBlockedDays({ api_token: apiToken });
        
        if (response.status === true && response.data) {
          // Map API response to BlockedDate interface
          const mappedBlockedDates: BlockedDate[] = response.data.map((item: ProfessionalDayResponse) => ({
            id: item.id.toString(),
            date: item.date.split('T')[0], // Extract date from ISO string (YYYY-MM-DD)
            reason: item.reason,
            start_time: item.start_time,
            end_time: item.end_time
          }));
          setBlockedDates(mappedBlockedDates);
        }
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      } finally {
        setLoadingBlockedDates(false);
      }
    };

    fetchBlockedDates();
  }, []);

  // Fetch working days on mount
  useEffect(() => {
    const fetchWorkingDays = async () => {
      try {
        setLoadingWorkingDays(true);
        const apiToken = getApiToken();
        
        if (!apiToken) {
          setLoadingWorkingDays(false);
          return;
        }

        const response = await getWorkingDays({ api_token: apiToken });
        
        if (response.status === true && response.data) {
          setWorkingDays(response.data);
        }
      } catch (error) {
        console.error("Error fetching working days:", error);
      } finally {
        setLoadingWorkingDays(false);
      }
    };

    fetchWorkingDays();
  }, []);

  // Fetch upcoming bookings on mount
  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      try {
        setLoadingBookings(true);
        const apiToken = getApiToken();
        
        if (!apiToken) {
          setLoadingBookings(false);
          return;
        }

        const response = await getUpcomingBookings({ api_token: apiToken });
        
        if (response.status === true && response.data) {
          // Map API response to component Booking interface using exact API keys
          const mappedBookings: Booking[] = response.data.map((item: UpcomingBookingItem, index: number) => {
            // Get client name from available fields (API response may not always include client info)
            const clientName = item.client_name || 
                              (item.first_name && item.last_name 
                                ? `${item.first_name} ${item.last_name}` 
                                : item.first_name || item.email || "Client");

            // Map status - ensure it matches the Booking interface type
            let bookingStatus: "confirmed" | "pending" | "completed" = "pending";
            const statusLower = item.status?.toLowerCase() || "";
            if (statusLower === "confirmed") {
              bookingStatus = "confirmed";
            } else if (statusLower === "completed") {
              bookingStatus = "completed";
            } else {
              bookingStatus = "pending";
            }

            // Use exact API response keys: selected_date, selected_time, service_name, status, additional_notes
            return {
              id: item.id?.toString() || `booking-${index}`,
              date: item.selected_date, // Exact API key
              time: item.selected_time, // Exact API key
              service: item.service_name, // Exact API key
              client: clientName,
              status: bookingStatus, // Mapped from API status
              additional_notes: item.additional_notes // Exact API key
            };
          });

          setUpcomingBookings(mappedBookings);
        }
      } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchUpcomingBookings();
  }, []);

  // Define week days order for sorting
  const weekDaysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Sort working days by week day order
  const sortedWorkingDays = [...workingDays].sort((a, b) => {
    const indexA = weekDaysOrder.indexOf(a.week_day);
    const indexB = weekDaysOrder.indexOf(b.week_day);
    return indexA - indexB;
  });

  // Calculate current month's stats
  const currentMonthBookings = upcomingBookings.filter(b => 
    new Date(b.date).getMonth() === new Date().getMonth()
  ).length;
  const currentMonthBlocked = blockedDates.filter(d => 
    new Date(d.date).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[#0A1A2F] mb-2">
          Manage Your Availability
        </h1>
        <p className="text-gray-600">
          Block days when you're unavailable and view your booked appointments
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Calendar Section - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">This Month</p>
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-semibold text-gray-900">{currentMonthBookings}</p>
                <p className="text-sm text-gray-500">Bookings</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Blocked Days</p>
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-semibold text-gray-900">{currentMonthBlocked}</p>
                <p className="text-sm text-gray-500">This Month</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-green-700">Available</p>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-semibold text-green-900">{30 - currentMonthBookings - currentMonthBlocked}</p>
                <p className="text-sm text-green-700">Days Open</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Placeholder */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>December 2025</CardTitle>
              <CardDescription>Click on dates to block or unblock availability</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simple calendar grid representation */}
              <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {/* Simplified calendar days */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const dateStr = `2025-12-${String(day).padStart(2, '0')}`;
                    const isBlocked = blockedDates.some(d => d.date === dateStr);
                    const hasBooking = upcomingBookings.some(b => b.date === dateStr);
                    const isPast = day < new Date().getDate();

                    return (
                      <button
                        key={day}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                          isPast
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isBlocked
                            ? 'bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200'
                            : hasBooking
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-default'
                            : 'bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                        disabled={isPast || hasBooking}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                    <span className="text-sm text-gray-600">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                    <span className="text-sm text-gray-600">Blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span className="text-sm text-gray-600">Past</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blocked Dates List */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Blocked Dates</CardTitle>
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setIsAddBlockModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingBlockedDates ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 animate-spin" />
                  <p>Loading blocked dates...</p>
                </div>
              ) : blockedDates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No blocked dates. Click "Add Block" to block unavailable days.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blockedDates.map((blocked) => (
                    <div
                      key={blocked.id}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <X className="w-5 h-5 text-red-600"   onClick={() => removeBlockedDate(blocked.id)} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(blocked.date).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">{blocked.reason}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlockedDate(blocked.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Block Modal */}
          <Dialog open={isAddBlockModalOpen} onOpenChange={setIsAddBlockModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block a Date</DialogTitle>
                <DialogDescription>
                  Select a date and provide a reason for blocking it from availability.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 px-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="blockDate">Date *</Label>
                  <Input
                    id="blockDate"
                    type="date"
                    value={newBlockDate}
                    onChange={(e) => setNewBlockDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blockStartTime">Start Time *</Label>
                    <Input
                      id="blockStartTime"
                      type="time"
                      value={newBlockStartTime}
                      onChange={(e) => setNewBlockStartTime(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blockEndTime">End Time *</Label>
                    <Input
                      id="blockEndTime"
                      type="time"
                      value={newBlockEndTime}
                      onChange={(e) => setNewBlockEndTime(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockReason">Reason *</Label>
                  <Input
                    id="blockReason"
                    type="text"
                    value={newBlockReason}
                    onChange={(e) => setNewBlockReason(e.target.value)}
                    placeholder="e.g., Personal commitment, Holiday, etc."
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCancelAddBlock}
                  disabled={isAddingBlock}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleAddBlock}
                  disabled={!newBlockDate || !newBlockReason || !newBlockStartTime || !newBlockEndTime || isAddingBlock}
                >
                  {isAddingBlock ? "Adding..." : "Add Block"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sidebar - Takes 1 column on desktop */}
        <div className="space-y-6">
          {/* Upcoming Bookings - Sticky on desktop */}
          <Card className="border-0 shadow-md sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Upcoming Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-gray-300 animate-spin" />
                  <p className="text-sm">Loading bookings...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm mb-1">
                            {booking.service}
                          </p>
                          <p className="text-sm text-gray-600">{booking.additional_notes}</p>
                        </div>
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className={
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700 text-xs"
                              : booking.status === "completed"
                              ? "bg-gray-100 text-gray-700 text-xs"
                              : "bg-yellow-100 text-yellow-700 text-xs"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(booking.date).toLocaleDateString('en-GB', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </span>
                      </div>
                    
                    </div>
                  ))}

                  {upcomingBookings.length === 0 && !loadingBookings && (
                    <div className="text-center py-6 text-gray-500">
                      <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No upcoming bookings</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm">Working Hours</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingWorkingDays ? (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-gray-300 animate-spin" />
                  <p className="text-sm">Loading working hours...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {sortedWorkingDays.length > 0 ? (
                      sortedWorkingDays.map((workingDay) => {
                        const isClosed = workingDay.is_closed === 1;
                        const hours = isClosed 
                          ? "Closed" 
                          : `${formatTime(workingDay.start_time)} - ${formatTime(workingDay.end_time)}`;

                        // Apply lighter gray for "Closed", darker for active hours
                        const textColorClass = isClosed ? "text-gray-400" : "text-gray-600";

                        return (
                          <div key={workingDay.id} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900">{workingDay.week_day}</span>
                            <span className={textColorClass}>
                              {hours}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">No working hours set</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Update Hours
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-0 shadow-md bg-blue-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Availability Tips</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep your calendar updated</li>
                    <li>• Block dates in advance</li>
                    <li>• Set realistic working hours</li>
                    <li>• Respond to bookings promptly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
