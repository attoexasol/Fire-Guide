import { useNavigate } from "react-router-dom";
import { ProfessionalBenefits } from "../ProfessionalBenefits";

export default function ProfessionalBenefitsPage() {
  const navigate = useNavigate();

  return (
    <ProfessionalBenefits
      onRegister={() => navigate("/professional/auth")}
      onLogin={() => navigate("/professional/auth")}
      onBack={() => navigate("/")}
      onNavigateHome={() => navigate("/")}
      onNavigateServices={() => navigate("/services")}
      onNavigateAbout={() => navigate("/about")}
      onNavigateContact={() => navigate("/about")}
    />
  );
}

