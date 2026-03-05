import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { getApiToken } from "../../lib/auth";
import { ComparisonResults } from "../ComparisonResults";
import { calculatePriceForBooking } from "../../api/bookingService";
import { storeSelectedService, createFireAlarmSelectedService, createFireExtinguisherSelectedService, createEmergencyLightSelectedService, createFireMarshalSelectedService, createFireConsultationSelectedService } from "../../api/servicesService";
import { toast } from "sonner";

const BOOKING_PROFESSIONAL_KEY = 'fireguide_booking_professional';
const BOOKING_PROFESSIONAL_ID_KEY = 'fireguide_booking_professional_id';
const SELECTED_PROFESSIONAL_KEY = 'fireguide_selected_professional';
const SELECTED_PROFESSIONAL_ID_KEY = 'fireguide_selected_professional_id';

const QUESTIONNAIRE_STORAGE_KEY = 'fireguide_questionnaire_data';

function getIsCustomQuote() {
  try {
    const stored = sessionStorage.getItem(QUESTIONNAIRE_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return Boolean(data?.isCustomQuote);
    }
  } catch (_) {}
  return false;
}

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { setSelectedProfessional, setBookingProfessional, setSelectedProfessionalId, selectedService, questionnaireData, locationSearchData } = useApp();
  const isCustomQuote = Boolean(questionnaireData?.isCustomQuote) || getIsCustomQuote();

  return (
    <ComparisonResults
      onViewProfile={(professional) => {
        // Update context state
        setSelectedProfessional(professional);
        
        // Persist to sessionStorage for browser reload
        try {
          sessionStorage.setItem(SELECTED_PROFESSIONAL_KEY, JSON.stringify(professional));
          sessionStorage.setItem(SELECTED_PROFESSIONAL_ID_KEY, professional.id.toString());
        } catch (error) {
          console.error('Failed to save selected professional to sessionStorage:', error);
        }
        
        // Navigate with state for immediate access
        startTransition(() => {
          navigate(`/professionals/${professional.id}`, { state: { professional, professionalId: professional.id } });
        });
      }}
      onBookNow={async (professional) => {
        setBookingProfessional(professional);
        setSelectedProfessionalId(professional.id);
        try {
          sessionStorage.setItem(BOOKING_PROFESSIONAL_KEY, JSON.stringify(professional));
          sessionStorage.setItem(BOOKING_PROFESSIONAL_ID_KEY, professional.id.toString());
        } catch (error) {
          console.error('Failed to save professional to sessionStorage:', error);
        }

        // 1) Call store API only when Book Now is clicked (with selected professional's ID). Use Fire Alarm endpoint for Fire Alarm service, else selected_services/store.
        let sessionId: number | string | undefined;
        const serviceId = locationSearchData?.service_id;
        const serviceIdNum = Number(serviceId);
        const isFireAlarm = Boolean((questionnaireData as { is_fire_alarm?: boolean })?.is_fire_alarm);
        const isFireExtinguisher = Boolean((questionnaireData as { is_fire_extinguisher?: boolean })?.is_fire_extinguisher);
        const isEmergencyLighting = serviceIdNum === 39 || Boolean((questionnaireData as { emergency_light_id?: number })?.emergency_light_id != null || (questionnaireData as { emergency_lights_count?: string })?.emergency_lights_count);
        const isFireMarshal = serviceIdNum === 45 || Boolean((questionnaireData as { people_id?: number })?.people_id != null || (questionnaireData as { training_people_count?: string })?.training_people_count);
        const isFireConsultation = serviceIdNum === 46 || Boolean((questionnaireData as { mode_id?: number })?.mode_id != null || (questionnaireData as { consultation_type?: string })?.consultation_type);
        const q = questionnaireData as {
          property_type_id?: number;
          approximate_people_id?: number;
          number_of_floors?: string;
          number_of_floors_id?: number;
          duration_id?: number;
          preferred_date?: string;
          access_note?: string;
          fire_alarm_smoke_detector_id?: number;
          fire_alarm_call_point_id?: number;
          fire_alarm_floor_id?: number;
          fire_alarm_panel_id?: number;
          fire_alarm_system_type_id?: number;
          fire_alarm_last_service_id?: number;
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
        } | null;
        if (questionnaireData && locationSearchData && serviceId != null) {
          try {
            const apiToken = getApiToken();
            if (isFireAlarm) {
              const alarmRes = await createFireAlarmSelectedService({
                ...(apiToken && { api_token: apiToken }),
                professional_id: professional.id,
                service_id: serviceIdNum,
                smoke_detector_id: q?.fire_alarm_smoke_detector_id ?? 0,
                call_point_id: q?.fire_alarm_call_point_id ?? 0,
                floor_id: q?.fire_alarm_floor_id ?? 0,
                panel_id: q?.fire_alarm_panel_id ?? 0,
                system_type_id: q?.fire_alarm_system_type_id ?? 0,
                last_service_id: q?.fire_alarm_last_service_id ?? 0,
                access_note: questionnaireData.access_note ?? "",
                post_code: locationSearchData.post_code,
                search_radius: locationSearchData.search_radius,
              });
              const data = alarmRes?.data;
              const rawSession = data?.session_id ?? data?.id;
              if (rawSession != null && rawSession !== '') {
                const num = typeof rawSession === 'string' ? parseInt(rawSession, 10) : rawSession;
                sessionId = Number.isNaN(num) ? rawSession : num;
              }
            } else if (isFireExtinguisher) {
              const extRes = await createFireExtinguisherSelectedService({
                ...(apiToken && { api_token: apiToken }),
                professional_id: professional.id,
                service_id: serviceIdNum,
                extinguisher_id: q?.extinguisher_id ?? 0,
                floor_id: q?.floor_id ?? 0,
                type_id: q?.type_id ?? 0,
                last_service_id: q?.last_service_id ?? 0,
                access_note: questionnaireData.access_note ?? "",
                post_code: locationSearchData.post_code,
                search_radius: locationSearchData.search_radius,
                preffered_date: questionnaireData.preferred_date ?? "",
              });
              const data = extRes?.data;
              const rawSession = data?.session_id ?? data?.id;
              if (rawSession != null && rawSession !== '') {
                const num = typeof rawSession === 'string' ? parseInt(rawSession, 10) : rawSession;
                sessionId = Number.isNaN(num) ? rawSession : num;
              }
            } else if (isEmergencyLighting) {
              const req = (questionnaireData as { request_data?: { emergency_light_type_id?: number; emergency_light_test_id?: number } })?.request_data;
              const lightTypeIdRaw = q?.emergency_light_type_id ?? req?.emergency_light_type_id;
              const lightTestIdRaw = q?.emergency_light_test_id ?? req?.emergency_light_test_id;
              const lightTypeId = lightTypeIdRaw != null ? Number(lightTypeIdRaw) : 0;
              const lightTestId = lightTestIdRaw != null ? Number(lightTestIdRaw) : 0;
              const elRes = await createEmergencyLightSelectedService({
                ...(apiToken && { api_token: apiToken }),
                professional_id: professional.id,
                service_id: serviceIdNum,
                light_id: q?.emergency_light_id != null ? Number(q.emergency_light_id) : 1,
                floor_id: q?.emergency_floor_id != null ? Number(q.emergency_floor_id) : 1,
                light_type_id: lightTypeId,
                light_test_id: lightTestId,
                access_note: questionnaireData.access_note ?? "",
                post_code: locationSearchData.post_code,
                search_radius: locationSearchData.search_radius,
                preffered_date: questionnaireData.preferred_date ?? "",
              });
              const data = elRes?.data;
              const rawSession = data?.session_id ?? data?.id;
              if (rawSession != null && rawSession !== '') {
                const num = typeof rawSession === 'string' ? parseInt(rawSession, 10) : rawSession;
                sessionId = Number.isNaN(num) ? rawSession : num;
              }
            } else if (isFireMarshal) {
              const marshalReq = (questionnaireData as { request_data?: { people_id?: number; place_id?: number; building_type_id?: number; experience_id?: number } })?.request_data;
              const peopleId = q?.people_id ?? marshalReq?.people_id;
              const placeId = q?.place_id ?? marshalReq?.place_id;
              const buildingTypeId = q?.building_type_id ?? marshalReq?.building_type_id;
              const experienceId = q?.experience_id ?? marshalReq?.experience_id;
              const marshalRes = await createFireMarshalSelectedService({
                ...(apiToken && { api_token: apiToken }),
                professional_id: professional.id,
                service_id: serviceIdNum,
                people_id: peopleId != null ? Number(peopleId) : 1,
                place_id: placeId != null ? Number(placeId) : 1,
                building_type_id: buildingTypeId != null ? Number(buildingTypeId) : 1,
                experience_id: experienceId != null ? Number(experienceId) : 1,
                access_note: questionnaireData.access_note ?? "",
                post_code: locationSearchData.post_code,
                search_radius: locationSearchData.search_radius,
                preffered_date: questionnaireData.preferred_date ?? "",
              });
              const data = marshalRes?.data;
              const rawSession = data?.session_id ?? data?.id;
              if (rawSession != null && rawSession !== '') {
                const num = typeof rawSession === 'string' ? parseInt(rawSession, 10) : rawSession;
                sessionId = Number.isNaN(num) ? rawSession : num;
              }
            } else if (isFireConsultation) {
              const consultReq = (questionnaireData as { request_data?: { mode_id?: number; hour_id?: number } })?.request_data;
              const modeId = q?.mode_id ?? consultReq?.mode_id;
              const hourId = q?.hour_id ?? consultReq?.hour_id;
              const consultRes = await createFireConsultationSelectedService({
                ...(apiToken && { api_token: apiToken }),
                professional_id: professional.id,
                service_id: serviceIdNum,
                mode_id: modeId != null ? Number(modeId) : 1,
                hour_id: hourId != null ? Number(hourId) : 1,
                access_note: questionnaireData.access_note ?? "",
                post_code: locationSearchData.post_code,
                search_radius: locationSearchData.search_radius,
                preffered_date: questionnaireData.preferred_date ?? "",
              });
              const data = consultRes?.data;
              const rawSession = data?.session_id ?? data?.id;
              if (rawSession != null && rawSession !== '') {
                const num = typeof rawSession === 'string' ? parseInt(rawSession, 10) : rawSession;
                sessionId = Number.isNaN(num) ? rawSession : num;
              }
            } else {
              const floorId = questionnaireData.number_of_floors_id;
              const number_of_floors = floorId != null ? String(floorId) : (questionnaireData.number_of_floors ?? "");
              const storeRes = await storeSelectedService({
                ...(apiToken && { api_token: apiToken }),
                service_id: serviceIdNum,
                property_type_id: questionnaireData.property_type_id,
                approximate_people_id: questionnaireData.approximate_people_id,
                number_of_floors,
                ...(floorId != null && { number_of_floors_id: floorId }),
                ...(questionnaireData.duration_id != null && { duration_id: questionnaireData.duration_id }),
                preferred_date: questionnaireData.preferred_date,
                access_note: questionnaireData.access_note,
                post_code: locationSearchData.post_code,
                search_radius: locationSearchData.search_radius,
                professional_id: professional.id,
              });
              const data = storeRes?.data;
              const rawSession =
                data?.session_id ??
                data?.id ??
                (typeof data === 'object' && data !== null && (data as any).selected_service?.session_id) ??
                (typeof data === 'object' && data !== null && (data as any).selected_service?.id);
              if (rawSession != null && rawSession !== '') {
                const num = typeof rawSession === 'string' ? parseInt(rawSession, 10) : rawSession;
                sessionId = Number.isNaN(num) ? rawSession : num;
              }
            }
          } catch (err: any) {
            console.error(isFireAlarm ? 'Failed to create fire alarm selected service' : isFireExtinguisher ? 'Failed to create fire extinguisher selected service' : isEmergencyLighting ? 'Failed to create emergency light selected service' : 'Failed to store selected service with professional:', err);
            toast.error(err?.message || 'Could not complete. Please try again.');
          }
        }

        // 2) Fetch price for booking with { professional_id, session_id, service_id }
        let bookingPricing: { servicePrice: number; platformFee: number; total: number } | undefined;
        let bookingPricingError: string | undefined;
        if (serviceId != null && sessionId != null) {
          try {
            const res = await calculatePriceForBooking({
              professional_id: professional.id,
              session_id: sessionId,
              service_id: serviceId,
            });
            if (res?.status && res?.data) {
              bookingPricing = {
                servicePrice: res.data.service_price,
                platformFee: res.data.platform_fee_amount,
                total: res.data.total_price,
              };
            } else if (res?.status === false && res?.message) {
              bookingPricingError = res.message;
            }
          } catch (err: any) {
            bookingPricingError = err?.message || err?.error || "Unable to load price. Please try again.";
          }
        } else if (serviceId == null) {
          bookingPricingError = "Service not selected. Please start from the service search.";
        } else {
          bookingPricingError = "Could not create booking session. Please try again.";
        }

        startTransition(() => {
          navigate("/booking", {
            state: {
              professional,
              professionalId: professional.id,
              // Don't pass price for custom quote so booking flow shows "Wait for admin" and doesn't go to payment
              ...(bookingPricing && !isCustomQuote && { bookingPricing }),
              ...(bookingPricingError && { bookingPricingError }),
            },
          });
        });
      }}
      onBack={() => {
        startTransition(() => {
          navigate(`/services/${selectedService}/location`);
        });
      }}
    />
  );
}

