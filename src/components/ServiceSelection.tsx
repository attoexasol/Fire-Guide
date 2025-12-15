import { useState } from "react";
import { ClipboardCheck, Flame, Bell, DoorOpen, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Header } from "./Header";

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

  const services = [
    {
      id: "risk-assessment",
      icon: ClipboardCheck,
      title: "Fire Risk Assessment",
      description: "Comprehensive evaluation of fire hazards and safety measures in your premises"
    },
    {
      id: "extinguisher",
      icon: Flame,
      title: "Fire Extinguisher Service",
      description: "Supply, maintenance, and certification of fire extinguishers for your property"
    },
    {
      id: "alarm-service",
      icon: Bell,
      title: "Fire Alarm Service",
      description: "Installation, maintenance, and testing of fire alarm systems"
    },
    {
      id: "door-inspection",
      icon: DoorOpen,
      title: "Fire Door Inspection",
      description: "Professional inspection and certification of fire doors to ensure compliance"
    },
    {
      id: "marshal-training",
      icon: GraduationCap,
      title: "Fire Marshal Training",
      description: "Certified training programs for designated fire safety personnel"
    }
  ];

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
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => (
              <Card
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedService === service.id
                    ? "border-2 border-red-600 shadow-lg"
                    : "border-2 border-transparent hover:border-gray-200"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedService === service.id
                        ? "bg-red-600"
                        : "bg-red-100"
                    }`}>
                      <service.icon className={`w-8 h-8 ${
                        selectedService === service.id
                          ? "text-white"
                          : "text-red-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

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