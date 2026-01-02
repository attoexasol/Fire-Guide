import { useState, useEffect } from "react";
import { Flame, ChevronRight, Building2, Users, Layers, Calendar, FileText, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { fetchPropertyTypes, PropertyTypeResponse, fetchApproximatePeople, ApproximatePeopleResponse } from "../api/servicesService";

interface SmartQuestionnaireProps {
  service: string;
  onComplete: (formData: {
    property_type_id: number;
    approximate_people_id: number;
    number_of_floors: string;
    preferred_date: string;
    access_note: string;
  }) => void;
  onBack: () => void;
}

export function SmartQuestionnaire({ service, onComplete, onBack }: SmartQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyTypeId: "",
    approximatePeopleId: "",
    numberOfFloors: "",
    assessmentDate: "",
    accessNotes: ""
  });
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeResponse[]>([]);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState<boolean>(true);
  const [approximatePeople, setApproximatePeople] = useState<ApproximatePeopleResponse[]>([]);
  const [loadingApproximatePeople, setLoadingApproximatePeople] = useState<boolean>(true);

  const totalSteps = 5;

  useEffect(() => {
    const loadPropertyTypes = async () => {
      try {
        setLoadingPropertyTypes(true);
        const data = await fetchPropertyTypes();
        setPropertyTypes(data);
      } catch (err: any) {
        console.error("Error loading property types:", err);
        // Continue with empty array if fetch fails
        setPropertyTypes([]);
      } finally {
        setLoadingPropertyTypes(false);
      }
    };

    loadPropertyTypes();
  }, []);

  useEffect(() => {
    const loadApproximatePeople = async () => {
      try {
        setLoadingApproximatePeople(true);
        const data = await fetchApproximatePeople();
        // Sort by ID in ascending order (1, 2, 3, ...)
        const sortedData = data.sort((a, b) => a.id - b.id);
        setApproximatePeople(sortedData);
      } catch (err: any) {
        console.error("Error loading approximate people:", err);
        // Continue with empty array if fetch fails
        setApproximatePeople([]);
      } finally {
        setLoadingApproximatePeople(false);
      }
    };

    loadApproximatePeople();
  }, []);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyTypeId !== "";
      case 2:
        return formData.approximatePeopleId !== "";
      case 3:
        return formData.numberOfFloors !== "";
      case 4:
        return formData.assessmentDate !== "";
      case 5:
        return true; // Access notes are optional
      default:
        return false;
    }
  };

  const handleComplete = () => {
    // Find the property type ID from the selected name
    const selectedPropertyType = propertyTypes.find(pt => pt.property_type_name === formData.propertyTypeId);
    // Find the approximate people ID from the selected value
    const selectedApproximatePeople = approximatePeople.find(ap => ap.number_of_people === formData.approximatePeopleId);
    
    if (selectedPropertyType && selectedApproximatePeople) {
      onComplete({
        property_type_id: selectedPropertyType.id,
        approximate_people_id: selectedApproximatePeople.id,
        number_of_floors: formData.numberOfFloors,
        preferred_date: formData.assessmentDate,
        access_note: formData.accessNotes || ""
      });
    }
  };

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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-red-600 transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="#" className="hover:text-red-600 transition-colors">Select Service</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Details</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Container */}
          <div className="bg-white border rounded-lg p-8 mb-8 min-h-[400px]">
            {/* Step 1: Property Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">What type of property is it?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Select property type</Label>
                  {loadingPropertyTypes ? (
                    <div className="w-full p-3 border rounded-md bg-gray-50 text-gray-500 text-center">
                      Loading property types...
                    </div>
                  ) : (
                    <Select
                      value={formData.propertyTypeId}
                      onValueChange={(value) => updateFormData("propertyTypeId", value)}
                    >
                      <SelectTrigger id="propertyType" className="w-full">
                        <SelectValue placeholder="Choose property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.length === 0 ? (
                          <SelectItem value="no-data">No property types available</SelectItem>
                        ) : (
                          propertyTypes.map((propertyType) => (
                            <SelectItem key={propertyType.id} value={propertyType.property_type_name}>
                              {propertyType.property_type_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Number of People */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">How many people use the building?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfPeople">Select approximate number</Label>
                  {loadingApproximatePeople ? (
                    <div className="w-full p-3 border rounded-md bg-gray-50 text-gray-500 text-center">
                      Loading options...
                    </div>
                  ) : (
                    <Select
                      value={formData.approximatePeopleId}
                      onValueChange={(value) => updateFormData("approximatePeopleId", value)}
                    >
                      <SelectTrigger id="numberOfPeople" className="w-full">
                        <SelectValue placeholder="Choose number of people" />
                      </SelectTrigger>
                      <SelectContent>
                        {approximatePeople.length === 0 ? (
                          <SelectItem value="no-data">No options available</SelectItem>
                        ) : (
                          approximatePeople.map((option) => (
                            <SelectItem key={option.id} value={option.number_of_people}>
                              {option.number_of_people}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Number of Floors */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Layers className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">How many floors does the building have?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfFloors">Enter number of floors</Label>
                  <Input
                    id="numberOfFloors"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 3"
                    value={formData.numberOfFloors}
                    onChange={(e) => updateFormData("numberOfFloors", e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500">Include all levels, basements, and ground floor</p>
                </div>
              </div>
            )}

            {/* Step 4: Assessment Date */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">When do you need the assessment?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessmentDate">Select preferred date</Label>
                  <Input
                    id="assessmentDate"
                    type="date"
                    value={formData.assessmentDate}
                    onChange={(e) => updateFormData("assessmentDate", e.target.value)}
                    className="text-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-sm text-gray-500">We'll show you available professionals for this date</p>
                </div>
              </div>
            )}

            {/* Step 5: Access Notes */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Any access notes or special requirements?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessNotes">Optional notes for the assessor</Label>
                  <Textarea
                    id="accessNotes"
                    placeholder="e.g., Gate code required, parking available, building under construction..."
                    value={formData.accessNotes}
                    onChange={(e) => updateFormData("accessNotes", e.target.value)}
                    className="min-h-[150px] text-base"
                  />
                  <p className="text-sm text-gray-500">This helps the professional prepare for the visit (optional)</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="outline"
              className="px-8 py-6 text-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === totalSteps ? "View Results" : "Next"}
              {currentStep < totalSteps && <ChevronRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}