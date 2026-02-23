import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ComparisonResults } from "../ComparisonResults";
import { calculatePriceForBooking } from "../../api/bookingService";
import { storeSelectedService } from "../../api/servicesService";
import { toast } from "sonner";

const BOOKING_PROFESSIONAL_KEY = 'fireguide_booking_professional';
const BOOKING_PROFESSIONAL_ID_KEY = 'fireguide_booking_professional_id';
const SELECTED_PROFESSIONAL_KEY = 'fireguide_selected_professional';
const SELECTED_PROFESSIONAL_ID_KEY = 'fireguide_selected_professional_id';

const QUESTIONNAIRE_STORAGE_KEY = 'fireguide_questionnaire_data';

function getIsCustomQuote() {
  try {
    const stored = sessionStorage.getItem(QUESTIONNAIRE_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return Boolean(data?.isCustomQuote);
    }
  } catch (_) {}
  return false;
}

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { setSelectedProfessional, setBookingProfessional, setSelectedProfessionalId, selectedService, questionnaireData, locationSearchData } = useApp();
  const isCustomQuote = Boolean(questionnaireData?.isCustomQuote) || getIsCustomQuote();

  return (
    <ComparisonResults
      onViewProfile={(professional) => {
        // Update context state
        setSelectedProfessional(professional);
        
        // Persist to sessionStorage for browser reload
        try {
          sessionStorage.setItem(SELECTED_PROFESSIONAL_KEY, JSON.stringify(professional));
          sessionStorage.setItem(SELECTED_PROFESSIONAL_ID_KEY, professional.id.toString());
        } catch (error) {
          console.error('Failed to save selected professional to sessionStorage:', error);
        }
        
        // Navigate with state for immediate access
        startTransition(() => {
          navigate(`/professionals/${professional.id}`, { state: { professional, professionalId: professional.id } });
        });
      }}
      onBookNow={async (professional) => {
        setBookingProfessional(professional);
        setSelectedProfessionalId(professional.id);
        try {
          sessionStorage.setItem(BOOKING_PROFESSIONAL_KEY, JSON.stringify(professional));
          sessionStorage.setItem(BOOKING_PROFESSIONAL_ID_KEY, professional.id.toString());
        } catch (error) {
          console.error('Failed to save professional to sessionStorage:', error);
        }

        // 1) Store selected service when Book Now is clicked → get session_id from response (auto-generated)
        let sessionId: number | string | undefined;
        const serviceId = locationSearchData?.service_id;
        if (questionnaireData && locationSearchData && serviceId != null) {
          try {
            const storeRes = await storeSelectedService({
              service_id: serviceId,
              property_type_id: questionnaireData.property_type_id,
              approximate_people_id: questionnaireData.approximate_people_id,
              number_of_floors:
                questionnaireData.number_of_floors_id != null
                  ? String(questionnaireData.number_of_floors_id)
                  : questionnaireData.number_of_floors,
              ...(questionnaireData.number_of_floors_id != null && {
                number_of_floors_id: questionnaireData.number_of_floors_id,
              }),
              ...(questionnaireData.duration_id != null && { duration_id: questionnaireData.duration_id }),
              preferred_date: questionnaireData.preferred_date,
              access_note: questionnaireData.access_note,
              post_code: locationSearchData.post_code,
              search_radius: locationSearchData.search_radius,
              professional_id: professional.id,
            });
            const data = storeRes?.data;
            const rawSession =
              data?.session_id ??
              data?.id ??
              (typeof data === 'object' && data !== null && (data as any).selected_service?.session_id) ??
              (typeof data === 'object' && data !== null && (data as any).selected_service?.id);
            if (rawSession != null && rawSession !== '') {
              const num = typeof rawSession === 'string' ? parseInt(rawSession, 10) : rawSession;
              sessionId = Number.isNaN(num) ? rawSession : num;
            }
          } catch (err: any) {
            console.error('Failed to store selected service with professional:', err);
            toast.error(err?.message || 'Could not complete. Please try again.');
          }
        }

        // 2) Fetch price for booking with { professional_id, session_id, service_id }
        let bookingPricing: { servicePrice: number; platformFee: number; total: number } | undefined;
        let bookingPricingError: string | undefined;
        if (serviceId != null && sessionId != null) {
          try {
            const res = await calculatePriceForBooking({
              professional_id: professional.id,
              session_id: sessionId,
              service_id: serviceId,
            });
            if (res?.status && res?.data) {
              bookingPricing = {
                servicePrice: res.data.service_price,
                platformFee: res.data.platform_fee_amount,
                total: res.data.total_price,
              };
            } else if (res?.status === false && res?.message) {
              bookingPricingError = res.message;
            }
          } catch (err: any) {
            bookingPricingError = err?.message || err?.error || "Unable to load price. Please try again.";
          }
        } else if (serviceId == null) {
          bookingPricingError = "Service not selected. Please start from the service search.";
        } else {
          bookingPricingError = "Could not create booking session. Please try again.";
        }

        startTransition(() => {
          navigate("/booking", {
            state: {
              professional,
              professionalId: professional.id,
              // Don't pass price for custom quote so booking flow shows "Wait for admin" and doesn't go to payment
              ...(bookingPricing && !isCustomQuote && { bookingPricing }),
              ...(bookingPricingError && { bookingPricingError }),
            },
          });
        });
      }}
      onBack={() => {
        startTransition(() => {
          navigate(`/services/${selectedService}/location`);
        });
      }}
    />
  );
}

