import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface PricingPreviewProps {
  onGetQuote: () => void;
}

export function PricingPreview({ onGetQuote }: PricingPreviewProps) {
  const services = [
    {
      title: "Fire Risk Assessment",
      startingPrice: "£150",
      features: [
        "Comprehensive site inspection",
        "Detailed risk assessment report",
        "Action plan with recommendations",
        "Compliance certificate",
        "Follow-up consultation"
      ],
      popular: true
    },
    {
      title: "Fire Alarm Service",
      startingPrice: "£120",
      features: [
        "System inspection & testing",
        "Maintenance & repairs",
        "Compliance certification",
        "24/7 emergency support",
        "Annual service plan"
      ],
      popular: false
    },
    {
      title: "Fire Extinguisher Service",
      startingPrice: "£80",
      features: [
        "Equipment inspection",
        "Pressure testing",
        "Replacement if needed",
        "Wall mounting service",
        "Certification & signage"
      ],
      popular: false
    },
    {
      title: "Fire Door Inspection",
      startingPrice: "£95",
      features: [
        "Full door integrity check",
        "Hardware inspection",
        "Seal & gap testing",
        "Certification report",
        "Repair recommendations"
      ],
      popular: false
    },
    {
      title: "Fire Marshal Training",
      startingPrice: "£250",
      features: [
        "Certified training course",
        "Up to 12 participants",
        "Course materials included",
        "Practical fire drills",
        "Official certification"
      ],
      popular: false
    },
    {
      title: "Emergency Lighting",
      startingPrice: "£110",
      features: [
        "System testing & inspection",
        "Battery replacement",
        "Fault diagnosis & repair",
        "Compliance documentation",
        "3-year service plan option"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[48px] font-bold leading-[125%] tracking-[-0.01em] mb-6 max-w-4xl mx-auto">
            Transparent Pricing for Every Service
          </h2>
          <p className="text-[16px] md:text-[20px] leading-[150%] md:leading-[140%] tracking-normal text-gray-600 max-w-2xl mx-auto px-4">
            Compare services and book with confidence. No hidden fees, instant quotes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className={`relative hover:shadow-2xl transition-all border-2 ${
                service.popular 
                  ? 'border-red-600 shadow-lg' 
                  : 'border-gray-200 hover:border-red-100'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-gray-500">From</span>
                  <span className="text-4xl font-semibold text-red-600">{service.startingPrice}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={onGetQuote}
                  className={`w-full ${
                    service.popular 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Get Instant Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need a custom quote for multiple services?
          </p>
          <Button 
            onClick={onGetQuote}
            variant="outline"
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-6 text-lg"
          >
            Contact Sales Team
          </Button>
        </div>
      </div>
    </section>
  );
}