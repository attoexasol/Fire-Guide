import React, { useState } from "react";
import { Search, DollarSign, TrendingUp, TrendingDown, Download, Filter, Settings, Eye, Send, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

export function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState("15");
  const [newCommissionRate, setNewCommissionRate] = useState("15");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedProfessionals, setSelectedProfessionals] = useState<number[]>([]);

  const transactions = [
    {
      id: 1,
      reference: "PAY-2025-00847",
      date: "Nov 20, 2025",
      customer: "John Smith",
      customerEmail: "john.smith@example.com",
      professional: "Sarah Mitchell",
      professionalEmail: "sarah.mitchell@fireguide.co.uk",
      service: "Fire Risk Assessment",
      amount: 300,
      commission: 45,
      professionalEarning: 255,
      status: "completed",
      payoutStatus: "paid",
      bookingRef: "FG-2025-00847",
      paymentMethod: "Card",
      transactionFee: 4.50
    },
    {
      id: 2,
      reference: "PAY-2025-00846",
      date: "Nov 19, 2025",
      customer: "Emma Davis",
      customerEmail: "emma.davis@example.com",
      professional: "James Patterson",
      professionalEmail: "james.patterson@fireguide.co.uk",
      service: "Fire Equipment Service",
      amount: 165,
      commission: 24.75,
      professionalEarning: 140.25,
      status: "completed",
      payoutStatus: "pending",
      bookingRef: "FG-2025-00846",
      paymentMethod: "Card",
      transactionFee: 2.75
    },
    {
      id: 3,
      reference: "PAY-2025-00845",
      date: "Nov 18, 2025",
      customer: "Michael Brown",
      customerEmail: "michael.brown@example.com",
      professional: "David Chen",
      professionalEmail: "david.chen@fireguide.co.uk",
      service: "Emergency Lighting Test",
      amount: 210,
      commission: 31.50,
      professionalEarning: 178.50,
      status: "completed",
      payoutStatus: "paid",
      bookingRef: "FG-2025-00845",
      paymentMethod: "Card",
      transactionFee: 3.15
    },
    {
      id: 4,
      reference: "PAY-2025-00844",
      date: "Nov 17, 2025",
      customer: "Sarah Wilson",
      customerEmail: "sarah.wilson@example.com",
      professional: "Emma Thompson",
      professionalEmail: "emma.thompson@fireguide.co.uk",
      service: "Fire Risk Assessment",
      amount: 335,
      commission: 50.25,
      professionalEarning: 284.75,
      status: "refunded",
      payoutStatus: "cancelled",
      bookingRef: "FG-2025-00844",
      paymentMethod: "Card",
      transactionFee: 5.03
    },
  ];

  const pendingPayouts = [
    {
      id: 1,
      professional: "James Patterson",
      email: "james.patterson@fireguide.co.uk",
      amount: 140.25,
      transactions: 1,
      oldestDate: "Nov 19, 2025"
    },
    {
      id: 2,
      professional: "Lisa Anderson",
      email: "lisa.anderson@fireguide.co.uk",
      amount: 543.50,
      transactions: 3,
      oldestDate: "Nov 15, 2025"
    }
  ];

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.professional.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalRevenue: 45280,
    totalCommission: 6792,
    pendingPayouts: 2340,
    transactionCount: 127
  };

  const handleCommissionUpdate = () => {
    setCommissionRate(newCommissionRate);
    toast.success(`Commission rate updated to ${newCommissionRate}%`);
    setCommissionModalOpen(false);
  };

  const handlePayoutSelected = () => {
    if (selectedProfessionals.length === 0) {
      toast.error("Please select at least one professional");
      return;
    }
    toast.success(`Processing payouts for ${selectedProfessionals.length} professional(s)`);
    setSelectedProfessionals([]);
    setPayoutModalOpen(false);
  };

  const toggleProfessionalSelection = (id: number) => {
    setSelectedProfessionals(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const totalSelectedPayout = selectedProfessionals.reduce((sum, id) => {
    const prof = pendingPayouts.find(p => p.id === id);
    return sum + (prof?.amount || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-0">
        <div>
          <h1 className="text-3xl text-[#0A1A2F] mb-2">Payment Management</h1>
          <p className="text-gray-600">Manage payments, commissions, and payouts</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button variant="outline" onClick={() => setCommissionModalOpen(true)} className="w-full md:w-auto">
            <Settings className="w-4 h-4 mr-2" />
            <span className="md:inline">Commission Settings</span>
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 md:px-0">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl text-[#0A1A2F] mt-1">£{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Commission</p>
                <p className="text-2xl text-green-600 mt-1">£{stats.totalCommission.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Current rate: {commissionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payouts</p>
                <p className="text-2xl text-yellow-600 mt-1">£{stats.pendingPayouts.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <Button
              variant="link"
              className="text-xs p-0 h-auto mt-1"
              onClick={() => setPayoutModalOpen(true)}
            >
              Process Payouts →
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl text-[#0A1A2F] mt-1">{stats.transactionCount}</p>
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
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Reference</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Parties</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Service</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Commission</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Professional</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{transaction.reference}</p>
                      <p className="text-xs text-gray-500">{transaction.bookingRef}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{transaction.date}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{transaction.customer}</p>
                      <p className="text-xs text-gray-500">to {transaction.professional}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-700">{transaction.service}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">£{transaction.amount}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-green-600">£{transaction.commission.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{commissionRate}%</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-blue-600">£{transaction.professionalEarning.toFixed(2)}</p>
                      <Badge className={
                        transaction.payoutStatus === "paid"
                          ? "bg-green-100 text-green-700 text-xs mt-1"
                          : transaction.payoutStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700 text-xs mt-1"
                          : "bg-gray-100 text-gray-700 text-xs mt-1"
                      }>
                        {transaction.payoutStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "refunded"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {transaction.status === "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setPayoutModalOpen(true);
                            }}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 md:p-5 space-y-3 shadow-sm hover:bg-gray-50 transition-colors">
                {/* Reference & Date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm break-words">{transaction.reference}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{transaction.bookingRef}</p>
                  </div>
                  <p className="text-xs text-gray-600 flex-shrink-0">{transaction.date}</p>
                </div>

                {/* Parties */}
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 flex-shrink-0 mt-0.5">From:</span>
                    <span className="text-sm text-gray-900 break-words">{transaction.customer}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 flex-shrink-0 mt-0.5">To:</span>
                    <span className="text-sm text-gray-900 break-words">{transaction.professional}</span>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="text-sm text-gray-900 mt-0.5 break-words">{transaction.service}</p>
                </div>

                {/* Amount Section */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="font-semibold text-gray-900 mt-0.5">£{transaction.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="font-semibold text-green-600 mt-0.5">£{transaction.commission.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{commissionRate}%</p>
                  </div>
                </div>

                {/* Professional Earning & Payout */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Professional Earning</p>
                    <p className="font-semibold text-blue-600 mt-0.5">£{transaction.professionalEarning.toFixed(2)}</p>
                  </div>
                  <Badge className={
                    transaction.payoutStatus === "paid"
                      ? "bg-green-100 text-green-700 text-xs"
                      : transaction.payoutStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700 text-xs"
                      : "bg-gray-100 text-gray-700 text-xs"
                  }>
                    {transaction.payoutStatus}
                  </Badge>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Badge
                    className={
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : transaction.status === "refunded"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {transaction.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setDetailsModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {transaction.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setPayoutModalOpen(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Payout
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Settings Modal */}
      <Dialog open={commissionModalOpen} onOpenChange={setCommissionModalOpen}>
        <DialogContent className="w-[92%] max-w-[360px] mx-auto p-4 pb-5 max-h-[85vh] overflow-y-auto md:max-w-lg md:p-6">
          <DialogHeader className="text-left mb-3">
            <DialogTitle className="text-lg leading-tight pr-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600 flex-shrink-0" />
              Commission Settings
            </DialogTitle>
            <DialogDescription className="text-sm mt-1.5">
              Update the platform commission rate applied to all transactions
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-900 mb-1">Current Commission Rate</p>
              <p className="text-2xl text-blue-600 font-semibold">{commissionRate}%</p>
            </div>

            <div>
              <Label htmlFor="new-commission" className="text-sm font-medium text-gray-700 mb-1.5 block">New Commission Rate (%)</Label>
              <Input
                id="new-commission"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={newCommissionRate}
                onChange={(e) => setNewCommissionRate(e.target.value)}
                className="w-full h-11 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                This rate will apply to all future transactions
              </p>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium text-gray-900">Impact Calculation</h4>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">On £100 transaction</span>
                  <span className="font-semibold text-gray-900 text-sm">£{newCommissionRate} commission</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Professional receives</span>
                  <span className="font-semibold text-green-600 text-sm">£{(100 - parseFloat(newCommissionRate || "0")).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Button 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-sm font-medium justify-center" 
                onClick={handleCommissionUpdate}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Commission Rate
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCommissionModalOpen(false)}
                className="w-full h-11 text-sm font-medium justify-center border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payout Management Modal */}
      <Dialog open={payoutModalOpen} onOpenChange={setPayoutModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F] flex items-center gap-2">
              <Send className="w-6 h-6 text-green-600" />
              Process Payouts
            </DialogTitle>
            <DialogDescription>
              Select professionals to process pending payouts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Total Pending Payouts</p>
              <p className="text-2xl text-yellow-600 font-semibold mt-1">
                £{pendingPayouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                {pendingPayouts.length} professional(s) waiting for payment
              </p>
            </div>

            <div className="space-y-3">
              {pendingPayouts.map((payout) => (
                <label
                  key={payout.id}
                  className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedProfessionals.includes(payout.id)}
                    onChange={() => toggleProfessionalSelection(payout.id)}
                    className="w-4 h-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{payout.professional}</p>
                    <p className="text-sm text-gray-600">{payout.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {payout.transactions} transaction(s) • Oldest: {payout.oldestDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">£{payout.amount.toFixed(2)}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedProfessionals.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-900">Selected for Payout</p>
                    <p className="text-sm text-green-700 mt-1">
                      {selectedProfessionals.length} professional(s)
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-green-600">
                    £{totalSelectedPayout.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handlePayoutSelected}
              disabled={selectedProfessionals.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Process {selectedProfessionals.length} Payout(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">Transaction Details</DialogTitle>
            <DialogDescription>{selectedTransaction?.reference}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Customer</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedTransaction?.customer}</p>
                <p className="text-sm text-gray-600">{selectedTransaction?.customerEmail}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Professional</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedTransaction?.professional}</p>
                <p className="text-sm text-gray-600">{selectedTransaction?.professionalEmail}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm text-gray-600">Service</Label>
              <p className="font-medium text-gray-900 mt-1">{selectedTransaction?.service}</p>
              <p className="text-sm text-gray-600">Booking: {selectedTransaction?.bookingRef}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Payment Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-gray-900">£{selectedTransaction?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Fee</span>
                  <span className="text-gray-900">£{selectedTransaction?.transactionFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Commission ({commissionRate}%)</span>
                  <span className="text-green-600">£{selectedTransaction?.commission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Professional Payout</span>
                  <span className="font-semibold text-blue-600">£{selectedTransaction?.professionalEarning}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Payment Status</Label>
                <Badge className="bg-green-100 text-green-700 mt-1">
                  {selectedTransaction?.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Payout Status</Label>
                <Badge className={
                  selectedTransaction?.payoutStatus === "paid"
                    ? "bg-green-100 text-green-700 mt-1"
                    : "bg-yellow-100 text-yellow-700 mt-1"
                }>
                  {selectedTransaction?.payoutStatus}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}