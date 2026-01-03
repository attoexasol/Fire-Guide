import React, { useState } from "react";
import { Search, Star, MoreVertical, Mail, Phone, MapPin, CheckCircle, Clock, XCircle, Eye, Ban, Award, FileText, Download, AlertCircle, Edit2, Image, File } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

export function AdminProfessionals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [serviceRejectModalOpen, setServiceRejectModalOpen] = useState(false);
  const [serviceReuploadModalOpen, setServiceReuploadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceRejectionNote, setServiceRejectionNote] = useState("");
  const [serviceReuploadNote, setServiceReuploadNote] = useState("");
  const [filePreviewModalOpen, setFilePreviewModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [evidenceStatuses, setEvidenceStatuses] = useState<{[key: string]: string}>({});

  // Mock services data for professionals
  const professionalServices = {
    1: [ // Sarah Mitchell's services
      {
        id: "s1",
        name: "Fire Risk Assessment",
        status: "approved",
        evidenceFile: "Fire_Risk_Assessment_Certificate.pdf",
        evidenceType: "pdf",
        uploadDate: "15 Oct 2024",
        verifiedDate: "18 Oct 2024",
        verifiedBy: "Admin Team"
      },
      {
        id: "s2",
        name: "Fire Safety Training",
        status: "approved",
        evidenceFile: "Training_License.pdf",
        evidenceType: "pdf",
        uploadDate: "15 Oct 2024",
        verifiedDate: "18 Oct 2024",
        verifiedBy: "Admin Team"
      },
      {
        id: "s3",
        name: "Emergency Evacuation Planning",
        status: "pending",
        evidenceFile: "Evacuation_Certificate.jpg",
        evidenceType: "image",
        uploadDate: "5 Dec 2024",
        verifiedDate: null,
        verifiedBy: null
      }
    ],
    2: [ // James Patterson's services
      {
        id: "s4",
        name: "Fire Risk Assessment",
        status: "approved",
        evidenceFile: "FRA_Certificate_2024.pdf",
        evidenceType: "pdf",
        uploadDate: "20 Mar 2024",
        verifiedDate: "22 Mar 2024",
        verifiedBy: "Admin Team"
      },
      {
        id: "s5",
        name: "Fire Alarm Installation",
        status: "rejected",
        evidenceFile: "Fire_Alarm_License_Old.pdf",
        evidenceType: "pdf",
        uploadDate: "20 Mar 2024",
        rejectedDate: "25 Mar 2024",
        rejectionReason: "Certificate expired. Please upload current certification."
      }
    ],
    3: [ // David Chen's services
      {
        id: "s6",
        name: "Fire Risk Assessment",
        status: "approved",
        evidenceFile: "FRA_Qualification.pdf",
        evidenceType: "pdf",
        uploadDate: "10 Dec 2023",
        verifiedDate: "12 Dec 2023",
        verifiedBy: "Admin Team"
      },
      {
        id: "s7",
        name: "Fire Safety Audit",
        status: "approved",
        evidenceFile: "Audit_Certificate.pdf",
        evidenceType: "pdf",
        uploadDate: "10 Dec 2023",
        verifiedDate: "12 Dec 2023",
        verifiedBy: "Admin Team"
      }
    ],
    4: [ // Emily Roberts's services (pending professional)
      {
        id: "s8",
        name: "Fire Risk Assessment",
        status: "pending",
        evidenceFile: "FRA_Certificate_New.pdf",
        evidenceType: "pdf",
        uploadDate: "1 Nov 2025",
        verifiedDate: null,
        verifiedBy: null
      },
      {
        id: "s9",
        name: "Fire Safety Training",
        status: "pending",
        evidenceFile: null,
        evidenceType: null,
        uploadDate: null,
        verifiedDate: null,
        verifiedBy: null
      }
    ],
    5: [ // Robert Taylor's services
      {
        id: "s10",
        name: "Fire Risk Assessment",
        status: "approved",
        evidenceFile: "FRA_License.pdf",
        evidenceType: "pdf",
        uploadDate: "10 Jun 2024",
        verifiedDate: "12 Jun 2024",
        verifiedBy: "Admin Team"
      }
    ]
  };

  // Mock qualifications evidence data
  const qualificationsEvidence: {[key: number]: any[]} = {
    1: [ // Sarah Mitchell's evidence
      {
        id: "e1",
        fileName: "NEBOSH_Certificate_2024.pdf",
        fileType: "pdf",
        uploadDate: "Oct 15, 2024",
        status: "approved",
        approvedDate: "Oct 18, 2024",
        approvedBy: "Admin Team"
      },
      {
        id: "e2",
        fileName: "Fire_Safety_Level4_Certificate.jpg",
        fileType: "image",
        uploadDate: "Oct 15, 2024",
        status: "approved",
        approvedDate: "Oct 18, 2024",
        approvedBy: "Admin Team"
      },
      {
        id: "e3",
        fileName: "Insurance_Certificate_2024.pdf",
        fileType: "pdf",
        uploadDate: "Dec 5, 2024",
        status: "pending",
        approvedDate: null,
        approvedBy: null
      }
    ],
    4: [ // Emily Roberts's evidence (pending professional)
      {
        id: "e4",
        fileName: "Level3_Fire_Safety_Certificate.pdf",
        fileType: "pdf",
        uploadDate: "Nov 1, 2025",
        status: "pending",
        approvedDate: null,
        approvedBy: null
      },
      {
        id: "e5",
        fileName: "5_Years_Experience_Letter.pdf",
        fileType: "pdf",
        uploadDate: "Nov 1, 2025",
        status: "pending",
        approvedDate: null,
        approvedBy: null
      },
      {
        id: "e6",
        fileName: "ID_Proof.jpg",
        fileType: "image",
        uploadDate: "Nov 1, 2025",
        status: "approved",
        approvedDate: "Nov 3, 2025",
        approvedBy: "Admin Team"
      }
    ]
  };

  const [professionals, setProfessionals] = useState([
    {
      id: 1,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@fireguide.co.uk",
      phone: "07123 987654",
      location: "London",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      rating: 4.9,
      reviewCount: 127,
      totalBookings: 156,
      completionRate: 98,
      responseTime: "1 hour",
      status: "approved",
      joinDate: "Jan 2024",
      qualifications: ["NEBOSH", "Fire Safety Level 4"]
    },
    {
      id: 2,
      name: "James Patterson",
      email: "james.patterson@fireguide.co.uk",
      phone: "07234 876543",
      location: "Manchester",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      rating: 4.8,
      reviewCount: 94,
      totalBookings: 112,
      completionRate: 96,
      responseTime: "2 hours",
      status: "approved",
      joinDate: "Mar 2024",
      qualifications: ["IOSH Certified", "Fire Safety Level 3"]
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.chen@fireguide.co.uk",
      phone: "07345 765432",
      location: "Birmingham",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 4.7,
      reviewCount: 156,
      totalBookings: 203,
      completionRate: 97,
      responseTime: "30 mins",
      status: "approved",
      joinDate: "Dec 2023",
      qualifications: ["NEBOSH", "IOSH"]
    },
    {
      id: 4,
      name: "Emily Roberts",
      email: "emily.roberts@fireguide.co.uk",
      phone: "07456 654321",
      location: "Leeds",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 0,
      reviewCount: 0,
      totalBookings: 0,
      completionRate: 0,
      responseTime: "N/A",
      status: "pending",
      joinDate: "Nov 2025",
      qualifications: ["Fire Safety Level 3", "5+ Years"]
    },
    {
      id: 5,
      name: "Robert Taylor",
      email: "robert.taylor@fireguide.co.uk",
      phone: "07567 543210",
      location: "Bristol",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 4.3,
      reviewCount: 45,
      totalBookings: 67,
      completionRate: 89,
      responseTime: "4 hours",
      status: "suspended",
      joinDate: "Jun 2024",
      qualifications: ["Fire Safety Level 3"]
    },
  ]);

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || professional.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: professionals.length,
    approved: professionals.filter(p => p.status === "approved").length,
    pending: professionals.filter(p => p.status === "pending").length,
    suspended: professionals.filter(p => p.status === "suspended").length,
  };

  const handleApprove = (professional: any) => {
    setSelectedProfessional(professional);
    setApprovalModalOpen(true);
  };

  const handleReject = (professional: any) => {
    setSelectedProfessional(professional);
    setRejectionModalOpen(true);
  };

  const handleEdit = (professional: any) => {
    setSelectedProfessional(professional);
    setEditModalOpen(true);
  };

  const handleViewProfile = (professional: any) => {
    setSelectedProfessional(professional);
    setProfileModalOpen(true);
  };

  const handleSuspend = (professional: any) => {
    setProfessionals(professionals.map(p => 
      p.id === professional.id ? { ...p, status: "suspended" } : p
    ));
    toast.success(`${professional.name}'s account has been suspended`);
  };

  const handleReactivate = (professional: any) => {
    setProfessionals(professionals.map(p => 
      p.id === professional.id ? { ...p, status: "approved" } : p
    ));
    toast.success(`${professional.name}'s account has been reactivated`);
  };

  const handleSendEmail = (professional: any) => {
    toast.success(`Email dialog opened for ${professional.name}`);
  };

  const confirmApproval = () => {
    setProfessionals(professionals.map(p => 
      p.id === selectedProfessional?.id ? { ...p, status: "approved" } : p
    ));
    toast.success(`${selectedProfessional?.name} has been approved and notified via email`);
    setApprovalModalOpen(false);
    setVerificationNotes("");
  };

  const confirmRejection = () => {
    if (!rejectionReason) {
      toast.error("Please select a rejection reason");
      return;
    }
    // Remove the professional from the list when rejected
    setProfessionals(professionals.filter(p => p.id !== selectedProfessional?.id));
    toast.success(`Application rejected. Email notification sent to ${selectedProfessional?.name}`);
    setRejectionModalOpen(false);
    setRejectionReason("");
    setRejectionMessage("");
  };

  const saveProfileEdits = () => {
    toast.success(`Changes to ${selectedProfessional?.name}'s profile saved successfully`);
    setEditModalOpen(false);
  };

  const handleApproveEvidence = (evidenceId: string, fileName: string) => {
    setEvidenceStatuses({...evidenceStatuses, [evidenceId]: 'approved'});
    toast.success(`${fileName} has been approved`);
  };

  const handleRejectEvidence = (evidenceId: string, fileName: string) => {
    setEvidenceStatuses({...evidenceStatuses, [evidenceId]: 'rejected'});
    toast.error(`${fileName} has been rejected`);
  };

  const handleViewFile = (file: any) => {
    setSelectedFile(file);
    setFilePreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="px-4 md:px-0">
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Professional Management</h1>
        <p className="text-gray-600">View and manage fire safety professionals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 md:px-0">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Total Professionals</p>
            <p className="text-2xl text-[#0A1A2F] mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl text-green-600 mt-1">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Pending Approval</p>
            <p className="text-2xl text-yellow-600 mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Suspended</p>
            <p className="text-2xl text-red-600 mt-1">{stats.suspended}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-0">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search professionals by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Cards */}
      <div className="grid gap-4 px-4 md:px-0">
        {filteredProfessionals.map((professional) => (
          <Card key={professional.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={professional.photo}
                  alt={professional.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl text-[#0A1A2F]">{professional.name}</h3>
                        <Badge
                          className={
                            professional.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : professional.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {professional.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {professional.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {professional.status === "suspended" && <XCircle className="w-3 h-3 mr-1" />}
                          {professional.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {professional.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {professional.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {professional.location}
                        </p>
                      </div>

                      {professional.qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {professional.qualifications.map((qual, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                              <Award className="w-3 h-3 mr-1" />
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(professional)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(professional)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        {professional.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600" onClick={() => handleApprove(professional)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Professional
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleReject(professional)}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Application
                            </DropdownMenuItem>
                          </>
                        )}
                        {professional.status === "approved" && (
                          <DropdownMenuItem className="text-yellow-600" onClick={() => handleSuspend(professional)}>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        )}
                        {professional.status === "suspended" && (
                          <DropdownMenuItem className="text-green-600" onClick={() => handleReactivate(professional)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Reactivate Account
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleSendEmail(professional)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {professional.rating > 0 ? professional.rating : "N/A"}
                        </span>
                        {professional.reviewCount > 0 && (
                          <span className="text-sm text-gray-500">({professional.reviewCount})</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bookings</p>
                      <p className="font-semibold text-gray-900 mt-1">{professional.totalBookings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completion</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {professional.completionRate > 0 ? `${professional.completionRate}%` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Time</p>
                      <p className="font-semibold text-gray-900 mt-1">{professional.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Joined</p>
                      <p className="font-semibold text-gray-900 mt-1">{professional.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfessionals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No professionals found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Approval Modal */}
      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F] flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Approve Professional Application
            </DialogTitle>
            <DialogDescription>
              Review qualifications and documents before approving {selectedProfessional?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Professional Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={selectedProfessional?.photo}
                alt={selectedProfessional?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{selectedProfessional?.name}</h4>
                <p className="text-sm text-gray-600">{selectedProfessional?.email}</p>
                <p className="text-sm text-gray-600">{selectedProfessional?.location}</p>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <Label className="text-base font-semibold text-gray-900 mb-3 block">
                Qualifications & Certificates
              </Label>
              <div className="space-y-3">
                {selectedProfessional?.qualifications.map((qual: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{qual}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <Label className="text-base font-semibold text-gray-900 mb-3 block">
                Uploaded Documents
              </Label>
              <div className="space-y-2">
                {["Certificate_NEBOSH.pdf", "Insurance_Document.pdf", "ID_Verification.pdf"].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Checklist */}
            <div>
              <Label className="text-base font-semibold text-gray-900 mb-3 block">
                Verification Checklist
              </Label>
              <div className="space-y-2">
                {[
                  "Identity documents verified",
                  "Professional qualifications confirmed",
                  "Insurance coverage verified",
                  "Background check completed",
                  "Contact information validated"
                ].map((item, index) => (
                  <label key={index} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verification Notes */}
            <div>
              <Label htmlFor="verification-notes">Internal Notes (Optional)</Label>
              <Textarea
                id="verification-notes"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add any notes about this verification..."
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Important</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Approving this professional will grant them access to the platform and allow them to receive bookings. Make sure all documents have been thoroughly verified.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmApproval}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F] flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Reject Application
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedProfessional?.name}'s application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incomplete-documents">Incomplete or Missing Documents</SelectItem>
                  <SelectItem value="invalid-qualifications">Invalid or Expired Qualifications</SelectItem>
                  <SelectItem value="failed-background-check">Failed Background Check</SelectItem>
                  <SelectItem value="insufficient-experience">Insufficient Experience</SelectItem>
                  <SelectItem value="incorrect-information">Incorrect or False Information</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rejection-message">Message to Applicant (Optional)</Label>
              <Textarea
                id="rejection-message"
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                placeholder="Provide additional details or feedback..."
                className="mt-2"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be included in the rejection email
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">This action cannot be undone</p>
                <p className="text-sm text-red-700 mt-1">
                  The applicant will be notified via email and their application will be permanently rejected.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmRejection}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F] flex items-center gap-2">
              <Edit2 className="w-6 h-6 text-blue-600" />
              Edit Professional Profile
            </DialogTitle>
            <DialogDescription>
              Make changes to {selectedProfessional?.name}'s profile information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedProfessional?.name}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedProfessional?.email}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  defaultValue={selectedProfessional?.phone}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  defaultValue={selectedProfessional?.location}
                  className="mt-2"
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="edit-bio">Bio / Description</Label>
              <Textarea
                id="edit-bio"
                defaultValue="Experienced fire safety professional with over 10 years in the industry..."
                className="mt-2"
                rows={4}
              />
            </div>

            <div>
              <Label>Qualifications</Label>
              <div className="mt-2 space-y-2">
                {selectedProfessional?.qualifications.map((qual: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input defaultValue={qual} />
                    <Button variant="outline" size="sm" className="text-red-600">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  + Add Qualification
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Account Status</Label>
                <Select defaultValue={selectedProfessional?.status}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-response-time">Response Time</Label>
                <Input
                  id="edit-response-time"
                  defaultValue={selectedProfessional?.responseTime}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                Changes will be saved immediately and the professional will be notified of major changes via email.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={saveProfileEdits}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">
              Professional Profile
            </DialogTitle>
            <DialogDescription>
              Complete professional information and qualification details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Profile Header */}
            <div className="flex items-start gap-6">
              <img
                src={selectedProfessional?.photo}
                alt={selectedProfessional?.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl text-[#0A1A2F]">{selectedProfessional?.name}</h3>
                  <Badge
                    className={
                      selectedProfessional?.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : selectedProfessional?.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {selectedProfessional?.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedProfessional?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedProfessional?.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedProfessional?.location}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Performance Stats */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Performance Statistics</h4>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {selectedProfessional?.rating || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="font-semibold text-gray-900 mt-1">{selectedProfessional?.totalBookings}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {selectedProfessional?.completionRate || "N/A"}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Response Time</p>
                  <p className="font-semibold text-gray-900 mt-1">{selectedProfessional?.responseTime}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Evidence Submitted - NEW SECTION */}
            {qualificationsEvidence[selectedProfessional?.id] && (
              <>
                <div>
                  <div className="mb-3">
                    <h4 className="text-lg font-medium text-gray-900">Evidence Submitted</h4>
                    <p className="text-sm text-gray-600 mt-1">Documents uploaded by the professional for verification</p>
                  </div>

                  {/* Check if all evidence is approved */}
                  {qualificationsEvidence[selectedProfessional?.id].every((ev: any) => 
                    (evidenceStatuses[ev.id] || ev.status) === 'approved'
                  ) && (
                    <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Professional Verified - All documents approved</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {qualificationsEvidence[selectedProfessional?.id].map((evidence: any) => {
                      const currentStatus = evidenceStatuses[evidence.id] || evidence.status;
                      const isApproved = currentStatus === 'approved';
                      const isPending = currentStatus === 'pending';
                      const isRejected = currentStatus === 'rejected';

                      return (
                        <div 
                          key={evidence.id}
                          className={`p-4 border rounded-lg transition-all ${
                            isApproved ? 'bg-green-50 border-green-200' : 
                            isRejected ? 'bg-red-50 border-red-200' : 
                            'bg-white border-gray-200'
                          }`}
                        >
                          {/* Document Row */}
                          <div className="flex items-start gap-3 mb-3">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0">
                              {evidence.fileType === 'pdf' ? (
                                <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-red-600" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                                  <Image className="w-6 h-6 text-blue-600" />
                                </div>
                              )}
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 break-words">{evidence.fileName}</p>
                              <p className="text-sm text-gray-500 mt-1">Uploaded {evidence.uploadDate}</p>
                              {isApproved && evidence.approvedDate && (
                                <div className="flex items-center gap-1 mt-1">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <p className="text-xs text-green-600">Approved on {evidence.approvedDate}</p>
                                </div>
                              )}
                            </div>

                            {/* Status Badge */}
                            <Badge
                              className={`flex-shrink-0 ${
                                isApproved ? 'bg-green-100 text-green-700' :
                                isPending ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}
                            >
                              {isApproved ? 'Verified' : isPending ? 'Not Verified' : 'Rejected'}
                            </Badge>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewFile(evidence)}
                              className="h-9"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            {!isApproved && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 h-9"
                                onClick={() => handleApproveEvidence(evidence.id, evidence.fileName)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                            )}
                            {!isRejected && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50 h-9"
                                onClick={() => handleRejectEvidence(evidence.id, evidence.fileName)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Qualifications */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Certificates</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProfessional?.qualifications.map((qual: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 h-9 px-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {qual}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Account Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Account Details</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Join Date</p>
                  <p className="font-medium text-gray-900 mt-1">{selectedProfessional?.joinDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Reviews</p>
                  <p className="font-medium text-gray-900 mt-1">{selectedProfessional?.reviewCount}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Registered Services Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Registered Services</h4>
              <div className="space-y-4">
                {professionalServices[selectedProfessional?.id as keyof typeof professionalServices]?.map((service: any) => (
                  <div 
                    key={service.id}
                    className="border rounded-lg p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4"
                  >
                    {/* Service Header - Mobile Optimized */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 text-base md:text-lg break-words">
                          {service.name}
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">
                          {service.uploadDate ? `Uploaded: ${service.uploadDate}` : 'Not uploaded yet'}
                        </p>
                      </div>
                      <Badge
                        className={`flex-shrink-0 ${
                          service.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : service.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {service.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {service.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {service.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Evidence of Competency */}
                    {service.evidenceFile ? (
                      <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {service.evidenceType === 'pdf' ? (
                              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded flex items-center justify-center">
                                <FileText className="w-6 h-6 md:w-7 md:h-7 text-red-600" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded flex items-center justify-center">
                                <FileText className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 break-all">
                              {service.evidenceFile}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {service.evidenceType?.toUpperCase()} Document
                            </p>
                            {service.verifiedDate && (
                              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified on {service.verifiedDate}
                              </p>
                            )}
                            {service.rejectedDate && service.rejectionReason && (
                              <p className="text-xs text-red-600 mt-1 flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span className="break-words">{service.rejectionReason}</span>
                              </p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-900">Evidence Required</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              No competency evidence has been uploaded for this service yet.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Actions - Mobile Optimized */}
                    <div className="flex flex-col md:flex-row gap-2 pt-2 border-t">
                      {service.status === 'pending' && service.evidenceFile && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-11 md:h-9"
                            onClick={() => {
                              toast.success(`${service.name} has been approved!`);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Service
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50 h-11 md:h-9"
                            onClick={() => {
                              setSelectedService(service);
                              setServiceRejectModalOpen(true);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {service.status === 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 h-11 md:h-9"
                          onClick={() => {
                            setSelectedService(service);
                            setServiceReuploadModalOpen(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Request Re-upload
                        </Button>
                      )}
                      {service.status === 'pending' && !service.evidenceFile && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 h-11 md:h-9"
                          onClick={() => {
                            setSelectedService(service);
                            setServiceReuploadModalOpen(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Request Evidence Upload
                        </Button>
                      )}
                      {service.status === 'approved' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 px-2 py-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Service approved and active</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {(!professionalServices[selectedProfessional?.id as keyof typeof professionalServices] || 
                professionalServices[selectedProfessional?.id as keyof typeof professionalServices].length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No services registered yet
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProfileModalOpen(false)}
            >
              Close
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setProfileModalOpen(false);
                handleEdit(selectedProfessional);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Rejection Modal */}
      <Dialog open={serviceRejectModalOpen} onOpenChange={setServiceRejectModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0A1A2F] flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Reject Service Evidence
            </DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting the evidence for {selectedService?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="service-rejection-note">Rejection Reason *</Label>
              <Textarea
                id="service-rejection-note"
                value={serviceRejectionNote}
                onChange={(e) => setServiceRejectionNote(e.target.value)}
                placeholder="Explain why the evidence is being rejected (e.g., certificate expired, incorrect document, poor image quality)..."
                className="mt-2"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be sent to the professional
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900">Service will be marked as rejected</p>
                <p className="text-sm text-red-700 mt-1">
                  The professional will need to re-upload valid evidence before this service can be approved.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setServiceRejectModalOpen(false);
                setServiceRejectionNote("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (!serviceRejectionNote.trim()) {
                  toast.error("Please provide a rejection reason");
                  return;
                }
                toast.success(`${selectedService?.name} evidence has been rejected. Professional notified.`);
                setServiceRejectModalOpen(false);
                setServiceRejectionNote("");
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Evidence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Re-upload Request Modal */}
      <Dialog open={serviceReuploadModalOpen} onOpenChange={setServiceReuploadModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0A1A2F] flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Request Evidence Re-upload
            </DialogTitle>
            <DialogDescription>
              Request the professional to upload or re-upload evidence for {selectedService?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="service-reupload-note">Message to Professional (Optional)</Label>
              <Textarea
                id="service-reupload-note"
                value={serviceReuploadNote}
                onChange={(e) => setServiceReuploadNote(e.target.value)}
                placeholder="Add any specific instructions or requirements for the evidence upload (e.g., current certification required, high-quality scan needed)..."
                className="mt-2"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be included in the notification email
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Professional will be notified</p>
                <p className="text-sm text-blue-700 mt-1">
                  An email notification will be sent requesting the evidence upload with your message.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setServiceReuploadModalOpen(false);
                setServiceReuploadNote("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast.success(`Re-upload request sent for ${selectedService?.name}. Professional notified via email.`);
                setServiceReuploadModalOpen(false);
                setServiceReuploadNote("");
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog open={filePreviewModalOpen} onOpenChange={setFilePreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">Document Preview</DialogTitle>
            <DialogDescription>
              {selectedFile?.fileName}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedFile?.fileType === 'pdf' ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <FileText className="w-24 h-24 text-red-600 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">{selectedFile?.fileName}</p>
                <p className="text-sm text-gray-600 mb-4">PDF documents cannot be previewed in this modal</p>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                <div className="bg-white p-4 rounded shadow-lg max-w-full">
                  <Image className="w-full h-auto max-h-[500px] object-contain" />
                  <p className="text-center text-sm text-gray-600 mt-4">{selectedFile?.fileName}</p>
                </div>
              </div>
            )}

            {/* File Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">File Type</p>
                  <p className="font-medium text-gray-900 mt-1">{selectedFile?.fileType?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Upload Date</p>
                  <p className="font-medium text-gray-900 mt-1">{selectedFile?.uploadDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge className={`mt-1 ${
                    selectedFile?.status === 'approved' ? 'bg-green-100 text-green-700' :
                    selectedFile?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedFile?.status}
                  </Badge>
                </div>
                {selectedFile?.approvedDate && (
                  <div>
                    <p className="text-gray-600">Approved Date</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedFile?.approvedDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFilePreviewModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}