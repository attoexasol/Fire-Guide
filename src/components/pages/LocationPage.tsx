import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { LocationPage as LocationPageComponent } from "../LocationPage";

export default function LocationPage() {
  const navigate = useNavigate();
  const { selectedService, questionnaireData } = useApp();
  const { serviceId } = useParams<{ serviceId: string }>();
  const serviceIdNum = parseInt(serviceId || selectedService) || 0;

  return (
    <LocationPageComponent
      serviceId={serviceIdNum}
      questionnaireData={questionnaireData}
      onContinue={() => navigate("/professionals/compare")}
      onBack={() => navigate(`/services/${serviceId || selectedService}/questionnaire`)}
    />
  );
}

