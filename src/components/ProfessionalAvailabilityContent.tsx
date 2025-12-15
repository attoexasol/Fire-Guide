import { useState } from "react";
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

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  client: string;
  status: "confirmed" | "pending" | "completed";
}

export function ProfessionalAvailabilityContent() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    { id: "1", date: "2025-12-15", reason: "Personal commitment" },
    { id: "2", date: "2025-12-25", reason: "Christmas Day" },
    { id: "3", date: "2026-01-01", reason: "New Year's Day" }
  ]);

  const [upcomingBookings] = useState<Booking[]>([
    {
      id: "1",
      date: "2025-12-20",
      time: "10:00 AM",
      service: "Fire Risk Assessment",
      client: "ABC Office Ltd",
      status: "confirmed"
    },
    {
      id: "2",
      date: "2025-12-22",
      time: "2:00 PM",
      service: "Fire Extinguisher Service",
      client: "XYZ Retail Shop",
      status: "confirmed"
    },
    {
      id: "3",
      date: "2025-12-23",
      time: "9:00 AM",
      service: "Fire Door Inspection",
      client: "Tech Startup Inc",
      status: "pending"
    },
    {
      id: "4",
      date: "2026-01-05",
      time: "11:00 AM",
      service: "Fire Alarm Service",
      client: "Local Restaurant",
      status: "confirmed"
    }
  ]);

  const removeBlockedDate = (id: string) => {
    setBlockedDates(blockedDates.filter(date => date.id !== id));
  };

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
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blockedDates.length === 0 ? (
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
                          <X className="w-5 h-5 text-red-600" />
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
                        <p className="text-sm text-gray-600">{booking.client}</p>
                      </div>
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700 text-xs"
                            : "bg-yellow-100 text-yellow-700 text-xs"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
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

                {upcomingBookings.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming bookings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm">Working Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { day: 'Monday', hours: '9:00 AM - 6:00 PM', enabled: true },
                  { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', enabled: true },
                  { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', enabled: true },
                  { day: 'Thursday', hours: '9:00 AM - 6:00 PM', enabled: true },
                  { day: 'Friday', hours: '9:00 AM - 5:00 PM', enabled: true },
                  { day: 'Saturday', hours: 'Closed', enabled: false },
                  { day: 'Sunday', hours: 'Closed', enabled: false }
                ].map((schedule) => (
                  <div key={schedule.day} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{schedule.day}</span>
                    <span className={schedule.enabled ? "text-gray-600" : "text-gray-400"}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Update Hours
              </Button>
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
