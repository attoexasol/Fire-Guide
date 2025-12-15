import { ClipboardCheck, Bell, Flame, DoorOpen, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";
import { ServiceCard, Service } from "./ServiceCard";

interface ServicesGridProps {
  onSelectService: () => void;
}

export function ServicesGrid({ onSelectService }: ServicesGridProps) {
  const services: Service[] = [
    {
      id: 1,
      name: "Fire Risk Assessment",
      iconComponent: ClipboardCheck,
      description: "Comprehensive evaluation of fire hazards and safety measures in your property",
      basePrice: "£250",
      popular: true,
      active: true,
      color: "red"
    },
    {
      id: 2,
      name: "Fire Alarm Service",
      iconComponent: Bell,
      description: "Installation, maintenance, and testing of fire alarm systems",
      basePrice: "£200",
      popular: true,
      active: true,
      color: "blue"
    },
    {
      id: 3,
      name: "Fire Extinguisher Service",
      iconComponent: Flame,
      description: "Supply, maintenance, and certification of fire extinguishers",
      basePrice: "£150",
      popular: true,
      active: true,
      color: "orange"
    },
    {
      id: 4,
      name: "Fire Door Inspection",
      iconComponent: DoorOpen,
      description: "Professional inspection and certification of fire doors",
      basePrice: "£120",
      active: true,
      color: "green"
    },
    {
      id: 5,
      name: "Emergency Lighting Test",
      iconComponent: Lightbulb,
      description: "Testing and certification of emergency lighting systems to ensure compliance",
      basePrice: "£180",
      active: true,
      color: "purple"
    }
  ];

  // Only show active services
  const activeServices = services.filter(service => service.active !== false);

  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[48px] font-[800] leading-[120%] tracking-[-0.01em] mt-4 mb-[10px]">
            Our Services
          </h2>
          <p className="text-[14px] md:text-[16px] leading-[150%] md:leading-[140%] text-[#666] max-w-2xl mx-auto px-4">
            Find trusted professionals for all your fire safety needs
          </p>
        </div>
        
        {/* Services Grid - 24px spacing between cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant="customer"
              onClick={onSelectService}
            />
          ))}
        </div>

        <div className="text-center">
          <Button onClick={onSelectService} className="bg-red-600 hover:bg-red-700 px-8 h-14 text-base">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
