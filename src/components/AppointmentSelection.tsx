import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { 
  Flame, 
  Calendar, 
  Clock, 
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import type { BookingData } from "./BookingFlow";

interface AppointmentSelectionProps {
  service: BookingData["service"];
  professional: BookingData["professional"];
  pricing: BookingData["pricing"];
  pricingErrorMessage?: string;
  onContinue: (date: string, time: string) => void;
  onBack: () => void;
}

export function AppointmentSelection({
  service,
  professional,
  pricing,
  pricingErrorMessage,
  onContinue,
  onBack
}: AppointmentSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  type DayInfo = {
    date: string;
    day: number;
    isAvailable: boolean;
  } | null;

  // Generate calendar days for current month
  const generateCalendarDays = (): DayInfo[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: DayInfo[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isAvailable = date >= today;
      
      days.push({
        date: dateStr,
        day,
        isAvailable
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onContinue(selectedDate, selectedTime);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-[#0A1A2F] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Flame className="w-8 h-8 text-red-500" />
          <span className="text-xl">Fire Guide</span>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white py-6 px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-red-600">Select Date & Time</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm text-gray-500">Your Details</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-gray-500">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <h1 className="text-[#0A1A2F] mb-8">Select Your Appointment</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Calendar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Service Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Property Type: <span className="text-gray-900">{service.propertyType}</span></p>
                        <p>Number of Floors: <span className="text-gray-900">{service.floors}</span></p>
                        <p>Number of People: <span className="text-gray-900">{service.people}</span></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Your Professional</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <img
                      src={professional.photo}
                      alt={professional.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                        {professional.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Rating: {professional.rating} ⭐ • Verified Professional</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Choose a Date
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={previousMonth}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[150px] text-center">{monthName}</span>
                      <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRightIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((dayInfo, index) => (
                      <div key={index}>
                        {dayInfo ? (
                          <button
                            onClick={() => dayInfo.isAvailable && setSelectedDate(dayInfo.date)}
                            disabled={!dayInfo.isAvailable}
                            className={`w-full aspect-square rounded-lg text-sm transition-all ${
                              selectedDate === dayInfo.date
                                ? "bg-red-600 text-white font-semibold"
                                : dayInfo.isAvailable
                                ? "bg-white border-2 border-gray-200 hover:border-red-300 text-gray-900"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {dayInfo.day}
                          </button>
                        ) : (
                          <div className="w-full aspect-square" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Select any available date. Appointments must be booked at least 24 hours in advance.
                  </p>
                </CardContent>
              </Card>

              {/* Time Slots */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Choose a Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label className="mb-3 block">Available time slots for {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 text-center rounded-lg border-2 transition-all ${
                            selectedTime === slot
                              ? "border-red-600 bg-red-50 text-red-600 font-semibold"
                              : "border-gray-200 hover:border-red-300"
                          }`}
                        >
                          <Clock className="w-4 h-4 inline mr-2" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1A2F]">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDate && selectedTime ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Appointment Selected</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {new Date(selectedDate).toLocaleDateString('en-GB', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-700">{selectedTime}</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Select a date and time to continue</p>
                        </div>
                      )}

                      {pricingErrorMessage ? (
                        <div className="pt-4 border-t rounded-lg border-amber-200 bg-amber-50 p-3">
                          <p className="text-sm text-amber-800">{pricingErrorMessage}</p>
                          <p className="text-xs text-amber-700 mt-1">Contact the professional or support for pricing.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service fee</span>
                            <span className="text-gray-900">£{pricing.servicePrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Platform fee</span>
                            <span className="text-gray-900">£{pricing.platformFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-semibold text-gray-900">£{pricing.total.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleContinue}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg"
                >
                  Continue to Details
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
