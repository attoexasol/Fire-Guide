import { useState, useEffect } from "react";
import { ClipboardCheck, Flame, Bell, DoorOpen, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Header } from "./Header";
import { fetchServices, ServiceResponse } from "../api/servicesService";

interface ServiceSelectionProps {
  onSelectService: (service: string) => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigateProfessionals?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onCustomerLogin?: () => void;
  currentUser?: { name: string; role: "customer" | "professional" | "admin" } | null;
  onLogout?: () => void;
}

export function ServiceSelection({ 
  onSelectService, 
  onBack,
  onNavigateHome,
  onNavigateServices,
  onNavigateProfessionals,
  onNavigateAbout,
  onNavigateContact,
  onCustomerLogin,
  currentUser,
  onLogout
}: ServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map service types to icons (fallback icons)
  const getIconForService = (type: string | undefined) => {
    const typeUpper = type?.toUpperCase() || "";
    if (typeUpper.includes("DELIVERY")) return Flame;
    if (typeUpper.includes("ASSESSMENT")) return ClipboardCheck;
    if (typeUpper.includes("ALARM")) return Bell;
    if (typeUpper.includes("DOOR")) return DoorOpen;
    if (typeUpper.includes("TRAINING")) return GraduationCap;
    return ClipboardCheck; // Default icon
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchServices();
        setServices(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch services");
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleNext = () => {
    if (selectedService) {
      onSelectService(selectedService);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - EXACT CLONE OF PUBLIC WEBSITE HEADER */}
      <Header
        onGetStarted={onNavigateServices || (() => {})}
        onProfessionalLogin={onNavigateProfessionals || (() => {})}
        onCustomerLogin={onCustomerLogin}
        currentUser={currentUser}
        onLogout={onLogout}
        onNavigateHome={onNavigateHome}
        onNavigateServices={onNavigateServices}
        onNavigateAbout={onNavigateAbout}
        onNavigateContact={onNavigateContact}
      />

      {/* Main Content - Added pt-8 for spacing after header */}
      <main className="py-12 px-6 pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4">
              Select Your Service
            </h1>
            <p className="text-gray-600 text-lg">
              Choose the fire safety service you need
            </p>
          </div>

          {/* Service Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12 mb-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 mb-12">
              <div className="text-center">
                <p className="text-red-600 text-lg mb-4">Error: {error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 mb-12">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {services.map((service) => {
                const ServiceIcon = getIconForService(service.type);
                const serviceId = service.id.toString();
                return (
                  <Card
                    key={service.id}
                    onClick={() => setSelectedService(serviceId)}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedService === serviceId
                        ? "border-2 border-red-600 shadow-lg"
                        : "border-2 border-transparent hover:border-gray-200"
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedService === serviceId
                            ? "bg-red-600"
                            : "bg-red-100"
                        }`}>
                          <ServiceIcon className={`w-8 h-8 ${
                            selectedService === serviceId
                              ? "text-white"
                              : "text-red-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="mb-2">{service.service_name}</CardTitle>
                          <CardDescription className="text-base">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-6 py-6 text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              disabled={!selectedService}
              onClick={handleNext}
              className="bg-red-600 hover:bg-red-700 px-12 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}