import { useState } from "react";
import { 
  DollarSign, 
  Info,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ServicePrice {
  id: string;
  name: string;
  description: string;
  price: string;
  suggested: string;
}

export function ProfessionalPricingContent() {
  const [services, setServices] = useState<ServicePrice[]>([
    {
      id: "fire-risk-assessment",
      name: "Fire Risk Assessment",
      description: "Comprehensive property fire safety evaluation",
      price: "250",
      suggested: "£200-350"
    },
    {
      id: "fire-alarm-service",
      name: "Fire Alarm Service",
      description: "Installation, testing, and maintenance",
      price: "150",
      suggested: "£100-200"
    },
    {
      id: "fire-extinguisher",
      name: "Fire Extinguisher Service",
      description: "Inspection, testing, and servicing",
      price: "80",
      suggested: "£50-120"
    },
    {
      id: "fire-door",
      name: "Fire Door Inspection",
      description: "Inspection and compliance certification",
      price: "120",
      suggested: "£80-150"
    },
    {
      id: "fire-marshal-training",
      name: "Fire Marshal Training",
      description: "Staff training and certification",
      price: "180",
      suggested: "£150-250"
    },
    {
      id: "emergency-lighting",
      name: "Emergency Lighting Testing",
      description: "Full testing and certification",
      price: "100",
      suggested: "£80-130"
    },
    {
      id: "evacuation-plan",
      name: "Evacuation Plan Development",
      description: "Custom evacuation planning and signage",
      price: "200",
      suggested: "£150-300"
    },
    {
      id: "fire-suppression",
      name: "Fire Suppression Systems",
      description: "Installation and maintenance",
      price: "500",
      suggested: "£400-700"
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const updatePrice = (id: string, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    setServices(services.map(service => 
      service.id === id ? { ...service, price: value } : service
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1500);
  };

  const isFormValid = services.every(service => service.price && parseInt(service.price) > 0);
  const totalServices = services.filter(s => s.price && parseInt(s.price) > 0).length;
  const averagePrice = services.reduce((sum, s) => sum + (parseInt(s.price) || 0), 0) / services.length;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[#0A1A2F] mb-2">
          Set Your Service Pricing
        </h1>
        <p className="text-gray-600">
          Configure your prices for each service you offer
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Pricing Form - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pricing Cards */}
          {services.map((service) => {
            const currentPrice = parseInt(service.price) || 0;
            const [minSuggested, maxSuggested] = service.suggested
              .replace(/£/g, "")
              .split("-")
              .map(s => parseInt(s));
            
            const isAboveSuggested = currentPrice > maxSuggested;
            const isBelowSuggested = currentPrice < minSuggested && currentPrice > 0;
            const isInRange = currentPrice >= minSuggested && currentPrice <= maxSuggested;

            return (
              <Card key={service.id} className="border-0 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-500 mb-1">Market Range</p>
                      <p className="font-semibold text-gray-700">{service.suggested}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    <div className="flex-1 w-full">
                      <Label htmlFor={`price-${service.id}`} className="mb-2 block">
                        Your Price
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          £
                        </span>
                        <Input
                          id={`price-${service.id}`}
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={service.price}
                          onChange={(e) => updatePrice(service.id, e.target.value)}
                          className="pl-7 text-lg h-12"
                        />
                      </div>
                    </div>
                    
                    {/* Price Indicator */}
                    <div className="w-full md:w-auto">
                      {isInRange && currentPrice > 0 && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Competitive</span>
                        </div>
                      )}
                      {isAboveSuggested && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                          <TrendingUp className="w-4 h-4" />
                          <span>Above market</span>
                        </div>
                      )}
                      {isBelowSuggested && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                          <TrendingUp className="w-4 h-4 rotate-180" />
                          <span>Below market</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sidebar - Takes 1 column on desktop */}
        <div className="space-y-6">
          {/* Pricing Summary - Sticky on desktop */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Services Priced</span>
                <span className="text-2xl font-semibold text-gray-900">{totalServices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Price</span>
                <span className="text-2xl font-semibold text-gray-900">£{averagePrice.toFixed(0)}</span>
              </div>
              <div className="pt-4 border-t border-blue-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-semibold text-gray-900">
                      {((totalServices / services.length) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(totalServices / services.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commission Info */}
          <Card className="border-0 shadow-md bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900 mb-2">Platform Commission</p>
                  <p className="text-sm text-yellow-800 mb-2">
                    Fire Guide charges a 15% commission on each booking. Your listed prices are what customers pay, and you receive 85%.
                  </p>
                  <p className="text-sm text-yellow-900 font-medium">
                    Example: £100 booking = £85 for you
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tips */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Pricing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>Stay within market range for more bookings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>Higher prices may reduce booking frequency</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>Lower prices attract more customers</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>You can adjust prices anytime</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button - Fixed at bottom on mobile, inline on desktop */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg mt-6 p-4 lg:static lg:border-0 lg:shadow-none lg:mt-6">
        <div className="flex flex-col md:flex-row gap-3 max-w-7xl mx-auto">
          <Button 
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            className="flex-1 bg-red-600 hover:bg-red-700 h-12 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Pricing"}
          </Button>
          <Button variant="outline" className="md:w-auto h-12">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
