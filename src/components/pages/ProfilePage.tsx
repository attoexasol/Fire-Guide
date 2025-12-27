import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ProfessionalProfile } from "../ProfessionalProfile";

const SELECTED_PROFESSIONAL_KEY = 'fireguide_selected_professional';
const SELECTED_PROFESSIONAL_ID_KEY = 'fireguide_selected_professional_id';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProfessional, setSelectedProfessional, setBookingProfessional, setSelectedProfessionalId } = useApp();
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

  return (
    <ProfessionalProfile
      professional={resolvedProfessional}
      onBook={() => {
        if (resolvedProfessional) {
          setBookingProfessional(resolvedProfessional);
          setSelectedProfessionalId(resolvedProfessional.id);
        }
        navigate("/booking");
      }}
      onBack={() => navigate("/professionals/compare")}
    />
  );
}

