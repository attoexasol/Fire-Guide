import React, { useState, useEffect } from "react";
import { ClipboardCheck, Flame, Bell, DoorOpen, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Header } from "./Header";
import { fetchServices, ServiceResponse } from "../api/servicesService";

interface ServiceSelectionProps {
  onSelectService: (serviceId: string, serviceName?: string) => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigateProfessionals?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onCustomerLogin?: () => void;
  currentUser?: { name: string; role: "customer" | "professional" | "admin" } | null;
  onLogout?: () => void;
  onNavigateToDashboard?: () => void;
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
  onLogout,
  onNavigateToDashboard
}: ServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback descriptions when API returns none
  const serviceDescriptionMap: Record<string, string> = {
    "Fire Safety Consultation": "Professional fire safety advice to help dutyholders understand requirements, review concerns, and plan appropriate fire safety measures for their premises.",
    "Fire Marshal / Warden Training": "Training for designated fire marshals and wardens on evacuation procedures, fire prevention, and emergency response.",
    "Fire Risk Assessment": "A suitable and sufficient assessment of fire hazards and fire safety measures within your premises, tailored to its use and occupancy.",
    "Fire Alarm Service": "Installation, inspection, testing, and maintenance of fire alarm systems to confirm they operate as intended and provide effective warning.",
    "Fire Extinguisher Service": "Supply, inspection, and maintenance of fire extinguishers appropriate to the risks and layout of your premises.",
    "Emergency Lighting Test": "Inspection and testing of emergency lighting systems to support visibility of escape routes in the event of power failure.",
  };

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
        // Order: 1 Fire Risk Assessment, 2 Fire Alarm, 3 Fire Extinguisher, 4 Emergency Lighting, 5 Fire Marshal / Warden Training, 6 Fire Safety Consultation
        const order: Record<string, number> = {
          "fire risk assessment": 1,
          "fire alarm": 2,
          "fire extinguisher": 3,
          "emergency lighting": 4,
          "warden": 5,
          "marshal": 5,
          "fire safety consultation": 6,
        };
        const getOrder = (name: string | undefined) => {
          const lower = name?.toLowerCase() ?? "";
          for (const [key, val] of Object.entries(order)) {
            if (lower.includes(key)) return val;
          }
          return 99;
        };
        const sorted = [...data].sort((a, b) => getOrder(a.service_name) - getOrder(b.service_name));
        setServices(sorted);
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
      const serviceName = services.find((s) => s.id.toString() === selectedService)?.service_name;
      onSelectService(selectedService, serviceName);
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
        onNavigateToDashboard={onNavigateToDashboard}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedService(serviceId);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedService(serviceId);
                      }
                    }}
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
                            {serviceDescriptionMap[service.service_name] || service.description || "Professional fire safety support tailored to your needs."}
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