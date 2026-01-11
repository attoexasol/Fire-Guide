import React, { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { LandingPage as LandingPageComponent } from "../LandingPage";

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  return (
    <LandingPageComponent
      onGetStarted={() => {
        startTransition(() => {
          navigate("/services");
        });
      }}
      onProfessionalLogin={() => {
        startTransition(() => {
          navigate("/professional/benefits");
        });
      }}
      onAdminLogin={() => {
        startTransition(() => {
          navigate("/admin/login");
        });
      }}
      onCustomerLogin={() => {
        startTransition(() => {
          navigate("/customer/auth");
        });
      }}
      currentUser={currentUser || null}
      onLogout={() => {
        logout();
        startTransition(() => {
          navigate("/");
        });
      }}
      onAboutContact={() => {
        startTransition(() => {
          navigate("/about");
        });
      }}
      onNavigateToDashboard={() => {
        if (currentUser) {
          startTransition(() => {
            if (currentUser.role === "admin") {
              navigate("/admin/dashboard");
            } else if (currentUser.role === "professional") {
              navigate("/professional/dashboard");
            } else {
              navigate("/customer/dashboard");
            }
          });
        }
      }}
    />
  );
}

