import { useState } from "react";
import { Search, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, Eye, Ban, Trash2, AlertTriangle, MessageSquare, CheckCircle, XCircle, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
import { toast } from "sonner@2.0.3";

export function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [disputeMessages, setDisputeMessages] = useState<any[]>([
    {
      id: 1,
      sender: "customer",
      message: "The fire risk assessment report was not as detailed as promised. I expected more comprehensive coverage.",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      sender: "professional",
      message: "I apologize for any confusion. The assessment covered all required areas per the booking specifications.",
      timestamp: "1 hour ago"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [disputeDecision, setDisputeDecision] = useState("");

  const customers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "07123 456789",
      location: "London, SW1A 1AA",
      totalBookings: 5,
      totalSpent: 1420,
      joinDate: "Jan 15, 2024",
      status: "active",
      lastBooking: "Nov 18, 2025"
    },
    {
      id: 2,
      name: "Emma Davis",
      email: "emma.davis@example.com",
      phone: "07234 567890",
      location: "Manchester, M1 1AA",
      totalBookings: 3,
      totalSpent: 850,
      joinDate: "Mar 22, 2024",
      status: "active",
      lastBooking: "Nov 19, 2025"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "07345 678901",
      location: "Birmingham, B1 1AA",
      totalBookings: 8,
      totalSpent: 2340,
      joinDate: "Dec 10, 2023",
      status: "active",
      lastBooking: "Nov 20, 2025"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "07456 789012",
      location: "Leeds, LS1 1AA",
      totalBookings: 1,
      totalSpent: 285,
      joinDate: "Nov 5, 2025",
      status: "active",
      lastBooking: "Nov 10, 2025"
    },
    {
      id: 5,
      name: "David Taylor",
      email: "david.taylor@example.com",
      phone: "07567 890123",
      location: "Bristol, BS1 1AA",
      totalBookings: 12,
      totalSpent: 3600,
      joinDate: "Aug 18, 2023",
      status: "inactive",
      lastBooking: "Jun 15, 2025"
    },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDispute = (customer: any) => {
    setSelectedCustomer(customer);
    setDisputeModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setDisputeMessages([
      ...disputeMessages,
      {
        id: disputeMessages.length + 1,
        sender: "admin",
        message: newMessage,
        timestamp: "just now"
      }
    ]);
    setNewMessage("");
  };

  const handleResolveDispute = () => {
    if (!disputeDecision) {
      toast.error("Please select a resolution decision");
      return;
    }
    toast.success(`Dispute ${disputeDecision}! Both parties have been notified.`);
    setDisputeModalOpen(false);
    setDisputeDecision("");
    setNewMessage("");
  };

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const handleSendEmail = (customer: any) => {
    toast.success(`Email dialog opened for ${customer.name}`);
  };

  const handleSuspendAccount = (customer: any) => {
    toast.success(`${customer.name}'s account has been suspended`);
  };

  const handleDeleteAccount = (customer: any) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    toast.success(`${selectedCustomer?.name}'s account has been permanently deleted`);
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Customer Management</h1>
        <p className="text-gray-600">View and manage all platform customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Customers</p>
            <p className="text-2xl text-[#0A1A2F] mt-1">1,547</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active This Month</p>
            <p className="text-2xl text-[#0A1A2F] mt-1">892</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">New This Month</p>
            <p className="text-2xl text-green-600 mt-1">+89</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl text-[#0A1A2F] mt-1">£45,280</p>
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
                placeholder="Search customers by name or email..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Stats</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Last Booking</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          Joined {customer.joinDate}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {customer.location}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{customer.totalBookings}</span> bookings
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">£{customer.totalSpent}</span> spent
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{customer.lastBooking}</p>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          customer.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDispute(customer)}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Resolve Dispute
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-yellow-600" onClick={() => handleSuspendAccount(customer)}>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAccount(customer)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 space-y-3">
                {/* Customer Name & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>Joined {customer.joinDate}</span>
                    </p>
                  </div>
                  <Badge
                    className={
                      customer.status === "active"
                        ? "bg-green-100 text-green-700 flex-shrink-0"
                        : "bg-gray-100 text-gray-700 flex-shrink-0"
                    }
                  >
                    {customer.status}
                  </Badge>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 break-all">{customer.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{customer.location}</p>
                  </div>
                </div>

                {/* Stats & Last Booking */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Bookings & Spend</p>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{customer.totalBookings}</span> bookings • <span className="font-semibold">£{customer.totalSpent}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Last Booking</p>
                    <p className="text-sm text-gray-900">{customer.lastBooking}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <MoreVertical className="w-4 h-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDispute(customer)}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Resolve Dispute
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-yellow-600" onClick={() => handleSuspendAccount(customer)}>
                        <Ban className="w-4 h-4 mr-2" />
                        Suspend Account
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAccount(customer)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispute Modal */}
      <Dialog open={disputeModalOpen} onOpenChange={setDisputeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute Resolution</DialogTitle>
            <DialogDescription>
              Resolve disputes with customers regarding their bookings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={selectedCustomer?.name || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Customer Email</Label>
              <Input
                id="customer-email"
                value={selectedCustomer?.email || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Customer Phone</Label>
              <Input
                id="customer-phone"
                value={selectedCustomer?.phone || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-location">Customer Location</Label>
              <Input
                id="customer-location"
                value={selectedCustomer?.location || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dispute-messages">Dispute Messages</Label>
              <div className="space-y-2">
                {disputeMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded ${
                      message.sender === "customer"
                        ? "bg-gray-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <p className="text-sm text-gray-500">
                      {message.sender === "customer" ? "Customer" : "Professional"} - {message.timestamp}
                    </p>
                    <p className="text-sm text-gray-900">{message.message}</p>
                  </div>
                ))}
                <Textarea
                  id="new-message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="mt-2"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleSendMessage}
                >
                  Send Message
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dispute-decision">Dispute Decision</Label>
              <Select
                value={disputeDecision}
                onValueChange={setDisputeDecision}
                className="w-full"
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResolveDispute}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View detailed information about the customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={selectedCustomer?.name || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Customer Email</Label>
              <Input
                id="customer-email"
                value={selectedCustomer?.email || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Customer Phone</Label>
              <Input
                id="customer-phone"
                value={selectedCustomer?.phone || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-location">Customer Location</Label>
              <Input
                id="customer-location"
                value={selectedCustomer?.location || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-stats">Customer Stats</Label>
              <div className="space-y-2">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{selectedCustomer?.totalBookings}</span> bookings
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">£{selectedCustomer?.totalSpent}</span> spent
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}