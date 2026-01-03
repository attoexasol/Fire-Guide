import React, { useState } from "react";
import { 
  User, 
  Save,
  CheckCircle2,
  Circle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  FileText,
  Award,
  Shield,
  Info,
  Upload,
  CheckSquare,
  Clock,
  XCircle,
  Eye
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";

export function ProfessionalProfileContent() {
  const [formData, setFormData] = useState({
    name: "John Smith",
    email: "john.smith@fireguide.com",
    phone: "+44 7700 900123",
    businessName: "FireSafe Professionals Ltd",
    address: "123 High Street, London",
    postcode: "SW1A 1AA",
    bio: "Certified fire safety professional with 10+ years of experience in residential and commercial fire risk assessments.",
    certifications: [
      {
        id: 1,
        name: "Fire Risk Assessment Level 4",
        status: "verified", // verified, pending, rejected
        evidenceFile: "fire_risk_level4_cert.pdf",
        fileCount: 1,
        uploadDate: "Oct 15, 2024",
        verifiedDate: "Oct 18, 2024"
      },
      {
        id: 2,
        name: "NEBOSH Fire Safety",
        status: "pending",
        evidenceFile: "nebosh_certificate.pdf",
        fileCount: 1,
        uploadDate: "Dec 10, 2024",
        verifiedDate: null
      },
      {
        id: 3,
        name: "FIA Certified",
        status: "verified",
        evidenceFile: "FIA_certification_2024.jpg",
        fileCount: 1,
        uploadDate: "Oct 20, 2024",
        verifiedDate: "Oct 22, 2024"
      },
      {
        id: 4,
        name: "IOSH Managing Safely",
        status: "rejected",
        evidenceFile: "iosh_old_certificate.pdf",
        fileCount: 1,
        uploadDate: "Nov 5, 2024",
        rejectedDate: "Nov 8, 2024",
        rejectionReason: "Certificate expired. Please upload current certification."
      }
    ],
    serviceRadius: [50],
    emergencyCallout: true
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([
    "fire-risk-assessment",
    "fire-alarm-service",
    "fire-extinguisher"
  ]);

  const services = [
    { id: "fire-risk-assessment", name: "Fire Risk Assessment", category: "Assessment" },
    { id: "fire-alarm-service", name: "Fire Alarm Service", category: "Equipment" },
    { id: "fire-extinguisher", name: "Fire Extinguisher Service", category: "Equipment" },
    { id: "fire-door", name: "Fire Door Inspection", category: "Inspection" },
    { id: "emergency-lighting", name: "Emergency Lighting Test", category: "Equipment" },
    { id: "fire-training", name: "Fire Safety Training", category: "Training" },
  ];

  const completionSteps = [
    { id: 1, title: "Basic Information", completed: true },
    { id: 2, title: "Contact Details", completed: true },
    { id: 3, title: "Service Selection", completed: true },
    { id: 4, title: "Certifications", completed: false },
    { id: 5, title: "Profile Photo", completed: false },
  ];

  const completionPercentage = (completionSteps.filter(s => s.completed).length / completionSteps.length) * 100;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[#0A1A2F] mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600">
          Tell customers about your services and experience
        </p>
      </div>

      {/* Profile Completion Progress */}
      <Card className="mb-6 border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Profile Completion</h3>
            <span className="text-sm font-semibold text-blue-600">{completionPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {completionSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 text-sm">
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span className={step.completed ? "text-gray-900" : "text-gray-500"}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal and business details visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input 
                    id="businessName" 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea 
                  id="bio"
                  rows={4}
                  placeholder="Describe your experience, qualifications, and what makes your service unique..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How customers and Fire Guide can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input 
                  id="phone" 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address *
                </Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <Input 
                  id="postcode" 
                  value={formData.postcode}
                  onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Services Offered */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-red-600" />
                Services Offered
              </CardTitle>
              <CardDescription>
                Select all services you can provide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-start gap-3 p-3 border rounded-lg hover:border-red-200 hover:bg-red-50/50 transition-all">
                    <Checkbox 
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedServices([...selectedServices, service.id]);
                        } else {
                          setSelectedServices(selectedServices.filter(id => id !== service.id));
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={service.id} className="font-medium text-gray-900 cursor-pointer block">
                        {service.name}
                      </label>
                      <span className="text-sm text-gray-500">{service.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Area */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Service Area
              </CardTitle>
              <CardDescription>
                Define how far you're willing to travel for jobs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Service Radius</Label>
                  <span className="text-sm font-semibold text-red-600">
                    {formData.serviceRadius[0]} miles
                  </span>
                </div>
                <Slider 
                  value={formData.serviceRadius}
                  onValueChange={(value) => setFormData({...formData, serviceRadius: value})}
                  min={5}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>5 miles</span>
                  <span>100 miles</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Checkbox 
                  id="emergencyCallout"
                  checked={formData.emergencyCallout}
                  onCheckedChange={(checked) => setFormData({...formData, emergencyCallout: checked as boolean})}
                />
                <div className="flex-1">
                  <label htmlFor="emergencyCallout" className="font-medium text-gray-900 cursor-pointer block mb-1">
                    Available for Emergency Callouts
                  </label>
                  <p className="text-sm text-gray-600">
                    Get priority bookings for urgent fire safety issues
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                Certifications & Qualifications
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-2">
                Upload your certificates. An admin will review and mark them as Verified, Pending, or Rejected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.certifications.map((cert) => (
                <div 
                  key={cert.id} 
                  className={`p-4 border rounded-lg ${
                    cert.status === 'verified' ? 'bg-green-50 border-green-200' :
                    cert.status === 'pending' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}
                >
                  {/* Header with title and status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{cert.name}</h4>
                      
                      {/* Evidence Info Row */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Evidence: <span className="text-gray-700">{cert.evidenceFile}</span> ({cert.fileCount} file)
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 -mr-2"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="ml-3 flex-shrink-0">
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

                  {/* Additional info based on status */}
                  {cert.status === 'verified' && cert.verifiedDate && (
                    <p className="text-xs text-green-700">
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                      Verified on {cert.verifiedDate}
                    </p>
                  )}
                  {cert.status === 'pending' && (
                    <p className="text-xs text-amber-700">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Uploaded {cert.uploadDate} - Awaiting admin review
                    </p>
                  )}
                  {cert.status === 'rejected' && cert.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded">
                      <p className="text-xs text-red-900 flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span><strong>Reason:</strong> {cert.rejectionReason}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <Button variant="outline" className="w-full mt-6">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Certification
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes 1 column on desktop */}
        <div className="space-y-6">
          {/* Profile Preview */}
          <Card className="border-0 shadow-md sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Profile Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <Button variant="outline" size="sm">Upload Photo</Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{formData.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{formData.businessName}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.postcode}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Services</span>
                  <span className="font-semibold text-gray-900">{selectedServices.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Service Radius</span>
                  <span className="font-semibold text-gray-900">{formData.serviceRadius[0]} mi</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Certifications</span>
                  <span className="font-semibold text-gray-900">{formData.certifications.length}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 mb-1">
                      Complete Your Profile
                    </p>
                    <p className="text-sm text-yellow-800">
                      Add a photo and more certifications to increase booking chances
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-0 shadow-md bg-blue-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Profile Tips</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Complete profiles get 3x more bookings</li>
                    <li>• Add a professional photo</li>
                    <li>• List all your certifications</li>
                    <li>• Write a detailed bio</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button - Fixed at bottom on mobile, inline on desktop */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg mt-6 p-4 lg:static lg:border-0 lg:shadow-none lg:mt-6">
        <div className="flex flex-col md:flex-row gap-3 max-w-7xl mx-auto">
          <Button className="flex-1 bg-red-600 hover:bg-red-700 h-12">
            <Save className="w-4 h-4 mr-2" />
            Save Profile Changes
          </Button>
          <Button variant="outline" className="md:w-auto h-12">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}