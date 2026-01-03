import React, { useState } from "react";
import { Shield, CheckCircle, AlertCircle, Upload, FileText, Award, X, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

export function ProfessionalVerification() {
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const verificationStatus = {
    overall: "verified",
    completionPercentage: 100
  };

  const requirements = [
    {
      id: "identity",
      title: "Identity Verification",
      description: "Government-issued ID verified",
      status: "verified",
      verifiedDate: "Oct 15, 2024",
      icon: Shield
    },
    {
      id: "qualifications",
      title: "Professional Qualifications",
      description: "Fire Safety Diploma, NEBOSH Certificate",
      status: "verified",
      verifiedDate: "Oct 16, 2024",
      icon: Award,
      documents: [
        { name: "Fire Safety Diploma.pdf", uploadedOn: "Oct 16, 2024" },
        { name: "NEBOSH Certificate.pdf", uploadedOn: "Oct 16, 2024" },
      ]
    },
    {
      id: "insurance",
      title: "Insurance Coverage",
      description: "Public Liability & Professional Indemnity",
      status: "verified",
      verifiedDate: "Oct 17, 2024",
      icon: Shield,
      details: {
        publicLiability: "£5M",
        professionalIndemnity: "£2M",
        provider: "AXA Insurance",
        validUntil: "Dec 2025"
      }
    },
    {
      id: "dbs",
      title: "DBS Check",
      description: "Enhanced DBS clearance",
      status: "verified",
      verifiedDate: "Oct 18, 2024",
      icon: ShieldCheck
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-700">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Needs Update</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Not Submitted</Badge>;
    }
  };

  const handleFileUpload = (requirementId: string) => {
    setUploadingDoc(requirementId);
    // Simulate upload
    setTimeout(() => {
      setUploadingDoc(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Verification Status</h1>
        <p className="text-gray-600">Your professional verification and credentials</p>
      </div>

      {/* Overall Status */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Fully Verified Professional</h2>
                <p className="text-green-100">All verification requirements completed</p>
              </div>
            </div>
            <Badge className="bg-white text-green-600 text-lg px-4 py-2">
              <CheckCircle className="w-5 h-5 mr-2" />
              Active
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-100">Verification Progress</span>
              <span className="font-semibold">{verificationStatus.completionPercentage}%</span>
            </div>
            <Progress value={verificationStatus.completionPercentage} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Benefits of Verification */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-2">Benefits of Being Verified</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>✓ Appear higher in search results</li>
                <li>✓ Display "Verified Professional" badge on your profile</li>
                <li>✓ Gain customer trust and increase bookings</li>
                <li>✓ Access to premium features and support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Requirements */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#0A1A2F]">Verification Requirements</h2>
        
        {requirements.map((requirement) => (
          <Card key={requirement.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <requirement.icon className="w-6 h-6 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg text-[#0A1A2F]">{requirement.title}</h3>
                        {getStatusBadge(requirement.status)}
                      </div>
                      <p className="text-sm text-gray-600">{requirement.description}</p>
                    </div>
                    {getStatusIcon(requirement.status)}
                  </div>

                  {requirement.status === "verified" && (
                    <div className="mt-3">
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Verified on {requirement.verifiedDate}
                      </p>
                    </div>
                  )}

                  {requirement.documents && (
                    <div className="mt-4">
                      <Separator className="mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</p>
                      <div className="space-y-2">
                        {requirement.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">Uploaded {doc.uploadedOn}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {requirement.details && (
                    <div className="mt-4">
                      <Separator className="mb-3" />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Public Liability</p>
                          <p className="text-sm font-medium text-gray-900">{requirement.details.publicLiability}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Professional Indemnity</p>
                          <p className="text-sm font-medium text-gray-900">{requirement.details.professionalIndemnity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Provider</p>
                          <p className="text-sm font-medium text-gray-900">{requirement.details.provider}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valid Until</p>
                          <p className="text-sm font-medium text-gray-900">{requirement.details.validUntil}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {requirement.status === "verified" && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload(requirement.id)}
                        disabled={uploadingDoc === requirement.id}
                      >
                        {uploadingDoc === requirement.id ? (
                          <>Uploading...</>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Update Document
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-[#0A1A2F] mb-1">Need Help with Verification?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Our team is here to assist you with any questions about the verification process.
              </p>
              <Button variant="outline">Contact Support</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}