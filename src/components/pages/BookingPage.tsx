import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { BookingFlow } from "../BookingFlow";

const BOOKING_PROFESSIONAL_KEY = 'fireguide_booking_professional';
const BOOKING_PROFESSIONAL_ID_KEY = 'fireguide_booking_professional_id';
const BOOKING_SERVICE_ID_KEY = 'fireguide_booking_service_id';
const BOOKING_SESSION_ID_KEY = 'fireguide_booking_session_id';
const BOOKING_PRICING_KEY = 'fireguide_booking_pricing';
const BOOKING_PRICING_ERROR_KEY = 'fireguide_booking_pricing_error';
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

  // Restore professional, service, and session data from sessionStorage or location state on mount/reload
  useEffect(() => {
    // First, try location state (from immediate navigation)
    const state = location.state as { professional?: any; professionalId?: number; serviceId?: number; sessionId?: number } | null;
    if (state?.professional) {
      setBookingProfessional(state.professional);
      setSelectedProfessionalId(state.professionalId ?? null);
      if (state.professionalId != null) {
        try {
          sessionStorage.setItem(BOOKING_PROFESSIONAL_ID_KEY, String(state.professionalId));
        } catch (_) {}
      }
      if (state.serviceId != null) {
        try {
          sessionStorage.setItem(BOOKING_SERVICE_ID_KEY, String(state.serviceId));
        } catch (_) {}
      }
      if (state.sessionId != null) {
        try {
          sessionStorage.setItem(BOOKING_SESSION_ID_KEY, String(state.sessionId));
        } catch (_) {}
      }
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
    bookingPricing?: { servicePrice: number; platformFee: number; total: number; platformFeePercent?: string };
    bookingPricingError?: string;
    serviceId?: number;
    sessionId?: number;
  } | null;
  const initialPricing = locationState?.bookingPricing ?? (() => {
    try {
      const stored = sessionStorage.getItem(BOOKING_PRICING_KEY);
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  })();
  const initialPricingError = locationState?.bookingPricingError ?? (() => {
    try {
      return sessionStorage.getItem(BOOKING_PRICING_ERROR_KEY) ?? undefined;
    } catch {
      return undefined;
    }
  })();
  const resolvedServiceId = locationState?.serviceId ?? (() => {
    try {
      const stored = sessionStorage.getItem(BOOKING_SERVICE_ID_KEY);
      return stored ? parseInt(stored, 10) : undefined;
    } catch {
      return undefined;
    }
  })();

  const resolvedSessionId = locationState?.sessionId ?? (() => {
    try {
      const stored = sessionStorage.getItem(BOOKING_SESSION_ID_KEY);
      return stored ? parseInt(stored, 10) : undefined;
    } catch {
      return undefined;
    }
  })();

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
      serviceId={resolvedServiceId}
      sessionId={resolvedSessionId}
      bookingProfessional={resolvedProfessional}
      initialPricing={initialPricing}
      initialPricingError={initialPricingError}
      questionnaireData={questionnaireData}
      isCustomQuote={questionnaireData?.isCustomQuote}
      customQuoteRequestData={questionnaireData?.request_data}
      serviceIdForQuote={questionnaireData?.service_id}
    />
  );
}

