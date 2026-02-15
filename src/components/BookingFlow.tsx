import React, { useState, useEffect } from "react";
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
  /** When user clicks Book Now, price is fetched and passed here so Booking Summary shows API values immediately */
  initialPricing?: { servicePrice: number; platformFee: number; total: number };
  /** When price API fails on Book Now, pass message so summary can show it */
  initialPricingError?: string;
  isCustomQuote?: boolean;
  customQuoteRequestData?: { building_type: string; people_count: string; floors: number; assessment_type: string; notes?: string };
  serviceIdForQuote?: number;
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
  /** When set, API failed to get price (e.g. base price not configured); show in summary instead of amounts */
  pricingErrorMessage?: string;
  // Booking reference
  bookingReference?: string;
}

const defaultPricing = { servicePrice: 285, platformFee: 15, total: 300 };

export function BookingFlow({ onBack, onConfirm, professionalId, bookingProfessional, initialPricing, initialPricingError, isCustomQuote, customQuoteRequestData, serviceIdForQuote }: BookingFlowProps) {
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
    pricing: initialPricing ?? defaultPricing,
    pricingErrorMessage: initialPricingError
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
    setBookingData(prev => ({ ...prev, selectedDate: date, selectedTime: time }));
    setCurrentStep("details");
  };

  const handleCustomerDetailsSubmitted = (customerData: BookingData["customer"]) => {
    setBookingData(prev => ({ ...prev, customer: customerData }));
    setCurrentStep("payment");
  };

  const handlePaymentCompleted = () => {
    const reference = `FG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, "0")}`;
    setBookingData(prev => ({ ...prev, bookingReference: reference }));
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
            pricingErrorMessage={bookingData.pricingErrorMessage}
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
            pricingErrorMessage={bookingData.pricingErrorMessage}
            initialData={bookingData.customer}
            onContinue={handleCustomerDetailsSubmitted}
            onBack={handleBackFromDetails}
            isCustomQuote={isCustomQuote}
            forceNormalBooking={!!initialPricing}
            customQuoteRequestData={customQuoteRequestData}
            serviceIdForQuote={serviceIdForQuote}
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