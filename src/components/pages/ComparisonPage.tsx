import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ComparisonResults } from "../ComparisonResults";
import { calculatePriceForBooking } from "../../api/bookingService";

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
  const { setSelectedProfessional, setBookingProfessional, setSelectedProfessionalId, selectedService, questionnaireData } = useApp();
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

        // Fetch price when user clicks Book Now so Booking Summary shows API values or error
        let bookingPricing: { servicePrice: number; platformFee: number; total: number } | undefined;
        let bookingPricingError: string | undefined;
        try {
          const res = await calculatePriceForBooking(professional.id);
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

