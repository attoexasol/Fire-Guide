import { useState, useEffect, startTransition } from "react";
import { 
  DollarSign, 
  Info,
  TrendingUp,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { fetchServices, ServiceResponse } from "../api/servicesService";
import { getSelectedServices, SelectedServiceItem, storeServicePrices } from "../api/professionalsService";
import { getApiToken, getProfessionalId } from "../lib/auth";
import { toast } from "sonner";

interface ServicePrice {
  id: number;
  name: string;
  description: string;
  price: string;
  suggested: string;
  hasPricing: boolean; // Flag to indicate if pricing is set from API
}

export function ProfessionalPricingContent() {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch services and pricing data on mount
  useEffect(() => {
    let isMounted = true;

    const loadServicesAndPricing = async () => {
      try {
        setLoading(true);
        setLoadingError(null);

        // Fetch all available services
        const allServices = await fetchServices();
        
        if (!isMounted) return;

        // Filter only ACTIVE services
        const activeServices = allServices.filter(service => service.status === "ACTIVE");

        // Get professional_id to fetch pricing
        const professionalId = getProfessionalId();
        
        // If professional_id doesn't exist, keep UI blank
        // Professional must complete professional/create process before pricing data is displayed
        if (!professionalId || isNaN(professionalId)) {
          // No professional_id - keep services array empty (blank UI)
          if (isMounted) {
            startTransition(() => {
              setServices([]);
              setLoading(false);
            });
          }
          return;
        }

        // professional_id exists - fetch pricing data
        const token = getApiToken();
        const pricingResponse = await getSelectedServices({
          professional_id: professionalId,
          api_token: token || undefined
        });

        if (!isMounted) return;

        if (pricingResponse.status === true && pricingResponse.data && Array.isArray(pricingResponse.data)) {
          // Create a map of service_id -> pricing data for quick lookup
          // API returns service ID nested in service.id, not at top level service_id
          const pricingMap = new Map<number, SelectedServiceItem>();
          pricingResponse.data.forEach((item) => {
            // Use service.id from nested object if service_id doesn't exist at top level
            // API response structure: { ..., "service": { "id": 34, "service_name": "...", ... } }
            // In the API response, service_id may not exist - use nested service.id instead
            const serviceId = item.service_id ?? item.service?.id;
            if (serviceId && !isNaN(serviceId) && serviceId > 0) {
              pricingMap.set(serviceId, item);
            }
          });
          
          console.log('Pricing Map Created:', Array.from(pricingMap.entries()).map(([id, item]) => ({
            serviceId: id,
            price: item.price,
            serviceName: item.service?.service_name
          })));

          // Map services to include pricing data
          const servicesWithPricing: ServicePrice[] = activeServices.map((service) => {
            const pricingData = pricingMap.get(service.id);
            
            // Extract price value directly from API response
            // API returns price as string like "800", "250", "300" (or null if not set)
            // Ensure priceValue is always a string (never null/undefined)
            let priceValue: string = "";
            
            if (pricingData) {
              // Get the raw price value from API response
              // API returns price as string like "800", "250", "300" (or null if not set)
              const rawPrice = pricingData.price;
              
              // Extract and use the price value directly from API
              // The price field is a string value (e.g., "price": "800")
              // Handle null, undefined, or empty string cases
              if (rawPrice !== null && rawPrice !== undefined && rawPrice !== "") {
                // Convert to string explicitly to ensure consistent handling
                // API returns as string (e.g., "800"), but handle edge cases
                const priceStr = String(rawPrice).trim();
                
                // Use the value if it's a valid non-empty numeric string
                // This correctly extracts "800", "250", "300", etc. from the API
                if (priceStr.length > 0 && priceStr !== "null" && priceStr !== "undefined" && !isNaN(parseFloat(priceStr))) {
                  priceValue = priceStr;
                }
              }
            }
            
            // Check if pricing is set (has a valid non-empty price value)
            // If priceValue is extracted from API (e.g., "800"), hasPricing will be true
            const hasPricing = priceValue !== "" && parseInt(priceValue) > 0;
            
            // Calculate suggested range from service base price if available
            let suggestedRange = "£100-300";
            if (service.price) {
              const basePrice = parseInt(service.price);
              if (!isNaN(basePrice) && basePrice > 0) {
                const min = Math.max(50, basePrice - 50);
                const max = basePrice + 100;
                suggestedRange = `£${min}-${max}`;
              }
            }
            
            // Ensure price is always a string (never null/undefined)
            const finalPrice: string = priceValue || "";
            
            return {
              id: service.id,
              name: service.service_name,
              description: service.description || "",
              price: finalPrice, // This will be the price from API (e.g., "250", "300") or empty string ""
              suggested: suggestedRange,
              hasPricing: hasPricing
            };
          });

          startTransition(() => {
            if (isMounted) {
              setServices(servicesWithPricing);
            }
          });
        } else {
          // No pricing data, just show all services without pricing
          const servicesWithoutPricing: ServicePrice[] = activeServices.map((service) => {
            let suggestedRange = "£100-300";
            if (service.price) {
              const basePrice = parseInt(service.price);
              if (!isNaN(basePrice)) {
                const min = Math.max(50, basePrice - 50);
                const max = basePrice + 100;
                suggestedRange = `£${min}-${max}`;
              }
            }
            
            return {
              id: service.id,
              name: service.service_name,
              description: service.description || "",
              price: "",
              suggested: suggestedRange,
              hasPricing: false
            };
          });

          startTransition(() => {
            if (isMounted) {
              setServices(servicesWithoutPricing);
            }
          });
        }
      } catch (error: any) {
        console.error("Error loading services and pricing:", error);
        if (isMounted) {
          setLoadingError("Failed to load services and pricing. Please try again later.");
        }
      } finally {
        if (isMounted) {
          startTransition(() => {
            setLoading(false);
          });
        }
      }
    };

    loadServicesAndPricing();

    return () => {
      isMounted = false;
    };
  }, []);

  const updatePrice = (id: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    setServices(services.map(service => 
      service.id === id ? { ...service, price: value, hasPricing: !!value && parseInt(value) > 0 } : service
    ));
  };

  const handleSave = async () => {
    // Get services with valid prices (price > 0)
    const servicesWithPrices = services
      .filter(service => service.price && parseInt(service.price) > 0)
      .map(service => ({
        service_id: service.id,
        price: parseInt(service.price) // Convert to number as API expects
      }));

    if (servicesWithPrices.length === 0) {
      toast.error("Please set at least one service price before saving.");
      return;
    }

    // Get API token
    const token = getApiToken();
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsSaving(true);

    try {
      // Call the API to store service prices
      const response = await storeServicePrices({
        api_token: token,
        services: servicesWithPrices
      });

      if (response.status === true || response.success || (response.message && !response.error)) {
        toast.success(response.message || "Service prices saved successfully!");
        
        // Refresh pricing data to get updated values from API
        const professionalId = getProfessionalId();
        if (professionalId && !isNaN(professionalId)) {
          const pricingResponse = await getSelectedServices({
            professional_id: professionalId,
            api_token: token || undefined
          });

          if (pricingResponse.status === true && pricingResponse.data && Array.isArray(pricingResponse.data)) {
            // Create a map of service_id -> pricing data for quick lookup
            const pricingMap = new Map<number, SelectedServiceItem>();
            pricingResponse.data.forEach((item) => {
              const serviceId = item.service_id ?? item.service?.id;
              if (serviceId && !isNaN(serviceId) && serviceId > 0) {
                pricingMap.set(serviceId, item);
              }
            });

            // Refresh the services state with updated pricing data
            const allServices = await fetchServices();
            const activeServices = allServices.filter(service => service.status === "ACTIVE");

            const updatedServices: ServicePrice[] = activeServices.map((service) => {
              const pricingData = pricingMap.get(service.id);
              
              let priceValue: string = "";
              
              if (pricingData) {
                const rawPrice = pricingData.price;
                if (rawPrice !== null && rawPrice !== undefined && rawPrice !== "") {
                  const priceStr = String(rawPrice).trim();
                  if (priceStr.length > 0 && priceStr !== "null" && priceStr !== "undefined" && !isNaN(parseFloat(priceStr))) {
                    priceValue = priceStr;
                  }
                }
              }
              
              const hasPricing = priceValue !== "" && parseInt(priceValue) > 0;
              
              let suggestedRange = "£100-300";
              if (service.price) {
                const basePrice = parseInt(service.price);
                if (!isNaN(basePrice) && basePrice > 0) {
                  const min = Math.max(50, basePrice - 50);
                  const max = basePrice + 100;
                  suggestedRange = `£${min}-${max}`;
                }
              }
              
              return {
                id: service.id,
                name: service.service_name,
                description: service.description || "",
                price: priceValue || "",
                suggested: suggestedRange,
                hasPricing: hasPricing
              };
            });

            startTransition(() => {
              setServices(updatedServices);
            });
          }
        }
      } else {
        toast.error(response.message || response.error || "Failed to save service prices. Please try again.");
      }
    } catch (error: any) {
      console.error("Error saving service prices:", error);
      const errorMessage = error?.message || error?.error || "An error occurred while saving service prices. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
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
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">Loading services and pricing...</p>
            </div>
          ) : loadingError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-600">{loadingError}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available</p>
            </div>
          ) : (
            services.map((service) => {
              const currentPrice = parseInt(service.price) || 0;
              const [minSuggested, maxSuggested] = service.suggested
                .replace(/£/g, "")
                .split("-")
                .map(s => parseInt(s.trim()));
              
              const isAboveSuggested = currentPrice > maxSuggested;
              const isBelowSuggested = currentPrice < minSuggested && currentPrice > 0;
              const isInRange = currentPrice >= minSuggested && currentPrice <= maxSuggested;

              return (
                <Card key={service.id} className={`border-0 shadow-md hover:shadow-lg transition-all ${service.hasPricing ? 'bg-green-50/30 border-green-200' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          {service.hasPricing && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
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
                            value={service.price || ""}
                            onChange={(e) => updatePrice(service.id, e.target.value)}
                            className="pl-7 text-lg h-12"
                          />
                        </div>
                      </div>
                      
                      {/* Price Indicator */}
                      <div className="w-full md:w-auto">
                        {service.hasPricing && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Pricing Set</span>
                          </div>
                        )}
                        {isInRange && currentPrice > 0 && !service.hasPricing && (
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
            })
          )}
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
