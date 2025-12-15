import { useState } from "react";
import { Flame, ChevronRight, MapPin, ArrowLeft, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LocationPageProps {
  onContinue: () => void;
  onBack: () => void;
}

export function LocationPage({ onContinue, onBack }: LocationPageProps) {
  const [postcode, setPostcode] = useState("");
  const [selectedRadius, setSelectedRadius] = useState("10mi");

  const radiusOptions = [
    { value: "5mi", label: "5 miles" },
    { value: "10mi", label: "10 miles" },
    { value: "15mi", label: "15 miles" },
    { value: "25mi", label: "25 miles" },
    { value: "entire", label: "Entire region" }
  ];

  const isValid = postcode.trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0A1A2F] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Flame className="w-8 h-8 text-red-500" />
          <span className="text-xl">Fire Guide</span>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-6 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="#" className="hover:text-red-600 transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="#" className="hover:text-red-600 transition-colors">Select Service</a>
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

              {/* Find Button */}
              <Button
                disabled={!isValid}
                className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onContinue}
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