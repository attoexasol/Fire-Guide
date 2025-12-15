import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  CreditCard, 
  Download, 
  Calendar,
  CheckCircle,
  Receipt,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Payment } from "../App";

interface CustomerPaymentsProps {
  payments: Payment[];
}

export function CustomerPayments({ payments }: CustomerPaymentsProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("all");

  const filteredPayments = payments.filter(payment => {
    if (filterStatus !== "all" && payment.status !== filterStatus) {
      return false;
    }
    
    if (filterPeriod !== "all") {
      const paymentDate = new Date(payment.date);
      const now = new Date();
      const monthsAgo = parseInt(filterPeriod);
      const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsAgo));
      if (paymentDate < cutoffDate) {
        return false;
      }
    }
    
    return true;
  });

  const totalPaid = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount.replace("£", "").replace(",", "")), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    toast.success(`Downloading invoice ${invoiceNumber}...`);
  };

  const handleDownloadAll = () => {
    toast.success("Downloading all invoices as ZIP file...");
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-[#0A1A2F]">£{totalPaid.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                <p className="text-2xl font-bold text-[#0A1A2F]">{payments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1">Last Month</SelectItem>
                  <SelectItem value="3">Last 3 Months</SelectItem>
                  <SelectItem value="6">Last 6 Months</SelectItem>
                  <SelectItem value="12">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={handleDownloadAll}
              className="w-full md:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No payments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[#0A1A2F] mb-1">{payment.service}</h3>
                        <p className="text-sm text-gray-600">Invoice: {payment.invoiceNumber}</p>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(payment.date).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        <span>{payment.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Receipt className="w-4 h-4" />
                        <span>Booking: {payment.bookingRef}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{payment.professional}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-gray-900">
                        Amount: <span className="text-xl font-semibold">{payment.amount}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(payment.invoiceNumber)}
                      className="flex-1 md:flex-none"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Invoice
                    </Button>
                    {payment.status === "paid" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(payment.invoiceNumber)}
                        className="flex-1 md:flex-none"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Methods */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-[#0A1A2F] mb-4">Saved Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/2025</p>
                </div>
                <Badge variant="outline" className="ml-2">Default</Badge>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Mastercard ending in 5555</p>
                  <p className="text-sm text-gray-600">Expires 08/2026</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Set Default</Button>
                <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            Add New Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}