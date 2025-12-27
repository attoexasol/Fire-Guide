import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { AdminLogin } from "../AdminLogin";
import { setUserInfo } from "../../lib/auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();

  return (
    <AdminLogin
      onLoginSuccess={(name: string) => {
        setCurrentUser({ name, role: "admin" });
        setUserInfo(name, "admin");
        navigate("/admin/dashboard");
      }}
      onBack={() => navigate("/")}
    />
  );
}

