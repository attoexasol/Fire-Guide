import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { AboutContact } from "../AboutContact";

export default function AboutContactPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  return (
    <AboutContact
      onBack={() => navigate("/")}
      onAdminLogin={() => navigate("/admin/login")}
      currentUserName={currentUser?.name}
      onLogout={() => {
        logout();
        navigate("/");
      }}
      onNavigateServices={() => navigate("/services")}
      onNavigateProfessionals={() => navigate("/professional/auth")}
      onCustomerLogin={() => navigate("/customer/auth")}
    />
  );
}

