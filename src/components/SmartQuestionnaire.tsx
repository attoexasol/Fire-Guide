import React, { useState, useEffect, useMemo } from "react";
import { Flame, ChevronRight, Building2, Users, Layers, Calendar, FileText, ChevronLeft, Loader2, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { fetchPropertyTypes, PropertyTypeResponse, fetchApproximatePeople, ApproximatePeopleResponse, fetchFloorPricing, FloorPricingItem } from "../api/servicesService";
import { storeCustomQuoteRequest } from "../api/customQuoteRequestsService";
import { getApiToken, getUserFullName, getUserEmail, getUserPhone } from "../lib/auth";
import { toast } from "sonner";

interface SmartQuestionnaireProps {
  service: string;
  serviceId?: number;
  /** When provided, used to show Fire Alarm–specific steps (e.g. smoke/heat detectors) only for Fire Alarm service */
  serviceName?: string;
  onComplete: (formData: {
    property_type_id: number;
    approximate_people_id: number;
    number_of_floors: string;
    preferred_date: string;
    access_note: string;
    detector_count?: string;
    isCustomQuote?: boolean;
    request_data?: { building_type: string; people_count: string; floors: number; assessment_type: string; notes?: string; detectors?: string };
    service_id?: number;
  }) => void;
  onBack: () => void;
  /** Custom content rendered at the bottom, below the navigation buttons */
  bottomContent?: React.ReactNode;
}

export function SmartQuestionnaire({ service, serviceId, serviceName, onComplete, onBack, bottomContent }: SmartQuestionnaireProps) {
  const isFireAlarmService = (serviceName?.toLowerCase().includes("alarm") ?? false);
  const isFireRiskAssessmentService = ((serviceName?.toLowerCase().includes("risk") && serviceName?.toLowerCase().includes("assessment")) ?? false);
  const isFireExtinguisherService = (serviceName?.toLowerCase().includes("extinguisher") ?? false);
  const isEmergencyLightingService = (serviceName?.toLowerCase().includes("lighting") ?? false);
  const isFireSafetyConsultationService = (serviceName?.toLowerCase().includes("consultation") ?? false);
  const isFireMarshalTrainingService = ((serviceName?.toLowerCase().includes("marshal") || serviceName?.toLowerCase().includes("warden") || serviceName?.toLowerCase().includes("training")) ?? false);
  const totalSteps = isFireAlarmService ? 8 : isFireExtinguisherService ? 6 : isEmergencyLightingService ? 6 : isFireSafetyConsultationService ? 4 : isFireMarshalTrainingService ? 6 : isFireRiskAssessmentService ? 6 : 5;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyTypeId: "",
    customPropertyType: "",
    approximatePeopleId: "",
    customPeopleCount: "",
    detectorCount: "",
    customDetectorCount: "",
    manualCallPoints: "",
    customManualCallPoints: "",
    fireAlarmFloors: "",
    customFireAlarmFloors: "",
    fireAlarmPanels: "",
    customFireAlarmPanels: "",
    alarmSystemType: "",
    lastServiced: "",
    numberOfFloors: "",
    customFloorsCount: "",
    extinguisherCount: "",
    customExtinguisherCount: "",
    extinguisherFloors: "",
    customExtinguisherFloors: "",
    extinguisherTypesKnow: "",
    extinguisherTypesList: "",
    extinguisherLastServiced: "",
    emergencyLightsCount: "",
    customEmergencyLightsCount: "",
    emergencyLightsFloors: "",
    customEmergencyLightsFloors: "",
    emergencyLightingType: "",
    emergencyLightingTestFrequency: "",
    consultationType: "",
    consultationHours: "",
    customConsultationHours: "",
    trainingPeopleCount: "",
    customTrainingPeopleCount: "",
    trainingLocation: "",
    buildingTypeForTraining: "",
    staffTrainingBefore: "",
    fraAssessmentType: "",
    assessmentDate: "",
    accessNotes: ""
  });
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeResponse[]>([]);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState<boolean>(true);
  const [approximatePeople, setApproximatePeople] = useState<ApproximatePeopleResponse[]>([]);
  const [loadingApproximatePeople, setLoadingApproximatePeople] = useState<boolean>(true);
  const [floorPricing, setFloorPricing] = useState<FloorPricingItem[]>([]);
  const [loadingFloorPricing, setLoadingFloorPricing] = useState<boolean>(true);
  const [submittingCustomQuote, setSubmittingCustomQuote] = useState(false);

  const CUSTOM_PEOPLE_OPTION_VALUE = "More than 500 people";
  const isMoreThan500People = (value: string) =>
    /more than 500|500\+|501\+/i.test(value) || value.toLowerCase().includes("500");
  const showCustomPeopleInput = isMoreThan500People(formData.approximatePeopleId);
  const peopleCountDisplay = showCustomPeopleInput && formData.customPeopleCount.trim()
    ? formData.customPeopleCount.trim()
    : formData.approximatePeopleId;
  const floorOptions = useMemo(() => {
    const seen = new Set<string>();
    return floorPricing.filter((item) => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });
  }, [floorPricing]);
  const showCustomDetectorInput = formData.detectorCount === "100+";
  const detectorDisplay = showCustomDetectorInput && formData.customDetectorCount.trim()
    ? formData.customDetectorCount.trim()
    : formData.detectorCount;
  const showCustomManualCallPointsInput = formData.manualCallPoints === "20+";
  const manualCallPointsDisplay = showCustomManualCallPointsInput && formData.customManualCallPoints.trim()
    ? formData.customManualCallPoints.trim()
    : formData.manualCallPoints;
  const showCustomFireAlarmFloorsInput = formData.fireAlarmFloors === "7+";
  const fireAlarmFloorsDisplay = showCustomFireAlarmFloorsInput && formData.customFireAlarmFloors.trim()
    ? formData.customFireAlarmFloors.trim()
    : formData.fireAlarmFloors;
  const showCustomFireAlarmPanelsInput = formData.fireAlarmPanels === "3+";
  const fireAlarmPanelsDisplay = showCustomFireAlarmPanelsInput && formData.customFireAlarmPanels.trim()
    ? formData.customFireAlarmPanels.trim()
    : formData.fireAlarmPanels;
  const showCustomExtinguisherInput = formData.extinguisherCount === "40+";
  const extinguisherCountDisplay = showCustomExtinguisherInput && formData.customExtinguisherCount.trim()
    ? formData.customExtinguisherCount.trim()
    : formData.extinguisherCount;
  const showCustomExtinguisherFloorsInput = formData.extinguisherFloors === "7+";
  const extinguisherFloorsDisplay = showCustomExtinguisherFloorsInput && formData.customExtinguisherFloors.trim()
    ? formData.customExtinguisherFloors.trim()
    : formData.extinguisherFloors;
  const showCustomEmergencyLightsInput = formData.emergencyLightsCount === "100+";
  const emergencyLightsCountDisplay = showCustomEmergencyLightsInput && formData.customEmergencyLightsCount.trim()
    ? formData.customEmergencyLightsCount.trim()
    : formData.emergencyLightsCount;
  const showCustomEmergencyLightsFloorsInput = formData.emergencyLightsFloors === "7+";
  const emergencyLightsFloorsDisplay = showCustomEmergencyLightsFloorsInput && formData.customEmergencyLightsFloors.trim()
    ? formData.customEmergencyLightsFloors.trim()
    : formData.emergencyLightsFloors;
  const showCustomConsultationHoursInput = formData.consultationHours === "4+";
  const consultationHoursDisplay = showCustomConsultationHoursInput && formData.customConsultationHours.trim()
    ? formData.customConsultationHours.trim()
    : formData.consultationHours;
  const showCustomTrainingPeopleInput = formData.trainingPeopleCount === "40+";
  const trainingPeopleCountDisplay = showCustomTrainingPeopleInput && formData.customTrainingPeopleCount.trim()
    ? formData.customTrainingPeopleCount.trim()
    : formData.trainingPeopleCount;
  const showCustomFloorsInput = formData.numberOfFloors === "7+";
  const floorsDisplay = showCustomFloorsInput && formData.customFloorsCount.trim()
    ? formData.customFloorsCount.trim()
    : formData.numberOfFloors;

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

  useEffect(() => {
    const loadFloorPricing = async () => {
      try {
        setLoadingFloorPricing(true);
        const data = await fetchFloorPricing();
        setFloorPricing(data);
      } catch (err: any) {
        console.error("Error loading floor pricing:", err);
        setFloorPricing([]);
      } finally {
        setLoadingFloorPricing(false);
      }
    };
    loadFloorPricing();
  }, []);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const EXTINGUISHER_TYPES = ["Water", "Foam", "CO₂", "Powder", "Wet Chemical"];
  const toggleExtinguisherType = (type: string) => {
    const current = (formData.extinguisherTypesList || "").split(",").map((s) => s.trim()).filter(Boolean);
    const has = current.includes(type);
    const next = has ? current.filter((t) => t !== type) : [...current, type];
    setFormData({ ...formData, extinguisherTypesList: next.join(", ") });
  };

  const submitCustomQuoteNow = async () => {
    const resolvedServiceId = serviceId ?? (typeof service === "string" && /^\d+$/.test(service) ? parseInt(service, 10) : undefined);
    if (!resolvedServiceId) {
      toast.error("Service not available. Please go back and select a service.");
      return false;
    }
    const name = getUserFullName()?.trim();
    const email = getUserEmail()?.trim();
    const phone = getUserPhone()?.trim();
    if (!name || !email || !phone) {
      return false;
    }
    const isCustom = formData.propertyTypeId === "__custom__";
    const propertyTypeDisplay = isCustom ? formData.customPropertyType.trim() : formData.propertyTypeId;
    const floors = showCustomFloorsInput
      ? parseInt(formData.customFloorsCount, 10)
      : parseInt(formData.numberOfFloors, 10);
    setSubmittingCustomQuote(true);
    try {
      await storeCustomQuoteRequest(
        getApiToken(),
        resolvedServiceId,
        name,
        email,
        phone,
        {
          building_type: propertyTypeDisplay || "Not specified",
          people_count: peopleCountDisplay || formData.approximatePeopleId,
          floors: isNaN(floors) ? 0 : floors,
          assessment_type: "Standard",
          notes: formData.accessNotes.trim() || undefined,
          ...(isFireAlarmService && detectorDisplay && { detectors: detectorDisplay }),
        }
      );
      toast.success("Custom quote request submitted successfully. We'll contact you soon.");
      onBack();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit custom quote request.");
      return false;
    } finally {
      setSubmittingCustomQuote(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2 && isMoreThan500People(formData.approximatePeopleId)) {
      const submitted = await submitCustomQuoteNow();
      if (submitted) return;
    }
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

  const isCustomPropertyType = formData.propertyTypeId === "__custom__";

  const isStepValid = () => {
    if (isFireAlarmService) {
      switch (currentStep) {
        case 1: return formData.detectorCount === "100+" ? formData.customDetectorCount.trim() !== "" : formData.detectorCount !== "";
        case 2: return formData.manualCallPoints === "20+" ? formData.customManualCallPoints.trim() !== "" : formData.manualCallPoints !== "";
        case 3: return formData.fireAlarmFloors === "7+" ? formData.customFireAlarmFloors.trim() !== "" : formData.fireAlarmFloors !== "";
        case 4: return formData.fireAlarmPanels === "3+" ? formData.customFireAlarmPanels.trim() !== "" : formData.fireAlarmPanels !== "";
        case 5: return formData.alarmSystemType !== "";
        case 6: return true; // Last serviced optional
        case 7: return formData.assessmentDate !== "";
        case 8: return true; // Access notes optional
        default: return false;
      }
    }
    if (isFireExtinguisherService) {
      switch (currentStep) {
        case 1: return formData.extinguisherCount === "40+" ? formData.customExtinguisherCount.trim() !== "" : formData.extinguisherCount !== "";
        case 2: return formData.extinguisherFloors === "7+" ? formData.customExtinguisherFloors.trim() !== "" : formData.extinguisherFloors !== "";
        case 3: return formData.extinguisherTypesKnow !== "";
        case 4: return true; // Last serviced optional
        case 5: return formData.assessmentDate !== "";
        case 6: return true; // Access notes optional
        default: return false;
      }
    }
    if (isEmergencyLightingService) {
      switch (currentStep) {
        case 1: return formData.emergencyLightsCount === "100+" ? formData.customEmergencyLightsCount.trim() !== "" : formData.emergencyLightsCount !== "";
        case 2: return formData.emergencyLightsFloors === "7+" ? formData.customEmergencyLightsFloors.trim() !== "" : formData.emergencyLightsFloors !== "";
        case 3: return true; // Lighting type optional
        case 4: return true; // Test frequency optional
        case 5: return formData.assessmentDate !== "";
        case 6: return true; // Access notes optional
        default: return false;
      }
    }
    if (isFireSafetyConsultationService) {
      switch (currentStep) {
        case 1: return formData.consultationType !== "";
        case 2: return formData.consultationHours === "4+" ? formData.customConsultationHours.trim() !== "" : formData.consultationHours !== "";
        case 3: return formData.assessmentDate !== ""; // Calendar - same as Fire Alarm
        case 4: return true; // Access notes optional
        default: return false;
      }
    }
    if (isFireMarshalTrainingService) {
      switch (currentStep) {
        case 1: return formData.trainingPeopleCount === "40+" ? formData.customTrainingPeopleCount.trim() !== "" : formData.trainingPeopleCount !== "";
        case 2: return formData.trainingLocation !== "";
        case 3: return formData.buildingTypeForTraining !== "";
        case 4: return true; // Staff training before optional
        case 5: return formData.assessmentDate !== "";
        case 6: return true; // Access notes optional
        default: return false;
      }
    }
    if (isFireRiskAssessmentService) {
      switch (currentStep) {
        case 1: return formData.fraAssessmentType !== "";
        case 2: return formData.propertyTypeId === "__custom__" ? formData.customPropertyType.trim() !== "" : formData.propertyTypeId !== "";
        case 3: return formData.approximatePeopleId !== "";
        case 4: return formData.numberOfFloors === "7+" ? formData.customFloorsCount.trim() !== "" : formData.numberOfFloors !== "";
        case 5: return formData.assessmentDate !== "";
        case 6: return true; // Access notes optional
        default: return false;
      }
    }
    switch (currentStep) {
      case 1:
        if (formData.propertyTypeId === "__custom__") return formData.customPropertyType.trim() !== "";
        return formData.propertyTypeId !== "";
      case 2:
        return formData.approximatePeopleId !== "";
      case 3:
        if (formData.numberOfFloors === "7+") return formData.customFloorsCount.trim() !== "";
        return formData.numberOfFloors !== "";
      case 4:
        return formData.assessmentDate !== "";
      case 5:
        return true; // Access notes optional
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    let propertyTypeId: number;
    let approximatePeopleIdResolved: number;
    let propertyTypeDisplay: string;
    let peopleCountDisplayForComplete: string;

    if (isFireAlarmService || isFireExtinguisherService || isEmergencyLightingService || isFireSafetyConsultationService || isFireMarshalTrainingService) {
      propertyTypeId = propertyTypes[0]?.id ?? 0;
      approximatePeopleIdResolved = approximatePeople[0]?.id ?? 0;
      propertyTypeDisplay = "Not specified";
      peopleCountDisplayForComplete = "Not specified";
    } else {
      const isCustom = formData.propertyTypeId === "__custom__";
      propertyTypeDisplay = isCustom ? formData.customPropertyType.trim() : formData.propertyTypeId;
      const selectedPropertyType = isCustom
        ? null
        : propertyTypes.find(pt => pt.property_type_name === formData.propertyTypeId);
      const selectedApproximatePeople = approximatePeople.find(ap => ap.number_of_people === formData.approximatePeopleId);
      let resolved = selectedApproximatePeople?.id;
      if (resolved == null && isMoreThan500People(formData.approximatePeopleId)) {
        resolved = approximatePeople.find(ap => isMoreThan500People(ap.number_of_people))?.id
          ?? approximatePeople[approximatePeople.length - 1]?.id ?? 0;
      }
      if (resolved == null) return;
      approximatePeopleIdResolved = resolved;
      propertyTypeId = isCustom
        ? (propertyTypes.find(pt => /other|custom/i.test(pt.property_type_name))?.id ?? propertyTypes[0]?.id ?? 0)
        : (selectedPropertyType?.id ?? 0);
      peopleCountDisplayForComplete = peopleCountDisplay || formData.approximatePeopleId;
    }

    const resolvedServiceId = serviceId ?? (typeof service === "string" && /^\d+$/.test(service) ? parseInt(service, 10) : undefined);

    if (!isFireAlarmService && !isFireExtinguisherService && !isEmergencyLightingService && !isFireSafetyConsultationService && !isFireMarshalTrainingService && isMoreThan500People(formData.approximatePeopleId) && resolvedServiceId) {
      const name = getUserFullName()?.trim();
      const email = getUserEmail()?.trim();
      const phone = getUserPhone()?.trim();
      if (name && email && phone) {
        setSubmittingCustomQuote(true);
        try {
          const floors = showCustomFloorsInput
            ? parseInt(formData.customFloorsCount, 10)
            : parseInt(formData.numberOfFloors, 10);
          await storeCustomQuoteRequest(
            getApiToken(),
            resolvedServiceId,
            name,
            email,
            phone,
            {
              building_type: propertyTypeDisplay || "Not specified",
              people_count: peopleCountDisplayForComplete,
              floors: isNaN(floors) ? 0 : floors,
              assessment_type: "Standard",
              notes: formData.accessNotes.trim() || undefined,
              ...(isFireAlarmService && detectorDisplay && { detectors: detectorDisplay }),
              ...(isFireAlarmService && manualCallPointsDisplay && { manual_call_points: manualCallPointsDisplay }),
              ...(isFireAlarmService && fireAlarmFloorsDisplay && { fire_alarm_floors: fireAlarmFloorsDisplay }),
              ...(isFireAlarmService && fireAlarmPanelsDisplay && { fire_alarm_panels: fireAlarmPanelsDisplay }),
              ...(isFireAlarmService && formData.alarmSystemType && { alarm_system_type: formData.alarmSystemType }),
              ...(isFireAlarmService && formData.lastServiced && formData.lastServiced !== "__skip__" && { last_serviced: formData.lastServiced }),
              ...(isFireRiskAssessmentService && formData.fraAssessmentType && { fra_assessment_type: formData.fraAssessmentType }),
            }
          );
          toast.success("Custom quote request submitted successfully. We'll contact you soon.");
          onBack();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to submit custom quote request.");
        } finally {
          setSubmittingCustomQuote(false);
        }
        return;
      }
    }

    const parts: string[] = [];
    if (isFireRiskAssessmentService && formData.fraAssessmentType) parts.push(`Assessment type: ${formData.fraAssessmentType}`);
    if (!isFireAlarmService && !isFireExtinguisherService && !isEmergencyLightingService && !isFireSafetyConsultationService && !isFireMarshalTrainingService && formData.propertyTypeId) {
      const isCustom = formData.propertyTypeId === "__custom__";
      parts.push(`Property type: ${isCustom ? formData.customPropertyType.trim() : propertyTypeDisplay}`);
    }
    if (!isFireAlarmService && !isFireExtinguisherService && !isEmergencyLightingService && !isFireSafetyConsultationService && !isFireMarshalTrainingService && showCustomPeopleInput && formData.customPeopleCount.trim()) {
      parts.push(`People count: ${formData.customPeopleCount.trim()}`);
    }
    if (isFireAlarmService && fireAlarmFloorsDisplay) parts.push(`Floors: ${fireAlarmFloorsDisplay}`);
    else if (isFireExtinguisherService && extinguisherFloorsDisplay) parts.push(`Floors: ${extinguisherFloorsDisplay}`);
    else if (isEmergencyLightingService && emergencyLightsFloorsDisplay) parts.push(`Floors: ${emergencyLightsFloorsDisplay}`);
    if (isFireSafetyConsultationService && formData.consultationType) parts.push(`Consultation type: ${formData.consultationType}`);
    if (isFireSafetyConsultationService && consultationHoursDisplay) parts.push(`Hours needed: ${consultationHoursDisplay}`);
    if (isFireMarshalTrainingService && trainingPeopleCountDisplay) parts.push(`People for training: ${trainingPeopleCountDisplay}`);
    if (isFireMarshalTrainingService && formData.trainingLocation) parts.push(`Training location: ${formData.trainingLocation}`);
    if (isFireMarshalTrainingService && formData.buildingTypeForTraining) parts.push(`Building type: ${formData.buildingTypeForTraining}`);
    if (isFireMarshalTrainingService && formData.staffTrainingBefore && formData.staffTrainingBefore !== "__skip__") parts.push(`Staff training before: ${formData.staffTrainingBefore}`);
    if (!isFireMarshalTrainingService && showCustomFloorsInput && formData.customFloorsCount.trim()) {
      parts.push(`Floors: ${formData.customFloorsCount.trim()}`);
    } else if (formData.numberOfFloors) parts.push(`Floors: ${floorsDisplay}`);
    if (isFireAlarmService && detectorDisplay) parts.push(`Detectors: ${detectorDisplay}`);
    if (isFireAlarmService && manualCallPointsDisplay) parts.push(`Manual call points: ${manualCallPointsDisplay}`);
    if (isFireAlarmService && fireAlarmPanelsDisplay) parts.push(`Fire alarm panels: ${fireAlarmPanelsDisplay}`);
    if (isFireAlarmService && formData.alarmSystemType) parts.push(`Alarm system: ${formData.alarmSystemType}`);
    if (isFireAlarmService && formData.lastServiced && formData.lastServiced !== "__skip__") parts.push(`Last serviced: ${formData.lastServiced}`);
    if (isFireExtinguisherService && extinguisherCountDisplay) parts.push(`Fire extinguishers: ${extinguisherCountDisplay}`);
    if (isFireExtinguisherService && formData.extinguisherTypesKnow) parts.push(`Extinguisher types known: ${formData.extinguisherTypesKnow}`);
    if (isFireExtinguisherService && formData.extinguisherTypesList) parts.push(`Extinguisher types: ${formData.extinguisherTypesList}`);
    if (isFireExtinguisherService && formData.extinguisherLastServiced) parts.push(`Last serviced: ${formData.extinguisherLastServiced}`);
    if (isEmergencyLightingService && emergencyLightsCountDisplay) parts.push(`Emergency lights: ${emergencyLightsCountDisplay}`);
    if (isEmergencyLightingService && formData.emergencyLightingType && formData.emergencyLightingType !== "__skip__") parts.push(`Lighting type: ${formData.emergencyLightingType}`);
    if (isEmergencyLightingService && formData.emergencyLightingTestFrequency && formData.emergencyLightingTestFrequency !== "__skip__") parts.push(`Test frequency: ${formData.emergencyLightingTestFrequency}`);
    if (formData.accessNotes?.trim()) parts.push(formData.accessNotes.trim());
    const accessNote = parts.join(". ");

    const isCustomQuote = isFireAlarmService
      ? showCustomFireAlarmFloorsInput
      : isFireExtinguisherService
        ? showCustomExtinguisherInput || showCustomExtinguisherFloorsInput
        : isEmergencyLightingService
          ? showCustomEmergencyLightsInput || showCustomEmergencyLightsFloorsInput
          : isFireSafetyConsultationService
            ? showCustomConsultationHoursInput
            : isFireMarshalTrainingService
              ? showCustomTrainingPeopleInput
              : (formData.propertyTypeId === "__custom__" || isMoreThan500People(formData.approximatePeopleId) || showCustomFloorsInput);
    const floorsNum = isFireAlarmService
      ? (showCustomFireAlarmFloorsInput ? parseInt(formData.customFireAlarmFloors, 10) : parseInt(formData.fireAlarmFloors, 10))
      : isFireExtinguisherService
        ? (showCustomExtinguisherFloorsInput ? parseInt(formData.customExtinguisherFloors, 10) : parseInt(formData.extinguisherFloors, 10))
        : isEmergencyLightingService
          ? (showCustomEmergencyLightsFloorsInput ? parseInt(formData.customEmergencyLightsFloors, 10) : parseInt(formData.emergencyLightsFloors, 10))
          : isFireSafetyConsultationService
            ? 1
            : isFireMarshalTrainingService
              ? 1
              : (showCustomFloorsInput ? parseInt(formData.customFloorsCount, 10) : parseInt(formData.numberOfFloors, 10));
    const number_of_floors = isFireAlarmService
      ? (fireAlarmFloorsDisplay || formData.fireAlarmFloors)
      : isFireExtinguisherService
        ? (extinguisherFloorsDisplay || formData.extinguisherFloors)
        : isEmergencyLightingService
          ? (emergencyLightsFloorsDisplay || formData.emergencyLightsFloors)
          : isFireSafetyConsultationService
            ? "1"
            : isFireMarshalTrainingService
              ? "1"
              : (floorsDisplay || formData.numberOfFloors);

    onComplete({
      property_type_id: propertyTypeId,
      approximate_people_id: approximatePeopleIdResolved,
      number_of_floors,
      preferred_date: formData.assessmentDate,
      access_note: accessNote,
      ...(isFireAlarmService && detectorDisplay && { detector_count: detectorDisplay }),
      ...(isFireExtinguisherService && extinguisherCountDisplay && { extinguisher_count: extinguisherCountDisplay }),
      ...(isEmergencyLightingService && emergencyLightsCountDisplay && { emergency_lights_count: emergencyLightsCountDisplay }),
      ...(isFireSafetyConsultationService && formData.consultationType && { consultation_type: formData.consultationType }),
      ...(isFireSafetyConsultationService && consultationHoursDisplay && { consultation_hours: consultationHoursDisplay }),
      ...(isFireMarshalTrainingService && trainingPeopleCountDisplay && { training_people_count: trainingPeopleCountDisplay }),
      ...(isFireMarshalTrainingService && formData.trainingLocation && { training_location: formData.trainingLocation }),
      ...(isFireMarshalTrainingService && formData.buildingTypeForTraining && { building_type: formData.buildingTypeForTraining }),
      ...(isFireMarshalTrainingService && formData.staffTrainingBefore && formData.staffTrainingBefore !== "__skip__" && { staff_training_before: formData.staffTrainingBefore }),
      ...(isFireRiskAssessmentService && formData.fraAssessmentType && { fra_assessment_type: formData.fraAssessmentType }),
      ...(isCustomQuote && {
        isCustomQuote: true,
        service_id: resolvedServiceId,
        request_data: {
          building_type: propertyTypeDisplay || "Not specified",
          people_count: peopleCountDisplayForComplete,
          floors: isNaN(floorsNum) ? 0 : floorsNum,
          assessment_type: "Standard",
          notes: formData.accessNotes.trim() || undefined,
          ...(isFireAlarmService && detectorDisplay && { detectors: detectorDisplay }),
          ...(isFireAlarmService && manualCallPointsDisplay && { manual_call_points: manualCallPointsDisplay }),
          ...(isFireAlarmService && fireAlarmFloorsDisplay && { fire_alarm_floors: fireAlarmFloorsDisplay }),
          ...(isFireAlarmService && fireAlarmPanelsDisplay && { fire_alarm_panels: fireAlarmPanelsDisplay }),
          ...(isFireAlarmService && formData.alarmSystemType && { alarm_system_type: formData.alarmSystemType }),
          ...(isFireAlarmService && formData.lastServiced && formData.lastServiced !== "__skip__" && { last_serviced: formData.lastServiced }),
          ...(isFireExtinguisherService && extinguisherCountDisplay && { extinguisher_count: extinguisherCountDisplay }),
          ...(isFireExtinguisherService && extinguisherFloorsDisplay && { extinguisher_floors: extinguisherFloorsDisplay }),
          ...(isFireExtinguisherService && formData.extinguisherTypesKnow && { extinguisher_types_known: formData.extinguisherTypesKnow }),
          ...(isFireExtinguisherService && formData.extinguisherTypesList && { extinguisher_types: formData.extinguisherTypesList }),
          ...(isFireExtinguisherService && formData.extinguisherLastServiced && { extinguisher_last_serviced: formData.extinguisherLastServiced }),
          ...(isEmergencyLightingService && emergencyLightsCountDisplay && { emergency_lights_count: emergencyLightsCountDisplay }),
          ...(isEmergencyLightingService && emergencyLightsFloorsDisplay && { emergency_lights_floors: emergencyLightsFloorsDisplay }),
          ...(isEmergencyLightingService && formData.emergencyLightingType && formData.emergencyLightingType !== "__skip__" && { emergency_lighting_type: formData.emergencyLightingType }),
          ...(isEmergencyLightingService && formData.emergencyLightingTestFrequency && formData.emergencyLightingTestFrequency !== "__skip__" && { emergency_lighting_test_frequency: formData.emergencyLightingTestFrequency }),
          ...(isFireSafetyConsultationService && formData.consultationType && { consultation_type: formData.consultationType }),
          ...(isFireSafetyConsultationService && consultationHoursDisplay && { consultation_hours: consultationHoursDisplay }),
          ...(isFireMarshalTrainingService && trainingPeopleCountDisplay && { training_people_count: trainingPeopleCountDisplay }),
          ...(isFireMarshalTrainingService && formData.trainingLocation && { training_location: formData.trainingLocation }),
          ...(isFireMarshalTrainingService && formData.buildingTypeForTraining && { building_type: formData.buildingTypeForTraining }),
          ...(isFireMarshalTrainingService && formData.staffTrainingBefore && formData.staffTrainingBefore !== "__skip__" && { staff_training_before: formData.staffTrainingBefore }),
          ...(isFireRiskAssessmentService && formData.fraAssessmentType && { fra_assessment_type: formData.fraAssessmentType }),
        },
      }),
    });
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
            {/* Step 1: Assessment type (Fire Risk Assessment) - Non-Intrusive vs Intrusive */}
            {currentStep === 1 && isFireRiskAssessmentService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Choose your Fire Risk Assessment type</h2>
                </div>
                <p className="text-gray-600 mb-4">The customer must pick one:</p>
                <div className="space-y-4">
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-red-200 ${
                      formData.fraAssessmentType === "Non-Intrusive Fire Risk Assessment" ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}
                    onClick={() => updateFormData("fraAssessmentType", "Non-Intrusive Fire Risk Assessment")}
                  >
                    <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Non-Intrusive Fire Risk Assessment</p>
                      <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                        <li>Visual inspection only</li>
                        <li>No opening walls, ceilings, or floors</li>
                      </ul>
                    </div>
                  </label>
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-red-200 ${
                      formData.fraAssessmentType === "Intrusive Fire Risk Assessment" ? "border-red-500 bg-red-50" : "border-gray-200"
                    }`}
                    onClick={() => updateFormData("fraAssessmentType", "Intrusive Fire Risk Assessment")}
                  >
                    <span className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Intrusive Fire Risk Assessment</p>
                      <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                        <li>More detailed</li>
                        <li>Includes opening up and sampling</li>
                      </ul>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 1: Property Type (generic flow only), Step 2 for Fire Risk Assessment */}
            {((currentStep === 1 && !isFireAlarmService && !isFireExtinguisherService && !isEmergencyLightingService && !isFireSafetyConsultationService && !isFireMarshalTrainingService && !isFireRiskAssessmentService) || (currentStep === 2 && isFireRiskAssessmentService)) && (
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
                          <>
                            {propertyTypes.map((propertyType) => (
                              <SelectItem key={propertyType.id} value={propertyType.property_type_name}>
                                {propertyType.property_type_name}
                              </SelectItem>
                            ))}
                            <SelectItem value="__custom__">More</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {isCustomPropertyType && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customPropertyType">Enter your property type</Label>
                      <Input
                        id="customPropertyType"
                        placeholder="e.g. Warehouse, Mixed-use, Educational"
                        value={formData.customPropertyType}
                        onChange={(e) => updateFormData("customPropertyType", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Number of People (generic flow only), Step 3 for Fire Risk Assessment */}
            {((currentStep === 2 && !isFireAlarmService && !isFireExtinguisherService && !isEmergencyLightingService && !isFireSafetyConsultationService && !isFireMarshalTrainingService && !isFireRiskAssessmentService) || (currentStep === 3 && isFireRiskAssessmentService)) && (
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
                        ) : null}
                        {approximatePeople.map((option) => (
                          <SelectItem key={option.id} value={option.number_of_people}>
                            {option.number_of_people}
                          </SelectItem>
                        ))}
                        <SelectItem value={CUSTOM_PEOPLE_OPTION_VALUE}>
                          {CUSTOM_PEOPLE_OPTION_VALUE}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {showCustomPeopleInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customPeopleCount">Enter number of people</Label>
                      <Input
                        id="customPeopleCount"
                        type="text"
                        placeholder="e.g. 600, 750, 1000"
                        value={formData.customPeopleCount}
                        onChange={(e) => updateFormData("customPeopleCount", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the approximate number of people using the building (optional)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Consultation type (Fire Safety Consultation) */}
            {currentStep === 1 && isFireSafetyConsultationService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 1: How would you like the consultation?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationType">Choose consultation type</Label>
                  <p className="text-sm text-gray-500 mb-2">This decides <strong>which</strong> hourly rate is used.</p>
                  <Select
                    value={formData.consultationType}
                    onValueChange={(value) => updateFormData("consultationType", value)}
                  >
                    <SelectTrigger id="consultationType" className="w-full">
                      <SelectValue placeholder="Choose consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone / Video call">Phone / Video call</SelectItem>
                      <SelectItem value="On-site visit">On-site visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Consultation hours (Fire Safety Consultation) */}
            {currentStep === 2 && isFireSafetyConsultationService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 2: How many hours do you need?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationHours">Choose hours</Label>
                  <Select
                    value={formData.consultationHours}
                    onValueChange={(value) => updateFormData("consultationHours", value)}
                  >
                    <SelectTrigger id="consultationHours" className="w-full">
                      <SelectValue placeholder="Choose hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="4+">More than 4 hours → Custom Quote</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomConsultationHoursInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customConsultationHours">Enter number of hours</Label>
                      <Input
                        id="customConsultationHours"
                        type="text"
                        placeholder="e.g. 5, 6, 8"
                        value={formData.customConsultationHours}
                        onChange={(e) => updateFormData("customConsultationHours", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of hours for more than 4 (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: How many people need training? (Fire Marshal / Warden Training) */}
            {currentStep === 1 && isFireMarshalTrainingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 1: How many people need training?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingPeopleCount">Select number of people</Label>
                  <Select
                    value={formData.trainingPeopleCount}
                    onValueChange={(value) => updateFormData("trainingPeopleCount", value)}
                  >
                    <SelectTrigger id="trainingPeopleCount" className="w-full">
                      <SelectValue placeholder="Choose number of people" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="11-20">11-20 people</SelectItem>
                      <SelectItem value="21-40">21-40 people</SelectItem>
                      <SelectItem value="40+">More than 40 → Custom Quote</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomTrainingPeopleInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customTrainingPeopleCount">Enter number of people</Label>
                      <Input
                        id="customTrainingPeopleCount"
                        type="text"
                        placeholder="e.g. 50, 60, 80"
                        value={formData.customTrainingPeopleCount}
                        onChange={(e) => updateFormData("customTrainingPeopleCount", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of people for more than 40 (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Where will the training take place? (Fire Marshal / Warden Training) */}
            {currentStep === 2 && isFireMarshalTrainingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 2: Where will the training take place?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingLocation">Select location</Label>
                  <Select
                    value={formData.trainingLocation}
                    onValueChange={(value) => updateFormData("trainingLocation", value)}
                  >
                    <SelectTrigger id="trainingLocation" className="w-full">
                      <SelectValue placeholder="Choose location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="At our premises (on-site)">At our premises (on-site)</SelectItem>
                      <SelectItem value="Online (video call)">Online (video call)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: What type of building? (Fire Marshal / Warden Training) */}
            {currentStep === 3 && isFireMarshalTrainingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 3: What type of building is this for?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingTypeForTraining">Select building type</Label>
                  <Select
                    value={formData.buildingTypeForTraining}
                    onValueChange={(value) => updateFormData("buildingTypeForTraining", value)}
                  >
                    <SelectTrigger id="buildingTypeForTraining" className="w-full">
                      <SelectValue placeholder="Choose building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Shop / Retail">Shop / Retail</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                      <SelectItem value="Care Home">Care Home</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Factory / Industrial">Factory / Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Have staff had fire training before? (Fire Marshal / Warden Training - optional) */}
            {currentStep === 4 && isFireMarshalTrainingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 4 (OPTIONAL BUT REALISTIC): Have staff had fire training before?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffTrainingBefore">Select option</Label>
                  <Select
                    value={formData.staffTrainingBefore}
                    onValueChange={(value) => updateFormData("staffTrainingBefore", value)}
                  >
                    <SelectTrigger id="staffTrainingBefore" className="w-full">
                      <SelectValue placeholder="Choose (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__skip__">Skip (optional)</SelectItem>
                      <SelectItem value="Yes (refresher training)">Yes (refresher training)</SelectItem>
                      <SelectItem value="No (first time)">No (first time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 1: Emergency lights (Emergency Lighting) */}
            {currentStep === 1 && isEmergencyLightingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 1: How many emergency lights?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyLightsCount">Select number of lights</Label>
                  <Select
                    value={formData.emergencyLightsCount}
                    onValueChange={(value) => updateFormData("emergencyLightsCount", value)}
                  >
                    <SelectTrigger id="emergencyLightsCount" className="w-full">
                      <SelectValue placeholder="Choose number of lights" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 lights</SelectItem>
                      <SelectItem value="11-25">11-25 lights</SelectItem>
                      <SelectItem value="26-50">26-50 lights</SelectItem>
                      <SelectItem value="51-100">51-100 lights</SelectItem>
                      <SelectItem value="100+">More than 100 (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomEmergencyLightsInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customEmergencyLightsCount">Enter number of lights</Label>
                      <Input
                        id="customEmergencyLightsCount"
                        type="text"
                        placeholder="e.g. 120, 150"
                        value={formData.customEmergencyLightsCount}
                        onChange={(e) => updateFormData("customEmergencyLightsCount", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of lights for more than 100 (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Emergency Lighting floors */}
            {currentStep === 2 && isEmergencyLightingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Layers className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 2: How many floors does the building have?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyLightsFloors">Select number of floors</Label>
                  <Select
                    value={formData.emergencyLightsFloors}
                    onValueChange={(value) => updateFormData("emergencyLightsFloors", value)}
                  >
                    <SelectTrigger id="emergencyLightsFloors" className="w-full">
                      <SelectValue placeholder="Choose number of floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 floor</SelectItem>
                      <SelectItem value="2-3">2-3 floors</SelectItem>
                      <SelectItem value="4-6">4-6 floors</SelectItem>
                      <SelectItem value="7+">7+ floors (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomEmergencyLightsFloorsInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customEmergencyLightsFloors">Enter number of floors</Label>
                      <Input
                        id="customEmergencyLightsFloors"
                        type="text"
                        placeholder="e.g. 10, 12, 15"
                        value={formData.customEmergencyLightsFloors}
                        onChange={(e) => updateFormData("customEmergencyLightsFloors", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of floors for 7+ (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Type of emergency lighting (optional – Emergency Lighting) */}
            {currentStep === 3 && isEmergencyLightingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 3 (OPTIONAL BUT USEFUL): What type of emergency lighting is it?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyLightingType">Select type</Label>
                  <Select
                    value={formData.emergencyLightingType}
                    onValueChange={(value) => updateFormData("emergencyLightingType", value)}
                  >
                    <SelectTrigger id="emergencyLightingType" className="w-full">
                      <SelectValue placeholder="Choose (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__skip__">Skip (optional)</SelectItem>
                      <SelectItem value="Self-contained lights">Self-contained lights</SelectItem>
                      <SelectItem value="Central battery system">Central battery system</SelectItem>
                      <SelectItem value="Not sure">Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Central battery systems take longer. Self-contained → +£0, Central battery → +£100.</p>
                </div>
              </div>
            )}

            {/* Step 4: Test frequency (optional – Emergency Lighting) */}
            {currentStep === 4 && isEmergencyLightingService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 4 (OPTIONAL): Is this a monthly, 6-monthly, or annual test?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyLightingTestFrequency">Select test frequency</Label>
                  <Select
                    value={formData.emergencyLightingTestFrequency}
                    onValueChange={(value) => updateFormData("emergencyLightingTestFrequency", value)}
                  >
                    <SelectTrigger id="emergencyLightingTestFrequency" className="w-full">
                      <SelectValue placeholder="Choose (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__skip__">Skip (optional)</SelectItem>
                      <SelectItem value="Monthly flick test">Monthly flick test</SelectItem>
                      <SelectItem value="6-monthly">6-monthly</SelectItem>
                      <SelectItem value="Annual (3-hour) test">Annual (3-hour) test</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Annual (3-hour) tests take much longer. Monthly → +£0, 6-monthly → +£40, Annual → +£120.</p>
                </div>
              </div>
            )}

            {/* Step 1: Fire extinguishers (Fire Extinguisher) */}
            {currentStep === 1 && isFireExtinguisherService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 1: How many fire extinguishers?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extinguisherCount">Select number of extinguishers</Label>
                  <Select
                    value={formData.extinguisherCount}
                    onValueChange={(value) => updateFormData("extinguisherCount", value)}
                  >
                    <SelectTrigger id="extinguisherCount" className="w-full">
                      <SelectValue placeholder="Choose number of extinguishers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 extinguishers</SelectItem>
                      <SelectItem value="6-10">6-10 extinguishers</SelectItem>
                      <SelectItem value="11-20">11-20 extinguishers</SelectItem>
                      <SelectItem value="21-40">21-40 extinguishers</SelectItem>
                      <SelectItem value="40+">More than 40 (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomExtinguisherInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customExtinguisherCount">Enter number of extinguishers</Label>
                      <Input
                        id="customExtinguisherCount"
                        type="text"
                        placeholder="e.g. 50, 60"
                        value={formData.customExtinguisherCount}
                        onChange={(e) => updateFormData("customExtinguisherCount", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of extinguishers for more than 40 (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Fire Extinguisher floors */}
            {currentStep === 2 && isFireExtinguisherService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Layers className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 2: How many floors does the building have?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extinguisherFloors">Select number of floors</Label>
                  <Select
                    value={formData.extinguisherFloors}
                    onValueChange={(value) => updateFormData("extinguisherFloors", value)}
                  >
                    <SelectTrigger id="extinguisherFloors" className="w-full">
                      <SelectValue placeholder="Choose number of floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 floor</SelectItem>
                      <SelectItem value="2-3">2-3 floors</SelectItem>
                      <SelectItem value="4-6">4-6 floors</SelectItem>
                      <SelectItem value="7+">7+ floors (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomExtinguisherFloorsInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customExtinguisherFloors">Enter number of floors</Label>
                      <Input
                        id="customExtinguisherFloors"
                        type="text"
                        placeholder="e.g. 10, 12, 15"
                        value={formData.customExtinguisherFloors}
                        onChange={(e) => updateFormData("customExtinguisherFloors", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of floors for 7+ (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Do you know the types of extinguishers? */}
            {currentStep === 3 && isFireExtinguisherService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 3: Do you know the types of extinguishers?</h2>
                </div>
                <div className="space-y-2">
                  <Label>Select option</Label>
                  <Select
                    value={formData.extinguisherTypesKnow}
                    onValueChange={(value) => updateFormData("extinguisherTypesKnow", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Yes or No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.extinguisherTypesKnow === "Yes" && (
                    <div className="mt-4 space-y-2">
                      <Label>Select types (if known)</Label>
                      <div className="flex flex-wrap gap-4 pt-2">
                        {EXTINGUISHER_TYPES.map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={formData.extinguisherTypesList.split(",").map((t) => t.trim()).includes(type)}
                              onCheckedChange={() => toggleExtinguisherType(type)}
                            />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Standard mix → +£0. Many CO₂ or Wet Chemical → +£40</p>
                    </div>
                  )}
                  {formData.extinguisherTypesKnow === "No" && (
                    <p className="text-sm text-gray-500">If No, we assume standard mix → +£0</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Fire Extinguisher last serviced (optional) */}
            {currentStep === 4 && isFireExtinguisherService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 4 (OPTIONAL): When were they last serviced?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extinguisherLastServiced">Select when last serviced</Label>
                  <Select
                    value={formData.extinguisherLastServiced}
                    onValueChange={(value) => updateFormData("extinguisherLastServiced", value)}
                  >
                    <SelectTrigger id="extinguisherLastServiced" className="w-full">
                      <SelectValue placeholder="Choose (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__skip__">Skip (optional)</SelectItem>
                      <SelectItem value="Within last 12 months">Within last 12 months</SelectItem>
                      <SelectItem value="Over 12 months">Over 12 months</SelectItem>
                      <SelectItem value="Never / Not sure">Never / Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Old or missed services take longer.</p>
                </div>
              </div>
            )}

            {/* Step 1: Smoke/heat detectors (Fire Alarm) */}
            {currentStep === 1 && isFireAlarmService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 1: How many smoke/heat detectors?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detectorCount">Select number of detectors</Label>
                  <Select
                    value={formData.detectorCount}
                    onValueChange={(value) => updateFormData("detectorCount", value)}
                  >
                    <SelectTrigger id="detectorCount" className="w-full">
                      <SelectValue placeholder="Choose number of detectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 detectors</SelectItem>
                      <SelectItem value="11-25">11-25 detectors</SelectItem>
                      <SelectItem value="26-50">26-50 detectors</SelectItem>
                      <SelectItem value="51-100">51-100 detectors</SelectItem>
                      <SelectItem value="100+">More than 100 (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomDetectorInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customDetectorCount">Enter number of detectors</Label>
                      <Input
                        id="customDetectorCount"
                        type="text"
                        placeholder="e.g. 150, 200"
                        value={formData.customDetectorCount}
                        onChange={(e) => updateFormData("customDetectorCount", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of detectors for more than 100 (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Manual call points (Fire Alarm) */}
            {currentStep === 2 && isFireAlarmService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 2: How many manual call points?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manualCallPoints">Select number of call points</Label>
                  <Select
                    value={formData.manualCallPoints}
                    onValueChange={(value) => updateFormData("manualCallPoints", value)}
                  >
                    <SelectTrigger id="manualCallPoints" className="w-full">
                      <SelectValue placeholder="Choose number of call points" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 call points</SelectItem>
                      <SelectItem value="6-10">6-10 call points</SelectItem>
                      <SelectItem value="11-20">11-20 call points</SelectItem>
                      <SelectItem value="20+">More than 20 (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomManualCallPointsInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customManualCallPoints">Enter number of call points</Label>
                      <Input
                        id="customManualCallPoints"
                        type="text"
                        placeholder="e.g. 25, 30"
                        value={formData.customManualCallPoints}
                        onChange={(e) => updateFormData("customManualCallPoints", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of call points for more than 20 (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Number of Floors (generic flow only), Step 4 for Fire Risk Assessment */}
            {((currentStep === 3 && !isFireAlarmService && !isFireExtinguisherService && !isEmergencyLightingService && !isFireSafetyConsultationService && !isFireMarshalTrainingService && !isFireRiskAssessmentService) || (currentStep === 4 && isFireRiskAssessmentService)) && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Layers className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">How many floors does the building have?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfFloors">Select approximate number</Label>
                  {loadingFloorPricing ? (
                    <div className="w-full p-3 border rounded-md bg-gray-50 text-gray-500 text-center">
                      Loading options...
                    </div>
                  ) : (
                    <Select
                      value={formData.numberOfFloors}
                      onValueChange={(value) => updateFormData("numberOfFloors", value)}
                    >
                      <SelectTrigger id="numberOfFloors" className="w-full">
                        <span>
                          {formData.numberOfFloors
                            ? floorOptions.find((o) => o.floor === formData.numberOfFloors)?.label ?? formData.numberOfFloors
                            : "Choose number of floors"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {floorOptions.length === 0 ? (
                          <SelectItem value="no-data">No options available</SelectItem>
                        ) : (
                          floorOptions.map((option) => (
                            <SelectItem key={option.floor} value={option.floor}>
                              {option.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {showCustomFloorsInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customFloorsCount">Enter number of floors</Label>
                      <Input
                        id="customFloorsCount"
                        type="text"
                        placeholder="e.g. 10, 12, 15"
                        value={formData.customFloorsCount}
                        onChange={(e) => updateFormData("customFloorsCount", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of floors for buildings with 7+ floors</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Include all levels, basements, and ground floor</p>
                </div>
              </div>
            )}

            {/* Step 3: Fire Alarm floors (Fire Alarm) */}
            {currentStep === 3 && isFireAlarmService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Layers className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 3: How many floors does the building have?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireAlarmFloors">Select number of floors</Label>
                  <Select
                    value={formData.fireAlarmFloors}
                    onValueChange={(value) => updateFormData("fireAlarmFloors", value)}
                  >
                    <SelectTrigger id="fireAlarmFloors" className="w-full">
                      <SelectValue placeholder="Choose number of floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 floor</SelectItem>
                      <SelectItem value="2-3">2-3 floors</SelectItem>
                      <SelectItem value="4-6">4-6 floors</SelectItem>
                      <SelectItem value="7+">7+ floors (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomFireAlarmFloorsInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customFireAlarmFloors">Enter number of floors</Label>
                      <Input
                        id="customFireAlarmFloors"
                        type="text"
                        placeholder="e.g. 10, 12, 15"
                        value={formData.customFireAlarmFloors}
                        onChange={(e) => updateFormData("customFireAlarmFloors", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of floors for buildings with 7+ floors (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Fire alarm panels (Fire Alarm) */}
            {currentStep === 4 && isFireAlarmService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 4: How many fire alarm panels?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireAlarmPanels">Select number of panels</Label>
                  <Select
                    value={formData.fireAlarmPanels}
                    onValueChange={(value) => updateFormData("fireAlarmPanels", value)}
                  >
                    <SelectTrigger id="fireAlarmPanels" className="w-full">
                      <SelectValue placeholder="Choose number of panels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 panel</SelectItem>
                      <SelectItem value="2">2 panels</SelectItem>
                      <SelectItem value="3+">3+ panels (Custom Quote)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomFireAlarmPanelsInput && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="customFireAlarmPanels">Enter number of panels</Label>
                      <Input
                        id="customFireAlarmPanels"
                        type="text"
                        placeholder="e.g. 4, 5"
                        value={formData.customFireAlarmPanels}
                        onChange={(e) => updateFormData("customFireAlarmPanels", e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">Enter the number of panels for 3+ (Custom Quote)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Alarm system type (Fire Alarm) */}
            {currentStep === 5 && isFireAlarmService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 5: What type of alarm system is it?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alarmSystemType">Select type</Label>
                  <Select
                    value={formData.alarmSystemType}
                    onValueChange={(value) => updateFormData("alarmSystemType", value)}
                  >
                    <SelectTrigger id="alarmSystemType" className="w-full">
                      <SelectValue placeholder="Choose alarm system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conventional">Conventional</SelectItem>
                      <SelectItem value="Addressable">Addressable</SelectItem>
                      <SelectItem value="Not sure">Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 6: Last serviced (optional – Fire Alarm) */}
            {currentStep === 6 && isFireAlarmService && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[#0A1A2F]">Question 6 (OPTIONAL BUT RECOMMENDED): When was it last serviced?</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastServiced">Select when last serviced</Label>
                  <Select
                    value={formData.lastServiced}
                    onValueChange={(value) => updateFormData("lastServiced", value)}
                  >
                    <SelectTrigger id="lastServiced" className="w-full">
                      <SelectValue placeholder="Choose (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__skip__">Skip (optional)</SelectItem>
                      <SelectItem value="Within last 6 months">Within last 6 months</SelectItem>
                      <SelectItem value="Over 12 months">Over 12 months</SelectItem>
                      <SelectItem value="Never / Not sure">Never / Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 7: Assessment Date (Fire Alarm), Step 5 (Fire Extinguisher / Emergency Lighting / Fire Marshal), Step 5 (Fire Risk Assessment), Step 3 (Consultation), Step 4 (generic) */}
            {currentStep === (isFireAlarmService ? 7 : isFireExtinguisherService || isEmergencyLightingService || isFireMarshalTrainingService ? 5 : isFireRiskAssessmentService ? 5 : isFireSafetyConsultationService ? 3 : 4) && (
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

            {/* Step 8: Access Notes (Fire Alarm), Step 6 (Fire Extinguisher / Emergency Lighting / Fire Marshal / Fire Risk Assessment), Step 4 (Consultation), Step 5 (generic) */}
            {currentStep === (isFireAlarmService ? 8 : isFireExtinguisherService || isEmergencyLightingService || isFireMarshalTrainingService || isFireRiskAssessmentService ? 6 : isFireSafetyConsultationService ? 4 : 5) && (
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
          <div className="flex justify-end gap-4">
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
              disabled={!isStepValid() || submittingCustomQuote}
              className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingCustomQuote ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {currentStep === totalSteps ? "View Results" : "Next"}
                  {currentStep < totalSteps && <ChevronRight className="w-5 h-5 ml-2" />}
                </>
              )}
            </Button>
          </div>

          {bottomContent && (
            <div className="mt-8">
              {bottomContent}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}