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
import { getWorkingDays, WorkingDayResponse, createProfessionalDay, getBlockedDays, deleteProfessionalDay, getMonthlyAvailability, getMonthlyAvailabilitySummary, ProfessionalDayResponse, MonthlyAvailabilityData, MonthlyAvailabilitySummaryData } from "../api/professionalsService";
import { getProfessionalId, getApiToken } from "../lib/auth";
import { getUpcomingBookings, UpcomingBookingItem } from "../api/bookingService";
import { toast } from "sonner";

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
  
  const [monthlyAvailability, setMonthlyAvailability] = useState<MonthlyAvailabilityData | null>(null);
  const [loadingMonthlyAvailability, setLoadingMonthlyAvailability] = useState(true);
  
  const [monthlySummary, setMonthlySummary] = useState<MonthlyAvailabilitySummaryData | null>(null);
  const [loadingMonthlySummary, setLoadingMonthlySummary] = useState(true);
  
  const removeBlockedDate = async (id: string) => {
    try {
      const apiToken = getApiToken();
      
      if (!apiToken) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      // Call delete API
      const response = await deleteProfessionalDay({
        api_token: apiToken,
        id: parseInt(id, 10)
      });

      // Check if response indicates failure
      if (response.status === false) {
        const errorMsg = response.message || "Failed to remove blocked date. Please try again.";
        if (errorMsg.toLowerCase().includes("invalid api token")) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(errorMsg);
        }
        return;
      }

      if (response.status === true) {
        toast.success("Blocked date removed successfully!");
        
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
        
        // Refresh monthly availability
        const availabilityResponse = await getMonthlyAvailability({ api_token: apiToken });
        if (availabilityResponse.data) {
          setMonthlyAvailability(availabilityResponse.data);
        }
        
        // Refresh monthly summary
        const summaryResponse = await getMonthlyAvailabilitySummary({ api_token: apiToken });
        if (summaryResponse.status === true && summaryResponse.data) {
          setMonthlySummary(summaryResponse.data);
        }
      } else {
        toast.error(response.message || "Failed to remove blocked date. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting blocked date:", error);
      const errorMessage = error?.message || error?.error || "Failed to remove blocked date. Please try again.";
      
      // Check if it's an authentication error
      if (errorMessage.toLowerCase().includes("invalid api token") || 
          errorMessage.toLowerCase().includes("unauthorized") ||
          error?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleAddBlock = async () => {
    if (newBlockDate && newBlockReason && newBlockStartTime && newBlockEndTime) {
      try {
        setIsAddingBlock(true);
        const apiToken = getApiToken();
        
        if (!apiToken) {
          toast.error("Authentication required. Please log in again.");
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

        // Check if response indicates failure
        if (response.status === false || !response.data) {
          const errorMsg = response.message || "Failed to add blocked date. Please try again.";
          if (errorMsg.toLowerCase().includes("invalid api token")) {
            toast.error("Your session has expired. Please log in again.");
          } else {
            toast.error(errorMsg);
          }
          return;
        }

        if (response.status === true && response.data) {
          toast.success("Blocked date added successfully!");
          
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
            
            // Refresh monthly availability
            const availabilityResponse = await getMonthlyAvailability({ api_token: apiToken });
            if (availabilityResponse.data) {
              setMonthlyAvailability(availabilityResponse.data);
            }
            
            // Refresh monthly summary
            const summaryResponse = await getMonthlyAvailabilitySummary({ api_token: apiToken });
            if (summaryResponse.status === true && summaryResponse.data) {
              setMonthlySummary(summaryResponse.data);
            }
          }
          
          // Reset form
          setNewBlockDate("");
          setNewBlockReason("");
          setNewBlockStartTime("");
          setNewBlockEndTime("");
          setIsAddBlockModalOpen(false);
        } else {
          toast.error(response.message || "Failed to add blocked date. Please try again.");
        }
      } catch (error: any) {
        console.error("Error adding blocked date:", error);
        const errorMessage = error?.message || error?.error || "Failed to add blocked date. Please try again.";
        
        // Check if it's an authentication error
        if (errorMessage.toLowerCase().includes("invalid api token") || 
            errorMessage.toLowerCase().includes("unauthorized") ||
            error?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(errorMessage);
        }
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
      } catch (error: any) {
        console.error("Error fetching blocked dates:", error);
        const errorMessage = error?.message || error?.error || "";
        
        // Only show toast for authentication errors
        if (errorMessage.toLowerCase().includes("invalid api token") || 
            errorMessage.toLowerCase().includes("unauthorized") ||
            error?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        }
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
      } catch (error: any) {
        console.error("Error fetching working days:", error);
        const errorMessage = error?.message || error?.error || "";
        
        // Only show toast for authentication errors
        if (errorMessage.toLowerCase().includes("invalid api token") || 
            errorMessage.toLowerCase().includes("unauthorized") ||
            error?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        }
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
      } catch (error: any) {
        console.error("Error fetching upcoming bookings:", error);
        const errorMessage = error?.message || error?.error || "";
        
        // Only show toast for authentication errors
        if (errorMessage.toLowerCase().includes("invalid api token") || 
            errorMessage.toLowerCase().includes("unauthorized") ||
            error?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        }
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchUpcomingBookings();
  }, []);

  // Fetch monthly availability on mount
  useEffect(() => {
    const fetchMonthlyAvailability = async () => {
      try {
        setLoadingMonthlyAvailability(true);
        const apiToken = getApiToken();
        
        if (!apiToken) {
          console.warn("API token not found for monthly availability");
          setLoadingMonthlyAvailability(false);
          return;
        }

        const response = await getMonthlyAvailability({ api_token: apiToken });
        
        // Check if response indicates failure
        if (response.status === false || !response.data) {
          const errorMsg = response.message || "Failed to load calendar data.";
          if (errorMsg.toLowerCase().includes("invalid api token")) {
            toast.error("Your session has expired. Please log in again.");
          } else {
            console.warn("Calendar loading error:", errorMsg);
          }
          return;
        }
        
        if (response.data) {
          console.log('Monthly availability received:', {
            month: response.data.month,
            pastCount: response.data.past?.length || 0,
            bookedCount: response.data.booked?.length || 0,
            blockedCount: response.data.blocked?.length || 0,
            availableCount: response.data.available?.length || 0,
            samplePast: response.data.past?.slice(0, 3),
            sampleBooked: response.data.booked?.slice(0, 3),
            sampleBlocked: response.data.blocked?.slice(0, 3),
            sampleAvailable: response.data.available?.slice(0, 3),
          });
          setMonthlyAvailability(response.data);
        } else if (response.message && response.message.toLowerCase().includes("invalid api token")) {
          toast.error("Your session has expired. Please log in again.");
        }
      } catch (error: any) {
        console.error("Error fetching monthly availability:", error);
        const errorMessage = error?.message || error?.error || "Failed to load calendar data.";
        
        // Check if it's an authentication error
        if (errorMessage.toLowerCase().includes("invalid api token") || 
            errorMessage.toLowerCase().includes("unauthorized") ||
            error?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          // Don't show toast for calendar loading errors to avoid spam
          console.warn("Calendar loading error:", errorMessage);
        }
      } finally {
        setLoadingMonthlyAvailability(false);
      }
    };

    fetchMonthlyAvailability();
  }, []);

  // Fetch monthly availability summary on mount and when blocked dates change
  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        setLoadingMonthlySummary(true);
        const apiToken = getApiToken();
        
        if (!apiToken) {
          console.warn("API token not found for monthly summary");
          setLoadingMonthlySummary(false);
          return;
        }

        const response = await getMonthlyAvailabilitySummary({ api_token: apiToken });
        
        // Check if response indicates failure
        if (response.status === false || !response.data) {
          const errorMsg = response.message || "Failed to load summary data.";
          if (errorMsg.toLowerCase().includes("invalid api token")) {
            toast.error("Your session has expired. Please log in again.");
          } else {
            console.warn("Summary loading error:", errorMsg);
          }
          return;
        }
        
        if (response.data) {
          console.log('Monthly summary received:', response.data);
          setMonthlySummary(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching monthly summary:", error);
        const errorMessage = error?.message || error?.error || "";
        
        // Check if it's an authentication error
        if (errorMessage.toLowerCase().includes("invalid api token") || 
            errorMessage.toLowerCase().includes("unauthorized") ||
            error?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          console.warn("Summary loading error:", errorMessage);
        }
      } finally {
        setLoadingMonthlySummary(false);
      }
    };

    fetchMonthlySummary();
  }, [blockedDates]); // Re-fetch when blockedDates change

  // Define week days order for sorting
  const weekDaysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Sort working days by week day order
  const sortedWorkingDays = [...workingDays].sort((a, b) => {
    const indexA = weekDaysOrder.indexOf(a.week_day);
    const indexB = weekDaysOrder.indexOf(b.week_day);
    return indexA - indexB;
  });

  // Use API summary data if available, otherwise fallback to calculated values
  const currentMonthBookings = monthlySummary?.book_count ?? upcomingBookings.filter(b => 
    new Date(b.date).getMonth() === new Date().getMonth()
  ).length;
  const currentMonthBlocked = monthlySummary?.block_count ?? blockedDates.filter(d => 
    new Date(d.date).getMonth() === new Date().getMonth()
  ).length;
  const currentMonthAvailable = monthlySummary?.available_count ?? (30 - currentMonthBookings - currentMonthBlocked);

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
                <p className="text-3xl font-semibold text-gray-900">
                  {loadingMonthlySummary ? '...' : currentMonthBookings}
                </p>
                <p className="text-sm text-gray-500">Bookings</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Blocked Days</p>
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-semibold text-gray-900">
                  {loadingMonthlySummary ? '...' : currentMonthBlocked}
                </p>
                <p className="text-sm text-gray-500">This Month</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-green-700">Available</p>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-semibold text-green-900">
                  {loadingMonthlySummary ? '...' : currentMonthAvailable}
                </p>
                <p className="text-sm text-green-700">Days Open</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>{monthlyAvailability?.month || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardTitle>
              <CardDescription>Click on dates to block or unblock availability</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingMonthlyAvailability ? (
                <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 animate-spin" />
                    <p>Loading calendar...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {(() => {
                      // Get current month and year from API data or use current date
                      let year: number;
                      let month: number;
                      
                      if (monthlyAvailability?.month) {
                        // Parse month string like "January 2026" or "December 2025"
                        const monthParts = monthlyAvailability.month.split(' ');
                        if (monthParts.length >= 2) {
                          const monthName = monthParts[0]; // "January" or "December"
                          year = parseInt(monthParts[1], 10); // "2026" or "2025"
                          // Create a date object to get the month index (0-11)
                          const tempDate = new Date(`${monthName} 1, ${year}`);
                          month = tempDate.getMonth();
                        } else {
                          // Fallback to current date if parsing fails
                          const currentDate = new Date();
                          year = currentDate.getFullYear();
                          month = currentDate.getMonth();
                        }
                      } else {
                        const currentDate = new Date();
                        year = currentDate.getFullYear();
                        month = currentDate.getMonth();
                      }
                      
                      // Get first day of month and number of days
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      
                      // Create array of all dates in the month
                      const dates: Array<{ day: number; dateStr: string; status: 'past' | 'booked' | 'blocked' | 'available' | 'empty' }> = [];
                      
                      // Add empty cells for days before the first day of the month
                      for (let i = 0; i < firstDay; i++) {
                        dates.push({ day: 0, dateStr: '', status: 'empty' });
                      }
                      
                      // Add all days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        let status: 'past' | 'booked' | 'blocked' | 'available' = 'available';
                        
                        if (monthlyAvailability) {
                          // Check status in priority order: past > booked > blocked > available
                          const pastDates = monthlyAvailability.past || [];
                          const bookedDates = monthlyAvailability.booked || [];
                          const blockedDates = monthlyAvailability.blocked || [];
                          const availableDates = monthlyAvailability.available || [];
                          
                          if (pastDates.includes(dateStr)) {
                            status = 'past';
                          } else if (bookedDates.includes(dateStr)) {
                            status = 'booked';
                          } else if (blockedDates.includes(dateStr)) {
                            status = 'blocked';
                          } else if (availableDates.includes(dateStr)) {
                            status = 'available';
                          }
                        }
                        
                        dates.push({ day, dateStr, status });
                      }
                      
                      return dates.map((dateInfo, index) => {
                        if (dateInfo.status === 'empty') {
                          return <div key={`empty-${index}`} className="aspect-square"></div>;
                        }
                        
                        const { day, dateStr, status } = dateInfo;
                        const isPast = status === 'past';
                        const isBlocked = status === 'blocked';
                        const isBooked = status === 'booked';
                        const isAvailable = status === 'available';
                        
                        return (
                          <button
                            key={dateStr}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                              isPast
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : isBlocked
                                ? 'bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200'
                                : isBooked
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-default'
                                : isAvailable
                                ? 'bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                : 'bg-white border border-gray-200'
                            }`}
                            disabled={isPast || isBooked}
                            onClick={() => {
                              if (isAvailable && !isPast) {
                                // Open modal to block this date
                                setIsAddBlockModalOpen(true);
                                setNewBlockDate(dateStr);
                              }
                            }}
                          >
                            {day}
                          </button>
                        );
                      });
                    })()}
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
              )}
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
