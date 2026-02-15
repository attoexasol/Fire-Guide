import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { SmartQuestionnaire } from "../SmartQuestionnaire";

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedService, setQuestionnaireData } = useApp();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId || selectedService;
  const serviceName = (location.state as { serviceName?: string } | null)?.serviceName;

  return (
    <SmartQuestionnaire
      service={service}
      serviceId={serviceId && /^\d+$/.test(serviceId) ? parseInt(serviceId, 10) : undefined}
      serviceName={serviceName}
      onComplete={(data) => {
        setQuestionnaireData(data);
        navigate(`/services/${service}/location`);
      }}
      onBack={() => navigate("/services")}
    />
  );
}

