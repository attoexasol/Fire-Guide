import React, { useState, useEffect } from "react";
import {
  getProfessionalPaymentInvoiceList,
  ProfessionalPaymentInvoiceItem,
} from "../api/adminService";
import { getApiToken } from "../lib/auth";
import {
  Wallet,
  User,
  FileText,
  CreditCard,
  Calendar,
  RefreshCw,
  Mail,
  PoundSterling,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function maskAccountNumber(num: string): string {
  if (!num || num.length < 4) return "****";
  return "****" + num.slice(-4);
}

export function AdminPayout() {
  const [invoices, setInvoices] = useState<ProfessionalPaymentInvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = () => {
    const token = getApiToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getProfessionalPaymentInvoiceList({ api_token: token })
      .then((res) => {
        if (res.status && Array.isArray(res.data)) {
          setInvoices(res.data);
        } else {
          setInvoices([]);
        }
      })
      .catch(() => {
        setError("Failed to load invoices");
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const totalAmount = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.amount || "0"),
    0
  );
  const paidCount = invoices.filter((i) => i.status === "paid").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-gray-800 mb-1">Payout</h1>
          <p className="text-sm text-gray-500">
            Professional payment invoices and payout details.
          </p>
        </div>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Loading invoices…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-gray-800 mb-1">Payout</h1>
          <p className="text-sm text-gray-500">
            Professional payment invoices and payout details.
          </p>
        </div>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchInvoices}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-800 mb-1">Payout</h1>
        <p className="text-sm text-gray-500">
          Professional payment invoices and payout details.
        </p>
      </div>

      {/* Summary - single card with Refresh inside */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Total invoices
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {invoices.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Paid
              </p>
              <p className="text-xl font-semibold text-green-700">{paidCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Total amount
              </p>
              <p className="text-xl font-semibold text-gray-900">
                £{totalAmount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInvoices}
              className="shrink-0"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center text-gray-500">
            <Wallet className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No payment invoices yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <Card
              key={inv.id}
              className="bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              <CardHeader className="pb-2 pt-4 px-4 sm:px-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      Invoice #{inv.id}
                    </span>
                    <Badge
                      variant={inv.status === "paid" ? "default" : "secondary"}
                      className={
                        inv.status === "paid"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {inv.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <PoundSterling className="w-4 h-4 text-gray-500" />
                    {parseFloat(inv.amount).toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Professional */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      Professional
                    </h3>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {inv.professional?.name ?? "—"}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {inv.professional?.email ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Booking */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      Booking
                    </h3>
                    <div className="text-sm">
                      <p className="text-gray-700">
                        <span className="text-gray-500">ID:</span>{" "}
                        {inv.booking?.id ?? "—"}
                      </p>
                      <p className="text-gray-700 mt-0.5">
                        <span className="text-gray-500">Price:</span>{" "}
                        £
                        {inv.booking?.price != null
                          ? Number(inv.booking.price).toLocaleString("en-GB", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "—"}
                      </p>
                      <p className="text-gray-700 mt-0.5">
                        <span className="text-gray-500">Status:</span>{" "}
                        <Badge variant="outline" className="text-xs font-normal">
                          {inv.booking?.status ?? "—"}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  {/* Payout details */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5" />
                      Payout account
                    </h3>
                    {inv.professional?.payout_detail ? (
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {inv.professional.payout_detail.account_holder_name}
                        </p>
                        <p className="text-gray-600 mt-0.5">
                          Sort code:{" "}
                          {inv.professional.payout_detail.sort_code || "—"}
                        </p>
                        <p className="text-gray-600">
                          Account:{" "}
                          {maskAccountNumber(
                            inv.professional.payout_detail.account_number
                          )}
                        </p>
                        {inv.professional.payout_detail.note && (
                          <p className="text-gray-500 text-xs mt-1 italic">
                            {inv.professional.payout_detail.note}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No payout details</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Created: {formatDate(inv.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Updated: {formatDate(inv.updated_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
