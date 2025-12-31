import { useState, useEffect } from "react";
import { Award, CheckCircle2, Calendar, Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { fetchQualifications, QualificationCertificationResponse } from "../api/qualificationsService";
import { toast } from "sonner";

export function ProfessionalCertifications() {
  const [certifications, setCertifications] = useState<QualificationCertificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQualifications();
        setCertifications(data);
      } catch (error: any) {
        console.error('Failed to load certifications:', error);
        toast.error(error.message || 'Failed to load certifications');
      } finally {
        setIsLoading(false);
      }
    };

    loadCertifications();
  }, []);

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl text-[#0A1A2F] mb-2">My Certifications</h1>
          <p className="text-gray-600 text-sm md:text-base">
            View and manage your professional certifications and qualifications
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          Add Now
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              <span className="ml-3 text-gray-600">Loading certifications...</span>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No certifications found</p>
              <p className="text-sm">Your certifications will appear here once they are added</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Award className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">{cert.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>Certified: {formatDate(cert.certification_date)}</span>
                            </div>
                            {cert.professional && (
                              <div className="text-gray-500">
                                Professional: {cert.professional.name}
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Added: {formatDate(cert.created_at)}
                            {cert.updated_at !== cert.created_at && (
                              <span> • Updated: {formatDate(cert.updated_at)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
