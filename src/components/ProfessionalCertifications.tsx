import { useState } from "react";
import { Award, CheckCircle2, Clock, XCircle, Eye, Upload, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function ProfessionalCertifications() {
  const [certifications] = useState([
    {
      id: 1,
      name: "Fire Risk Assessment Level 4",
      status: "verified" as "verified" | "pending" | "rejected",
      evidenceFile: "fire_risk_level4_cert.pdf",
      fileCount: 1,
      uploadDate: "Oct 15, 2024",
      verifiedDate: "Oct 18, 2024"
    },
    {
      id: 2,
      name: "NEBOSH Fire Safety Certificate",
      status: "verified" as "verified" | "pending" | "rejected",
      evidenceFile: "nebosh_cert.pdf",
      fileCount: 1,
      uploadDate: "Oct 10, 2024",
      verifiedDate: "Oct 12, 2024"
    },
    {
      id: 3,
      name: "BAFE Approved Contractor",
      status: "pending" as "verified" | "pending" | "rejected",
      evidenceFile: "bafe_approval.pdf",
      fileCount: 2,
      uploadDate: "Oct 20, 2024",
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl text-[#0A1A2F] mb-2">My Certifications</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Manage and track your professional certifications and qualifications
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Certifications</CardTitle>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No certifications added yet</p>
              <p className="text-sm">Add your first certification to get started</p>
            </div>
          ) : (
            certifications.map((cert) => (
              <div
                key={cert.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{cert.name}</h4>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Evidence: <span className="text-gray-700">{cert.evidenceFile}</span> ({cert.fileCount} file)
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Uploaded: {cert.uploadDate}
                      {cert.verifiedDate && ` • Verified: ${cert.verifiedDate}`}
                    </p>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    {cert.status === 'verified' && (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {cert.status === 'pending' && (
                      <Badge className="bg-amber-500 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending verification
                      </Badge>
                    )}
                    {cert.status === 'rejected' && (
                      <Badge className="bg-red-600 text-white">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
