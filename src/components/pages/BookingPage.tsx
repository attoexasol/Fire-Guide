import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { BookingFlow } from "../BookingFlow";

const BOOKING_PROFESSIONAL_KEY = 'fireguide_booking_professional';
const BOOKING_PROFESSIONAL_ID_KEY = 'fireguide_booking_professional_id';
const QUESTIONNAIRE_STORAGE_KEY = 'fireguide_questionnaire_data';

function getQuestionnaireData(questionnaireData: any) {
  if (questionnaireData != null) return questionnaireData;
  try {
    const stored = sessionStorage.getItem(QUESTIONNAIRE_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return null;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedService,
    selectedProfessional,
    selectedProfessionalId,
    bookingProfessional,
    questionnaireData: contextQuestionnaireData,
    setBookingData,
    setBookingProfessional,
    setSelectedProfessionalId,
  } = useApp();
  const questionnaireData = getQuestionnaireData(contextQuestionnaireData);

  // Restore professional data from sessionStorage or location state on mount/reload
  useEffect(() => {
    // First, try location state (from immediate navigation)
    const locationState = location.state as { professional?: any; professionalId?: number } | null;
    if (locationState?.professional) {
      setBookingProfessional(locationState.professional);
      setSelectedProfessionalId(locationState.professionalId || null);
      return;
    }

    // Then, try sessionStorage (for browser reload)
    try {
      const storedProfessional = sessionStorage.getItem(BOOKING_PROFESSIONAL_KEY);
      const storedProfessionalId = sessionStorage.getItem(BOOKING_PROFESSIONAL_ID_KEY);
      
      if (storedProfessional) {
        const professional = JSON.parse(storedProfessional);
        setBookingProfessional(professional);
        if (storedProfessionalId) {
          setSelectedProfessionalId(parseInt(storedProfessionalId, 10));
        }
      }
    } catch (error) {
      console.error('Failed to load professional from sessionStorage:', error);
    }
  }, [location.state, setBookingProfessional, setSelectedProfessionalId]);

  // Resolve professional data: context > location state > sessionStorage
  const resolvedProfessional = bookingProfessional || 
    (location.state as { professional?: any } | null)?.professional ||
    (() => {
      try {
        const stored = sessionStorage.getItem(BOOKING_PROFESSIONAL_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })();

  const resolvedProfessionalId = selectedProfessionalId !== null && selectedProfessionalId !== undefined
    ? selectedProfessionalId
    : (location.state as { professionalId?: number } | null)?.professionalId ||
      (() => {
        try {
          const stored = sessionStorage.getItem(BOOKING_PROFESSIONAL_ID_KEY);
          return stored ? parseInt(stored, 10) : null;
        } catch {
          return null;
        }
      })();

  const locationState = location.state as {
    bookingPricing?: { servicePrice: number; platformFee: number; total: number };
    bookingPricingError?: string;
  } | null;
  const initialPricing = locationState?.bookingPricing;
  const initialPricingError = locationState?.bookingPricingError;

  return (
    <BookingFlow
      onConfirm={(data) => {
        setBookingData(data);
        navigate("/booking/confirmation");
      }}
      onBack={() => navigate("/professionals/compare")}
      selectedService={selectedService}
      selectedProfessional={selectedProfessional}
      professionalId={resolvedProfessionalId}
      bookingProfessional={resolvedProfessional}
      initialPricing={initialPricing}
      initialPricingError={initialPricingError}
      isCustomQuote={questionnaireData?.isCustomQuote}
      customQuoteRequestData={questionnaireData?.request_data}
      serviceIdForQuote={questionnaireData?.service_id}
    />
  );
}

