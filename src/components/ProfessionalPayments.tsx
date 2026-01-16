import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  Download, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Search,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getPaymentInvoices, PaymentInvoiceItem } from "../api/paymentService";
import { getApiToken } from "../lib/auth";
import { toast } from "sonner";

interface PaymentHistoryItem {
  id: number;
  reference: string;
  bookingRef: string;
  date: string;
  customer: string;
  service: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: "paid" | "pending";
  paidOn: string | null;
}

export function ProfessionalPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const balance = {
    available: 2450,
    pending: 890,
    total: 4250
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to map API response to PaymentHistoryItem
  const mapApiResponseToPayment = (apiPayment: PaymentInvoiceItem): PaymentHistoryItem => {
    const amount = parseFloat(apiPayment.price) || 0;
    const commission = amount * 0.15; // 15% commission
    const netAmount = amount - commission;
    
    // Get customer name from professional_booking or cardholder_name
    const customer = apiPayment.professional_booking?.first_name || apiPayment.cardholder_name || "Unknown";
    
    // Generate booking reference from professional_booking id or use tx_ref
    const bookingRef = apiPayment.professional_booking 
      ? `FG-${apiPayment.professional_booking.id}` 
      : apiPayment.tx_ref || `INV-${apiPayment.id}`;
    
    // Get paid date if status is paid
    const paidOn = apiPayment.status === "paid" && apiPayment.updated_at 
      ? formatDate(apiPayment.updated_at) 
      : null;

    // Get service name from API response
    const serviceName = apiPayment.service?.name || "Fire Risk Assessment";

    return {
      id: apiPayment.id,
      reference: apiPayment.tx_ref || `INV-${apiPayment.id}`,
      bookingRef: bookingRef,
      date: formatDate(apiPayment.created_at),
      customer: customer,
      service: serviceName,
      amount: amount,
      commission: commission,
      netAmount: netAmount,
      status: apiPayment.status === "paid" ? "paid" : "pending",
      paidOn: paidOn
    };
  };

  // Fetch payment invoices from API
  const fetchPaymentInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiToken = getApiToken();
      if (!apiToken) {
        throw new Error("API token not found. Please log in.");
      }

      const invoices = await getPaymentInvoices(apiToken);
      const mappedPayments = invoices.map(mapApiResponseToPayment);
      
      // Sort by date (newest first)
      mappedPayments.sort((a, b) => {
        const dateA = new Date(invoices.find(inv => inv.id === a.id)?.created_at || '');
        const dateB = new Date(invoices.find(inv => inv.id === b.id)?.created_at || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      setPaymentHistory(mappedPayments);
    } catch (err: any) {
      console.error("Error fetching payment invoices:", err);
      setError(err?.message || "Failed to fetch payment invoices");
      toast.error(err?.message || "Failed to fetch payment invoices");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchPaymentInvoices();
  }, []);

  const filteredPayments = paymentHistory.filter((payment) =>
    payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const monthlyEarnings = [
    { month: "November", earnings: 2450, jobs: 8 },
    { month: "October", earnings: 3200, jobs: 11 },
    { month: "September", earnings: 2850, jobs: 9 },
  ];

  return (
    <div className="space-y-6 px-4 md:px-6 pb-20 md:pb-6">
      {/* Page Header - Mobile Optimized */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5 md:mt-0">
        <div>
          <h1 className="text-[#0A1A2F] mb-2">Payments & Earnings</h1>
          <p className="text-gray-600">Track your income and payment history</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 w-full md:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Download Statement
        </Button>
      </div>

      {/* Balance Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {/* Available Balance - Green Card */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Available Balance</p>
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-100" />
            </div>
            <p className="text-3xl md:text-4xl font-bold mb-3">£{balance.available.toLocaleString()}</p>
            <Button 
              size="sm" 
              className="bg-white text-green-600 hover:bg-green-50 w-full h-11 md:h-9"
            >
              Request Payout
            </Button>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Pending</p>
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <p className="text-3xl md:text-4xl text-[#0A1A2F] font-bold mb-2">£{balance.pending.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Will be available in 2-3 days</p>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Earned</p>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <p className="text-3xl md:text-4xl text-[#0A1A2F] font-bold mb-2">£{balance.total.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Earnings - Mobile Optimized Stacked Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F]">Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyEarnings.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base">{month.month} 2025</p>
                    <p className="text-xs md:text-sm text-gray-500">{month.jobs} completed jobs</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-xl md:text-2xl font-semibold text-gray-900">£{month.earnings.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-gray-500 whitespace-nowrap">after commission</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-blue-900">Commission Structure</p>
              <p className="text-sm text-blue-800 mt-1">
                Fire Guide charges a 15% platform commission on each booking. Your earnings are automatically calculated and displayed below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-[#0A1A2F]">Payment History</CardTitle>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Mobile: Card-based layout, Desktop: Table */}
          <div className="block md:hidden space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{payment.reference}</p>
                    <p className="text-xs text-gray-500">{payment.bookingRef}</p>
                  </div>
                  {payment.status === "paid" ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">{payment.customer}</p>
                  <p className="text-sm text-gray-600">{payment.service}</p>
                  <p className="text-xs text-gray-500">{payment.date}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900 text-sm">£{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="text-sm text-red-600">-£{payment.commission.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Earnings</p>
                    <p className="font-semibold text-green-600 text-sm">£{payment.netAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Reference</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Service</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Commission</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Your Earnings</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{payment.reference}</p>
                      <p className="text-xs text-gray-500">{payment.bookingRef}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{payment.date}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{payment.customer}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-700">{payment.service}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">£{payment.amount}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-red-600">-£{payment.commission.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">15%</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-green-600">£{payment.netAmount.toFixed(2)}</p>
                    </td>
                    <td className="p-4">
                      {payment.status === "paid" ? (
                        <div>
                          <Badge className="bg-green-100 text-green-700 mb-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Paid
                          </Badge>
                          <p className="text-xs text-gray-500">{payment.paidOn}</p>
                        </div>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Loading payment history...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">{error}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchPaymentInvoices}
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No payment records found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F]">Payout Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Bank Account</p>
                  <p className="text-sm text-gray-600 mt-1">**** **** **** 1234</p>
                  <p className="text-sm text-gray-500">Barclays Bank</p>
                </div>
                <Badge className="bg-green-100 text-green-700 w-fit">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Update Bank Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}