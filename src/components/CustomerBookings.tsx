import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  FileText,
  Download,
  X,
  CheckCircle,
  Building2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { Booking } from "../App";

interface CustomerBookingsProps {
  bookings: Booking[];
  onUpdateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export function CustomerBookings({ bookings, onUpdateBooking, onDeleteBooking }: CustomerBookingsProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

  const filteredBookings = bookings.filter(booking => 
    filter === "all" ? true : booking.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    toast.success("Booking cancelled successfully. Refund will be processed within 5-7 days.");
    setSelectedBooking(null);
    onDeleteBooking(bookingId);
  };

  const handleDownloadReport = (bookingRef: string) => {
    toast.success(`Downloading report for ${bookingRef}...`);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          All Bookings ({bookings.length})
        </Button>
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          onClick={() => setFilter("upcoming")}
          className={filter === "upcoming" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Upcoming ({bookings.filter(b => b.status === "upcoming").length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Completed ({bookings.filter(b => b.status === "completed").length})
        </Button>
        <Button
          variant={filter === "cancelled" ? "default" : "outline"}
          onClick={() => setFilter("cancelled")}
          className={filter === "cancelled" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Cancelled ({bookings.filter(b => b.status === "cancelled").length})
        </Button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bookings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[#0A1A2F] mb-1">{booking.service}</h3>
                        <p className="text-sm text-gray-600">Ref: {booking.bookingRef}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{booking.professional}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{booking.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-gray-900">
                        Total: <span className="font-semibold">{booking.price}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 md:flex-none"
                    >
                      View Details
                    </Button>
                    {booking.status === "upcoming" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none text-red-600 hover:text-red-700"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    {booking.status === "completed" && booking.hasReport && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        onClick={() => handleDownloadReport(booking.bookingRef)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Report
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedBooking?.bookingRef}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[#0A1A2F]">{selectedBooking.service}</h3>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Date & Time</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(selectedBooking.date).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{selectedBooking.time}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <span>{selectedBooking.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Professional</p>
                    <div className="flex items-center gap-3 mb-3">
                      {selectedBooking.professionalImage ? (
                        <img
                          src={selectedBooking.professionalImage}
                          alt={selectedBooking.professional}
                          className={`w-12 h-12 object-cover ${
                            selectedBooking.professionalType === "company" 
                              ? "rounded-lg" 
                              : "rounded-full"
                          }`}
                        />
                      ) : (
                        <div className={`w-12 h-12 bg-gray-200 flex items-center justify-center ${
                          selectedBooking.professionalType === "company" 
                            ? "rounded-lg" 
                            : "rounded-full"
                        }`}>
                          {selectedBooking.professionalType === "company" ? (
                            <Building2 className="w-6 h-6 text-gray-500" />
                          ) : (
                            <User className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                      )}
                      <span>{selectedBooking.professional}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedBooking.professionalEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedBooking.professionalPhone}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Payment</p>
                    <p className="text-2xl font-bold text-[#0A1A2F]">{selectedBooking.price}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="w-4 h-4" />
                      Paid
                    </p>
                  </div>
                </div>
              </div>

              {selectedBooking.status === "completed" && selectedBooking.hasReport && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Compliance Report Available</p>
                        <p className="text-sm text-green-700">Download your fire safety report</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownloadReport(selectedBooking.bookingRef)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {selectedBooking.status === "upcoming" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => toast.info("Reschedule feature coming soon")}
                    className="flex-1"
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}