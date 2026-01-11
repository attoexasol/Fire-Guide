import React, { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ProfessionalAuth } from "../ProfessionalAuth";
import { setUserInfo, getUserRole } from "../../lib/auth";

export default function ProfessionalAuthPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();

  return (
    <ProfessionalAuth
      onAuthSuccess={(name: string) => {
        // Get user role from backend FIRST (stored during auth)
        const userRole = getUserRole();
        
        // Set user info based on actual role from backend
        if (userRole === "USER") {
          setCurrentUser({ name, role: "customer" });
          setUserInfo(name, "customer");
        } else if (userRole === "PROFESSIONAL") {
          setCurrentUser({ name, role: "professional" });
          setUserInfo(name, "professional");
        } else if (userRole === "ADMIN") {
          setCurrentUser({ name, role: "admin" });
          setUserInfo(name, "admin");
        } else {
          // Fallback to professional if role not found
          setCurrentUser({ name, role: "professional" });
          setUserInfo(name, "professional");
        }
        
        // Redirect immediately based on role (wrapped in startTransition to avoid suspend during sync input)
        startTransition(() => {
          if (userRole === "USER") {
            navigate("/customer/dashboard", { replace: true });
          } else if (userRole === "PROFESSIONAL") {
            navigate("/professional/dashboard", { replace: true });
          } else if (userRole === "ADMIN") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            // Fallback to professional dashboard if role is not set
            navigate("/professional/dashboard", { replace: true });
          }
        });
      }}
      onBack={() => {
        startTransition(() => {
          navigate("/");
        });
      }}
      onNavigateHome={() => {
        startTransition(() => {
          navigate("/");
        });
      }}
      onNavigateServices={() => {
        startTransition(() => {
          navigate("/services");
        });
      }}
      onNavigateProfessionals={() => {
        startTransition(() => {
          navigate("/professional/benefits");
        });
      }}
      onNavigateAbout={() => {
        startTransition(() => {
          navigate("/about");
        });
      }}
      onNavigateContact={() => {
        startTransition(() => {
          navigate("/about");
        });
      }}
    />
  );
}

