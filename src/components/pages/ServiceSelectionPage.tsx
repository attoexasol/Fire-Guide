import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ServiceSelection } from "../ServiceSelection";

export default function ServiceSelectionPage() {
  const navigate = useNavigate();
  const { currentUser, logout, setSelectedService } = useApp();

  return (
    <ServiceSelection
      onSelectService={(service) => {
        setSelectedService(service);
        navigate(`/services/${service}/questionnaire`);
      }}
      onBack={() => navigate("/")}
      onNavigateHome={() => navigate("/")}
      onNavigateServices={() => navigate("/services")}
      onNavigateProfessionals={() => navigate("/professional/benefits")}
      onNavigateAbout={() => navigate("/about")}
      onNavigateContact={() => navigate("/about")}
      onCustomerLogin={() => navigate("/customer/auth")}
      currentUser={currentUser}
      onLogout={() => {
        logout();
        navigate("/");
      }}
    />
  );
}

