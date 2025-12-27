import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ComparisonResults } from "../ComparisonResults";

const BOOKING_PROFESSIONAL_KEY = 'fireguide_booking_professional';
const BOOKING_PROFESSIONAL_ID_KEY = 'fireguide_booking_professional_id';
const SELECTED_PROFESSIONAL_KEY = 'fireguide_selected_professional';
const SELECTED_PROFESSIONAL_ID_KEY = 'fireguide_selected_professional_id';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { setSelectedProfessional, setBookingProfessional, setSelectedProfessionalId, selectedService } = useApp();

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
        navigate(`/professionals/${professional.id}`, { state: { professional, professionalId: professional.id } });
      }}
      onBookNow={(professional) => {
        // Update context state
        setBookingProfessional(professional);
        setSelectedProfessionalId(professional.id);
        
        // Persist to sessionStorage for browser reload
        try {
          sessionStorage.setItem(BOOKING_PROFESSIONAL_KEY, JSON.stringify(professional));
          sessionStorage.setItem(BOOKING_PROFESSIONAL_ID_KEY, professional.id.toString());
        } catch (error) {
          console.error('Failed to save professional to sessionStorage:', error);
        }
        
        // Navigate with state for immediate access
        navigate("/booking", { state: { professional, professionalId: professional.id } });
      }}
      onBack={() => navigate(`/services/${selectedService}/location`)}
    />
  );
}

