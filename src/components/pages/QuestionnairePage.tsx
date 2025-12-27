import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { SmartQuestionnaire } from "../SmartQuestionnaire";

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { selectedService, setQuestionnaireData } = useApp();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId || selectedService;

  return (
    <SmartQuestionnaire
      service={service}
      onComplete={(data) => {
        setQuestionnaireData(data);
        navigate(`/services/${service}/location`);
      }}
      onBack={() => navigate("/services")}
    />
  );
}

