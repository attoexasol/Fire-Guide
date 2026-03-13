import React, { useState } from "react";
import { Flame, ChevronRight, MapPin, ArrowLeft, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useApp } from "../contexts/AppContext";
import { filterProfessionalForFra, filterProfessionalForAlarm, filterProfessionalForExtinguisher, filterProfessionalForEmergencyLight, filterProfessionalForMarshal, filterProfessionalForConsultation } from "../api/servicesService";
// selected_services/store is called only when "Book Now" is clicked on Compare Professionals page (with professional_id)

interface LocationPageProps {
  serviceId: number;
  questionnaireData: {
    property_type_id: number;
    approximate_people_id: number;
    number_of_floors: string;
    number_of_floors_id?: number;
    duration_id?: number;
    preferred_date: string;
    access_note: string;
  } | null;
  onContinue: () => void;
  onBack: () => void;
  /** Called when store succeeds, with the created selected_service id and location data (for store call on Book Now with professional_id) */
  onStoreSuccess?: (selectedServiceId: number, locationData: { post_code: string; search_radius: string; service_id: number }) => void;
}

export function LocationPage({ serviceId, questionnaireData, onContinue, onBack, onStoreSuccess }: LocationPageProps) {
  const { setFilteredProfessionalsFromFra } = useApp();
  const [postcode, setPostcode] = useState("");
  const [selectedRadius, setSelectedRadius] = useState("10mi");
  const [error, setError] = useState<string | null>(null);

  const radiusOptions = [
    { value: "5mi", label: "5 miles" },
    { value: "10mi", label: "10 miles" },
    { value: "15mi", label: "15 miles" },
    { value: "25mi", label: "25 miles" },
    { value: "entire", label: "Entire region" }
  ];

  const isValid = postcode.trim().length > 0;

  // Convert radius from "5mi" format to "5km" format
  const convertRadiusToKm = (radius: string): string => {
    if (radius === "entire") {
      return "entire";
    }
    // Extract number and convert miles to km (1 mile ≈ 1.609 km, but we'll use the number as-is for km)
    const match = radius.match(/(\d+)/);
    if (match) {
      const miles = parseInt(match[1]);
      // Convert to km (round to nearest)
      const km = Math.round(miles * 1.609);
      return `${km}km`;
    }
    return "10km"; // Default
  };

  const handleFindProfessionals = async () => {
    if (!isValid || !questionnaireData) {
      return;
    }
    setError(null);
    const searchRadius = convertRadiusToKm(selectedRadius);
    const locationData = {
      post_code: postcode.trim(),
      search_radius: searchRadius,
      service_id: serviceId,
    };
    const q = questionnaireData as {
      is_fire_alarm?: boolean;
      fire_alarm_smoke_detector_id?: number;
      fire_alarm_call_point_id?: number;
      fire_alarm_floor_id?: number;
      fire_alarm_panel_id?: number;
      fire_alarm_system_type_id?: number;
      fire_alarm_last_service_id?: number;
      is_fire_extinguisher?: boolean;
      extinguisher_id?: number;
      floor_id?: number;
      type_id?: number;
      last_service_id?: number;
      emergency_light_id?: number;
      emergency_floor_id?: number;
      emergency_light_type_id?: number;
      emergency_light_test_id?: number;
      people_id?: number;
      place_id?: number;
      building_type_id?: number;
      experience_id?: number;
      mode_id?: number;
      hour_id?: number;
      property_type_id?: number;
      approximate_people_id?: number;
      number_of_floors?: string;
      number_of_floors_id?: number;
      duration_id?: number;
    };
    // Same payload as selected-service/create — sent only when Find Professional is clicked (not on Book).
    try {
      if (q.is_fire_alarm) {
        const alarmPayload = {
          service_id: serviceId,
          smoke_detector_id: q.fire_alarm_smoke_detector_id ?? 0,
          call_point_id: q.fire_alarm_call_point_id ?? 0,
          floor_id: q.fire_alarm_floor_id ?? 0,
          panel_id: q.fire_alarm_panel_id ?? 0,
          system_type_id: q.fire_alarm_system_type_id ?? 0,
          last_service_id: q.fire_alarm_last_service_id ?? 0,
        };
        const res = await filterProfessionalForAlarm(alarmPayload);
        setFilteredProfessionalsFromFra(res.data ?? null);
      } else if (q.is_fire_extinguisher) {
        const extinguisherPayload = {
          service_id: serviceId,
          extinguisher_id: q.extinguisher_id ?? 0,
          floor_id: q.floor_id ?? 0,
          type_id: q.type_id ?? 0,
          last_service_id: q.last_service_id ?? 0,
        };
        const res = await filterProfessionalForExtinguisher(extinguisherPayload);
        setFilteredProfessionalsFromFra(res.data ?? null);
      } else if (
        serviceId === 39 ||
        q.emergency_light_id != null ||
        q.emergency_floor_id != null ||
        q.emergency_light_type_id != null ||
        q.emergency_light_test_id != null
      ) {
        const emergencyLightPayload = {
          service_id: serviceId,
          light_id: q.emergency_light_id ?? 1,
          floor_id: q.emergency_floor_id ?? 1,
          light_type_id: q.emergency_light_type_id ?? 0,
          light_test_id: q.emergency_light_test_id ?? 0,
        };
        const res = await filterProfessionalForEmergencyLight(emergencyLightPayload);
        setFilteredProfessionalsFromFra(res.data ?? null);
      } else if (
        serviceId === 45 ||
        q.people_id != null ||
        q.place_id != null ||
        q.building_type_id != null ||
        q.experience_id != null
      ) {
        const marshalReq = (questionnaireData as { request_data?: { people_id?: number; place_id?: number; building_type_id?: number; experience_id?: number } })?.request_data;
        const marshalPayload = {
          service_id: serviceId,
          people_id: q.people_id ?? marshalReq?.people_id ?? 1,
          place_id: q.place_id ?? marshalReq?.place_id ?? 1,
          building_type_id: q.building_type_id ?? marshalReq?.building_type_id ?? 1,
          experience_id: q.experience_id ?? marshalReq?.experience_id ?? 1,
        };
        const res = await filterProfessionalForMarshal(marshalPayload);
        setFilteredProfessionalsFromFra(res.data ?? null);
      } else if (
        serviceId === 46 ||
        q.mode_id != null ||
        q.hour_id != null ||
        (questionnaireData as { consultation_type?: string })?.consultation_type != null
      ) {
        const consultReq = (questionnaireData as { request_data?: { mode_id?: number; hour_id?: number } })?.request_data;
        const consultationPayload = {
          service_id: serviceId,
          mode_id: q.mode_id ?? consultReq?.mode_id ?? 1,
          hour_id: q.hour_id ?? consultReq?.hour_id ?? 1,
        };
        const res = await filterProfessionalForConsultation(consultationPayload);
        setFilteredProfessionalsFromFra(res.data ?? null);
      } else {
        const filterPayload = {
          service_id: serviceId,
          property_type_id: questionnaireData.property_type_id,
          approximate_people_id: questionnaireData.approximate_people_id,
          duration_id: questionnaireData.duration_id ?? 2,
          number_of_floors:
            questionnaireData.number_of_floors_id ??
            (parseInt(questionnaireData.number_of_floors, 10) || 0),
        };
        const res = await filterProfessionalForFra(filterPayload);
        setFilteredProfessionalsFromFra(res.data ?? null);
      }
    } catch (e) {
      console.error("Filter professionals failed:", e);
      setFilteredProfessionalsFromFra(null);
    }
    if (onStoreSuccess) {
      onStoreSuccess(0, locationData);
      // Page saves location data and navigates to Compare Professionals; store API is called on Book Now only
    } else {
      onContinue();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0A1A2F] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity" aria-label="Go to home">
            <Flame className="w-8 h-8 text-red-500" />
            <span className="text-xl">Fire Guide</span>
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-6 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-red-600 transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/services" className="hover:text-red-600 transition-colors">Select Service</a>
            <ChevronRight className="w-4 h-4" />
            <a href="#" className="hover:text-red-600 transition-colors">Details</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Location</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-[#0A1A2F]">
                Where do you need the service?
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Enter your postcode to find qualified professionals near you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Inputs */}
            <div className="space-y-8">
              {/* Postcode Input */}
              <div className="space-y-3">
                <Label htmlFor="postcode" className="text-base">Your postcode</Label>
                <div className="relative">
                  <Input
                    id="postcode"
                    type="text"
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    className="text-lg pr-12"
                  />
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Radius Selection */}
              <div className="space-y-3">
                <Label className="text-base">Search radius</Label>
                <div className="flex flex-wrap gap-3">
                  {radiusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedRadius(option.value)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${
                        selectedRadius === option.value
                          ? "bg-red-600 border-red-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:border-red-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedRadius === "entire" 
                    ? "We'll search across the entire region" 
                    : `We'll search within ${radiusOptions.find(o => o.value === selectedRadius)?.label} of your postcode`
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Find Button */}
              <Button
                type="button"
                disabled={!isValid || !questionnaireData}
                className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleFindProfessionals}
              >
                <Search className="w-5 h-5 mr-2" />
                Find Professionals
              </Button>
            </div>

            {/* Right Column - Map Preview */}
            <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 h-[450px] flex items-center justify-center relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-gray-300"></div>
                    ))}
                  </div>
                </div>
                
                {/* Center marker */}
                {postcode && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      {/* Radius circle */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600 opacity-10 rounded-full animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600 opacity-20 rounded-full"></div>
                      
                      {/* Pin */}
                      <div className="relative bg-red-600 text-white p-3 rounded-full shadow-lg">
                        <MapPin className="w-6 h-6" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {!postcode && (
                <div className="relative z-10 text-center p-6">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Enter a postcode to preview location</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Don't know your postcode?</span> You can enter your town or city name and we'll help you find it.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}