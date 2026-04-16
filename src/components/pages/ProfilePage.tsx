import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ProfessionalProfile } from "../ProfessionalProfile";
import { createBookingSelectedSession } from "../../lib/createBookingSelectedSession";
import { toast } from "sonner";

const SELECTED_PROFESSIONAL_KEY = 'fireguide_selected_professional';
const SELECTED_PROFESSIONAL_ID_KEY = 'fireguide_selected_professional_id';
const BOOKING_SERVICE_ID_KEY = 'fireguide_booking_service_id';
const BOOKING_SESSION_ID_KEY = 'fireguide_booking_session_id';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedProfessional,
    setSelectedProfessional,
    setBookingProfessional,
    setSelectedProfessionalId,
    locationSearchData,
    selectedServiceId,
    questionnaireData,
  } = useApp();
  const { professionalId } = useParams<{ professionalId: string }>();

  // Restore professional data from sessionStorage or location state on mount/reload
  useEffect(() => {
    // First, try location state (from immediate navigation)
    const locationState = location.state as { professional?: any; professionalId?: number } | null;
    if (locationState?.professional) {
      setSelectedProfessional(locationState.professional);
      return;
    }

    // Then, try sessionStorage (for browser reload)
    try {
      const storedProfessional = sessionStorage.getItem(SELECTED_PROFESSIONAL_KEY);
      const storedProfessionalId = sessionStorage.getItem(SELECTED_PROFESSIONAL_ID_KEY);
      
      if (storedProfessional) {
        const professional = JSON.parse(storedProfessional);
        setSelectedProfessional(professional);
      } else if (storedProfessionalId && professionalId && storedProfessionalId === professionalId) {
        // If we have matching ID but no full professional data, try to restore from context or use ID
        // The professional data might be in context already
      }
    } catch (error) {
      console.error('Failed to load selected professional from sessionStorage:', error);
    }
  }, [location.state, professionalId, setSelectedProfessional]);

  // Resolve professional data: context > location state > sessionStorage > ID only
  const resolvedProfessional = selectedProfessional || 
    (location.state as { professional?: any } | null)?.professional ||
    (() => {
      try {
        const stored = sessionStorage.getItem(SELECTED_PROFESSIONAL_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })() ||
    (professionalId ? { id: parseInt(professionalId, 10) } : null);

  const professionalIdNum = professionalId ? parseInt(professionalId, 10) : null;

  return (
    <ProfessionalProfile
      professional={resolvedProfessional}
      professionalIdFromUrl={professionalIdNum ?? undefined}
      onBook={async () => {
        const id = professionalIdNum ?? resolvedProfessional?.id ?? resolvedProfessional?.professional_id ?? null;
        if (resolvedProfessional) {
          setBookingProfessional(resolvedProfessional);
          setSelectedProfessionalId(id ?? undefined);
        }
        // Same sources as Comparison "Book now" — profile previously omitted serviceId, so payment step failed while summary still showed a label.
        const qSid = questionnaireData?.service_id;
        const rawServiceId =
          locationSearchData?.service_id ??
          selectedServiceId ??
          (typeof qSid === "number" ? qSid : qSid != null ? Number(qSid) : null);
        const serviceIdNum =
          rawServiceId != null && !Number.isNaN(Number(rawServiceId)) ? Number(rawServiceId) : undefined;
        if (serviceIdNum != null) {
          try {
            sessionStorage.setItem(BOOKING_SERVICE_ID_KEY, String(serviceIdNum));
          } catch (_) {}
        }

        let sessionIdForBooking: number | undefined;
        if (
          id != null &&
          serviceIdNum != null &&
          questionnaireData &&
          locationSearchData
        ) {
          const created = await createBookingSelectedSession({
            professionalId: Number(id),
            serviceId: serviceIdNum,
            questionnaireData: questionnaireData as Record<string, unknown>,
            locationSearchData,
          });
          if (created.error) {
            toast.error(created.error);
            return;
          }
          sessionIdForBooking = created.sessionId;
        }
        if (serviceIdNum != null && sessionIdForBooking == null) {
          toast.error(
            "Could not start your booking session. Please use Compare Professionals and click Book, or complete the service questionnaire first."
          );
          return;
        }
        if (sessionIdForBooking != null) {
          try {
            sessionStorage.setItem(BOOKING_SESSION_ID_KEY, String(sessionIdForBooking));
          } catch (_) {}
        }

        navigate("/booking", {
          state: {
            professional: resolvedProfessional,
            professionalId: id ?? undefined,
            ...(serviceIdNum != null ? { serviceId: serviceIdNum } : {}),
            ...(sessionIdForBooking != null ? { sessionId: sessionIdForBooking } : {}),
          },
        });
      }}
      onBack={() => navigate("/professionals/compare")}
    />
  );
}

