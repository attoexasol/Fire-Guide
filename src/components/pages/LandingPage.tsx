import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { LandingPage as LandingPageComponent } from "../LandingPage";

export default function LandingPage() {
  try {
    const navigate = useNavigate();
    const { currentUser, logout } = useApp();

    return (
      <LandingPageComponent
        onGetStarted={() => navigate("/services")}
        onProfessionalLogin={() => navigate("/professional/benefits")}
        onAdminLogin={() => navigate("/admin/login")}
        onCustomerLogin={() => navigate("/customer/auth")}
        currentUser={currentUser || null}
        onLogout={() => {
          logout();
          navigate("/");
        }}
        onAboutContact={() => navigate("/about")}
      />
    );
  } catch (error) {
    console.error("LandingPage error:", error);
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Page</h1>
          <p className="text-red-500 mt-2">{String(error)}</p>
        </div>
      </div>
    );
  }
}

