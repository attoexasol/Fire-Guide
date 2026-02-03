import React, { useState, useEffect } from "react";
import { getApiToken } from "../lib/auth";
import { getAdminReviewsList } from "../api/adminService";
import { Search, Star, CheckCircle, XCircle, Eye, Flag, AlertTriangle, MessageSquare, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

export function AdminReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminResponse, setAdminResponse] = useState("");

  type ReviewDisplay = {
    id: number;
    customer: string;
    customerEmail: string;
    professional: string;
    professionalEmail: string;
    rating: number;
    date: string;
    bookingRef: string;
    service: string;
    text: string;
    status: string;
    flagged: boolean;
    flagReason?: string;
    rejectionReason?: string;
    professionalResponse: string | null;
  };

  const [reviews, setReviews] = useState<ReviewDisplay[]>([]);

  const formatReviewDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return iso;
    }
  };

  useEffect(() => {
    const token = getApiToken();
    if (!token) return;
    getAdminReviewsList({ api_token: token })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped: ReviewDisplay[] = res.data.map((item) => ({
            id: item.id,
            customer: item.reviewer_name || "",
            customerEmail: item.reviewer_email || "",
            professional: item.professional_name || "",
            professionalEmail: item.professional_email || "",
            rating: parseInt(String(item.rating), 10) || 0,
            date: formatReviewDate(item.created_at),
            bookingRef: `FG-${item.id}`,
            service: Array.isArray(item.services) ? item.services[0] || "—" : "—",
            text: item.feedback || "",
            status: item.status || "",
            flagged: false,
            professionalResponse: null
          }));
          setReviews(mapped);
          setStats({
            total: res.data.length,
            pending: res.data.filter((r) => r.status === "pending").length,
            approved: res.data.filter((r) => r.status === "approved").length,
            rejected: res.data.filter((r) => r.status === "rejected").length
          });
        }
      })
      .catch(() => {});
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.professional.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });


  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleApprove = (review: any) => {
    toast.success(`Review from ${review.customer} has been approved and is now public`);
  };

  const handleReject = (review: any) => {
    setSelectedReview(review);
    setRejectModalOpen(true);
  };

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    setViewModalOpen(true);
  };

  const handleAddResponse = (review: any) => {
    setSelectedReview(review);
    setResponseModalOpen(true);
  };

  const confirmRejection = () => {
    if (!rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }
    toast.success(`Review rejected. ${selectedReview?.customer} has been notified.`);
    setRejectModalOpen(false);
    setRejectionReason("");
  };

  const submitResponse = () => {
    if (!adminResponse.trim()) {
      toast.error("Please enter a response");
      return;
    }
    toast.success(`Response sent to ${selectedReview?.professional}`);
    setResponseModalOpen(false);
    setAdminResponse("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Review Management</h1>
        <p className="text-gray-600">Moderate and manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-2xl text-[#0A1A2F] mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl text-yellow-600 mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl text-green-600 mt-1">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl text-red-600 mt-1">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search reviews by customer, professional, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className={review.flagged ? "border-orange-300 border-2" : ""}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <Badge
                        className={
                          review.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : review.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {review.status}
                      </Badge>
                      {review.flagged && (
                        <Badge className="bg-orange-100 text-orange-700">
                          <Flag className="w-3 h-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {review.date} • Booking: {review.bookingRef}
                    </p>
                  </div>
                </div>

                {/* Customer and Professional Info */}
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">{review.customer}</p>
                    <p className="text-sm text-gray-500">{review.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Professional Reviewed</p>
                    <p className="font-medium text-gray-900">{review.professional}</p>
                    <p className="text-sm text-gray-500">{review.service}</p>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <p className="text-gray-900">{review.text}</p>
                </div>

                {/* Professional Response */}
                {review.professionalResponse && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Professional's Response</p>
                    <p className="text-sm text-blue-800">{review.professionalResponse}</p>
                  </div>
                )}

                {/* Flag Reason */}
                {review.flagged && review.flagReason && (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Flag Reason</p>
                      <p className="text-sm text-orange-700">{review.flagReason}</p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {review.status === "rejected" && review.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900">Rejection Reason</p>
                    <p className="text-sm text-red-700">{review.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(review)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>
                  {review.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(review)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleReject(review)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddResponse(review)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Professional
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Customer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No reviews found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">Review Details</DialogTitle>
            <DialogDescription>Complete review information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-2">Rating</p>
                {renderStars(selectedReview?.rating || 0)}
              </div>
              <Badge
                className={
                  selectedReview?.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : selectedReview?.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {selectedReview?.status}
              </Badge>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Customer</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedReview?.customer}</p>
                <p className="text-sm text-gray-600">{selectedReview?.customerEmail}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Professional</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedReview?.professional}</p>
                <p className="text-sm text-gray-600">{selectedReview?.professionalEmail}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Service & Booking</Label>
              <p className="font-medium text-gray-900 mt-1">{selectedReview?.service}</p>
              <p className="text-sm text-gray-600">Booking: {selectedReview?.bookingRef}</p>
              <p className="text-sm text-gray-600">Date: {selectedReview?.date}</p>
            </div>

            <Separator />

            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Review Content</Label>
              <p className="text-gray-900 p-4 bg-gray-50 rounded-lg">{selectedReview?.text}</p>
            </div>

            {selectedReview?.professionalResponse && (
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Professional's Response</Label>
                <p className="text-gray-900 p-4 bg-blue-50 rounded-lg">{selectedReview?.professionalResponse}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            {selectedReview?.status === "pending" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApprove(selectedReview);
                    setViewModalOpen(false);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Review
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F] flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Reject Review
            </DialogTitle>
            <DialogDescription>
              Reject the review from {selectedReview?.customer}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                {renderStars(selectedReview?.rating || 0)}
              </div>
              <p className="text-sm text-gray-900 mt-2">{selectedReview?.text}</p>
            </div>

            <div>
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate-language">Inappropriate Language</SelectItem>
                  <SelectItem value="spam">Spam or Fake Review</SelectItem>
                  <SelectItem value="policy-violation">Violates Content Policy</SelectItem>
                  <SelectItem value="factual-inaccuracy">Factual Inaccuracy</SelectItem>
                  <SelectItem value="personal-information">Contains Personal Information</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                The review will be permanently rejected and hidden from the platform. The customer will be notified via email.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={confirmRejection}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Response Modal */}
      <Dialog open={responseModalOpen} onOpenChange={setResponseModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F] flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Contact Professional
            </DialogTitle>
            <DialogDescription>
              Send a message to {selectedReview?.professional} about this review
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Professional</p>
              <p className="font-medium text-gray-900">{selectedReview?.professional}</p>
              <p className="text-sm text-gray-600">{selectedReview?.professionalEmail}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Review Reference</p>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(selectedReview?.rating || 0)}
              </div>
              <p className="text-sm text-gray-900">{selectedReview?.text}</p>
            </div>

            <div>
              <Label htmlFor="admin-response">Your Message *</Label>
              <Textarea
                id="admin-response"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Type your message to the professional..."
                className="mt-2"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be sent via email to the professional
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={submitResponse}>
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
