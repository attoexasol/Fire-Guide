import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ProfessionalAuth } from "../ProfessionalAuth";
import { setUserInfo } from "../../lib/auth";

export default function ProfessionalAuthPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();

  return (
    <ProfessionalAuth
      onAuthSuccess={(name: string) => {
        setCurrentUser({ name, role: "professional" });
        setUserInfo(name, "professional");
        navigate("/professional/dashboard");
      }}
      onBack={() => navigate("/")}
      onNavigateHome={() => navigate("/")}
      onNavigateServices={() => navigate("/services")}
      onNavigateProfessionals={() => navigate("/professional/benefits")}
      onNavigateAbout={() => navigate("/about")}
      onNavigateContact={() => navigate("/about")}
    />
  );
}

