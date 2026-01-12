import React, { useState, useEffect } from "react";
import { ClipboardCheck, Bell, Flame, DoorOpen, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ServiceCard, Service } from "./ServiceCard";
import { fetchServices, ServiceResponse } from "../api/servicesService";
import { toast } from "sonner";

interface ServicesGridProps {
  onSelectService: () => void;
}

// Default icon mapping - fallback icons for services
const defaultIcons = [ClipboardCheck, Bell, Flame, DoorOpen, Lightbulb, Sparkles];
const colorOptions = ["red", "blue", "orange", "green", "purple"];

// Description mapping for services - override API descriptions with updated text
const serviceDescriptionMap: Record<string, string> = {
  "Fire Risk Assessment": "A suitable and sufficient assessment of fire hazards and fire safety measures within your premises, tailored to its use and occupancy.",
  "Fire Alarm Service": "Installation, inspection, testing, and maintenance of fire alarm systems to confirm they operate as intended and provide effective warning.",
  "Fire Extinguisher Service": "Supply, inspection, and maintenance of fire extinguishers appropriate to the risks and layout of your premises.",
  "Fire Door Inspection": "Inspection of fire doors to assess condition, functionality, and suitability in supporting fire compartmentation and safe escape.",
  "Emergency Lighting Test": "Inspection and testing of emergency lighting systems to support visibility of escape routes in the event of power failure.",
  "Emergency Lighting": "Inspection and testing of emergency lighting systems to support visibility of escape routes in the event of power failure.",
  "Emergency Lighting Testing": "Inspection and testing of emergency lighting systems to support visibility of escape routes in the event of power failure.",
  "Fire Safety Consultation": "Professional fire safety advice to help dutyholders understand requirements, review concerns, and plan appropriate fire safety measures for their premises."
};

// Map API response to Service interface
const mapApiServiceToService = (apiService: ServiceResponse, index: number): Service => {
  // Determine if service is active (status === "ACTIVE")
  const isActive = apiService.status?.toUpperCase() === "ACTIVE";
  
  // Format price with £ symbol
  const formattedPrice = apiService.price 
    ? `£${parseFloat(apiService.price).toFixed(2)}`
    : "£0.00";
  
  // Use icon from API if available, otherwise use default icon based on index
  const iconIndex = index % defaultIcons.length;
  const iconComponent = defaultIcons[iconIndex];
  
  // Assign color based on index
  const colorIndex = index % colorOptions.length;
  const color = colorOptions[colorIndex] as "red" | "blue" | "orange" | "green" | "purple";

  // Use mapped description if available, otherwise use API description or fallback
  const serviceName = apiService.service_name || "Service";
  const mappedDescription = serviceDescriptionMap[serviceName] || apiService.description || "No description available";

  return {
    id: apiService.id,
    name: serviceName,
    icon: apiService.icon || undefined,
    iconComponent: iconComponent,
    description: mappedDescription,
    basePrice: formattedPrice,
    active: isActive,
    popular: false, // Remove popular label
    color: color
  };
};

export function ServicesGrid({ onSelectService }: ServicesGridProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiServices = await fetchServices();
        const mappedServices = apiServices.map((apiService, index) => 
          mapApiServiceToService(apiService, index)
        );
        setServices(mappedServices);
      } catch (err: any) {
        console.error("Error loading services:", err);
        setError(err?.message || "Failed to load services");
        toast.error("Failed to load services. Please try again later.");
        // Set empty array on error to show nothing
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Show all services (both active and inactive)
  const allServices = services;
console.log(allServices);
  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[48px] font-[800] leading-[120%] tracking-[-0.01em] mt-4 mb-[10px]">
            Our Services
          </h2>
          <p className="text-[14px] md:text-[16px] leading-[150%] md:leading-[140%] text-[#666] max-w-2xl mx-auto px-4">
            Find independent fire safety professionals to support all aspects of fire safety management — in one place.
          </p>
        </div>
        
        {/* Services Grid - 24px spacing between cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </div>
        ) : allServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {allServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                variant="customer"
                onClick={onSelectService}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <Button onClick={onSelectService} className="bg-red-600 hover:bg-red-700 px-8 h-14 text-base">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
