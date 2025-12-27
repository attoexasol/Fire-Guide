import { useState, useEffect } from "react";
import { AppointmentSelection } from "./AppointmentSelection";
import { CustomerDetailsForm } from "./CustomerDetailsForm";
import { PaymentPage } from "./PaymentPage";
import { BookingConfirmation } from "./BookingConfirmation";

interface BookingFlowProps {
  onBack: () => void;
  onConfirm: () => void;
  selectedService?: string;
  selectedProfessional?: any;
  professionalId?: number | null;
  bookingProfessional?: any;
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
  // Professional ID for API
  professionalId?: number | null;
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
    longitude?: number;
    latitude?: number;
    professionalBookingId?: number | null;
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

export function BookingFlow({ onBack, onConfirm, professionalId, bookingProfessional }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("appointment");
  
  // Default professional data (fallback)
  const defaultProfessional = {
    name: "Sarah Mitchell",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verified: true,
    rating: 4.9
  };

  // Initialize professional data from bookingProfessional if available, otherwise use defaults
  const getInitialProfessional = () => {
    if (bookingProfessional) {
      return {
        name: bookingProfessional.name || defaultProfessional.name,
        photo: bookingProfessional.photo || defaultProfessional.photo,
        verified: bookingProfessional.verified !== undefined ? bookingProfessional.verified : defaultProfessional.verified,
        rating: bookingProfessional.rating || defaultProfessional.rating
      };
    }
    return defaultProfessional;
  };

  const [bookingData, setBookingData] = useState<BookingData>({
    service: {
      name: "Fire Risk Assessment",
      propertyType: "Office Building",
      floors: 3,
      people: "26-50"
    },
    professional: getInitialProfessional(),
    professionalId: professionalId || null,
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

  // Update booking data when professional data changes (e.g., loaded from sessionStorage)
  useEffect(() => {
    if (bookingProfessional) {
      const shouldUpdate = !bookingData.professional.name || 
                          bookingData.professional.name === defaultProfessional.name ||
                          bookingData.professional.name !== bookingProfessional.name;

      if (shouldUpdate) {
        setBookingData(prev => ({
          ...prev,
          professional: {
            name: bookingProfessional.name || prev.professional.name,
            photo: bookingProfessional.photo || prev.professional.photo,
            verified: bookingProfessional.verified !== undefined ? bookingProfessional.verified : prev.professional.verified,
            rating: bookingProfessional.rating || prev.professional.rating
          },
          professionalId: professionalId !== null && professionalId !== undefined ? professionalId : prev.professionalId
        }));
      }
    }
  }, [bookingProfessional, professionalId]);

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
            professionalId={bookingData.professionalId}
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