import { useState } from "react";
import { AppointmentSelection } from "./AppointmentSelection";
import { CustomerDetailsForm } from "./CustomerDetailsForm";
import { PaymentPage } from "./PaymentPage";
import { BookingConfirmation } from "./BookingConfirmation";

interface BookingFlowProps {
  onBack: () => void;
  onConfirm: () => void;
}

export type BookingStep = "appointment" | "details" | "payment" | "confirmation";

export interface BookingData {
  // Service info
  service: {
    name: string;
    propertyType: string;
    floors: number;
    people: string;
  };
  // Professional info
  professional: {
    name: string;
    photo: string;
    verified: boolean;
    rating: number;
  };
  // Appointment
  selectedDate: string;
  selectedTime: string;
  // Customer details
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    notes: string;
  };
  // Pricing
  pricing: {
    servicePrice: number;
    platformFee: number;
    total: number;
  };
  // Booking reference
  bookingReference?: string;
}

export function BookingFlow({ onBack, onConfirm }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("appointment");
  const [bookingData, setBookingData] = useState<BookingData>({
    service: {
      name: "Fire Risk Assessment",
      propertyType: "Office Building",
      floors: 3,
      people: "26-50"
    },
    professional: {
      name: "Sarah Mitchell",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      verified: true,
      rating: 4.9
    },
    selectedDate: "",
    selectedTime: "",
    customer: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postcode: "",
      notes: ""
    },
    pricing: {
      servicePrice: 285,
      platformFee: 15,
      total: 300
    }
  });

  const handleAppointmentSelected = (date: string, time: string) => {
    setBookingData({
      ...bookingData,
      selectedDate: date,
      selectedTime: time
    });
    setCurrentStep("details");
  };

  const handleCustomerDetailsSubmitted = (customerData: BookingData["customer"]) => {
    setBookingData({
      ...bookingData,
      customer: customerData
    });
    setCurrentStep("payment");
  };

  const handlePaymentCompleted = () => {
    // Generate booking reference
    const reference = `FG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, "0")}`;
    setBookingData({
      ...bookingData,
      bookingReference: reference
    });
    setCurrentStep("confirmation");
  };

  const handleBackFromDetails = () => {
    setCurrentStep("appointment");
  };

  const handleBackFromPayment = () => {
    setCurrentStep("details");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "appointment":
        return (
          <AppointmentSelection
            service={bookingData.service}
            professional={bookingData.professional}
            pricing={bookingData.pricing}
            onContinue={handleAppointmentSelected}
            onBack={onBack}
          />
        );
      case "details":
        return (
          <CustomerDetailsForm
            service={bookingData.service}
            professional={bookingData.professional}
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTime}
            pricing={bookingData.pricing}
            initialData={bookingData.customer}
            onContinue={handleCustomerDetailsSubmitted}
            onBack={handleBackFromDetails}
          />
        );
      case "payment":
        return (
          <PaymentPage
            bookingData={bookingData}
            onPaymentComplete={handlePaymentCompleted}
            onBack={handleBackFromPayment}
          />
        );
      case "confirmation":
        return (
          <BookingConfirmation
            bookingData={bookingData}
            onDone={onConfirm}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
}