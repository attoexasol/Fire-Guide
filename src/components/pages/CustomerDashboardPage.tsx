import React, { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { CustomerDashboard } from "../CustomerDashboard";

export default function CustomerDashboardPage() {
  try {
    const navigate = useNavigate();
    const { logout, customerBookings, customerPayments, updateBooking, deleteBooking } = useApp();

    return (
      <CustomerDashboard
        onLogout={() => {
          logout();
          startTransition(() => {
            navigate("/");
          });
        }}
        onBookNewService={() => {
          startTransition(() => {
            navigate("/services");
          });
        }}
        bookings={customerBookings || []}
        payments={customerPayments || []}
        onUpdateBooking={updateBooking}
        onDeleteBooking={deleteBooking}
        onNavigateHome={() => {
          startTransition(() => {
            navigate("/");
          });
        }}
      />
    );
  } catch (error) {
    console.error("CustomerDashboardPage error:", error);
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h1>
          <p className="text-red-500 mt-2">{String(error)}</p>
        </div>
      </div>
    );
  }
}

