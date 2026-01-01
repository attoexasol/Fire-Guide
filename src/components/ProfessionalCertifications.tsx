import { useState, useEffect } from "react";
import { Award, CheckCircle2, Calendar, Loader2, Plus } from "lucide-react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { fetchQualifications, updateCertification, deleteCertification, QualificationCertificationResponse } from "../api/qualificationsService";
import { getApiToken } from "../lib/auth";
import { toast } from "sonner";

export function ProfessionalCertifications() {
  const [certifications, setCertifications] = useState<QualificationCertificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<QualificationCertificationResponse | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    certification_date: "",
    professional_id: 0
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<QualificationCertificationResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Convert date string to YYYY-MM-DD format for input
  const formatDateForInput = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return dateString;
    }
  };

  // Placeholder handlers for action icons
  const handleView = (cert: QualificationCertificationResponse) => {
    console.log('View certification:', cert);
  };

  const handleEdit = (cert: QualificationCertificationResponse) => {
    setSelectedCertification(cert);
    setEditForm({
      title: cert.title,
      certification_date: formatDateForInput(cert.certification_date),
      professional_id: 0 // Not used for submission, only for display
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCertification = async () => {
    if (!selectedCertification) return;

    if (!editForm.title.trim() || !editForm.certification_date.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to update certification.");
      return;
    }

    const professionalId = selectedCertification.professional?.id;
    if (!professionalId) {
      toast.error("Professional ID is required");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await updateCertification({
        api_token: token,
        id: selectedCertification.id,
        title: editForm.title,
        certification_date: editForm.certification_date,
        professional_id: professionalId
      });

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        toast.success(response.message || "Certification updated successfully!");
        setIsEditModalOpen(false);
        setSelectedCertification(null);
        // Refresh certifications list
        const data = await fetchQualifications();
        setCertifications(data);
      } else {
        toast.error(response.message || response.error || "Failed to update certification. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while updating certification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (cert: QualificationCertificationResponse) => {
    setCertToDelete(cert);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!certToDelete) return;

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to delete certification.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteCertification({
        api_token: token,
        id: certToDelete.id
      });

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        toast.success(response.message || "Certification deleted successfully!");
        setIsDeleteModalOpen(false);
        setCertToDelete(null);
        // Refresh certifications list
        const data = await fetchQualifications();
        setCertifications(data);
      } else {
        toast.error(response.message || response.error || "Failed to delete certification. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while deleting certification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
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
                    <div className="ml-4 flex-shrink-0 fle items-start gap-2 space-y-4">
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                      <div className="fle flex-col gap-1">
                        <button
                          onClick={() => handleView(cert)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                          aria-label="View certification"
                          type="button"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(cert)}
                          className="p-1 text-gray-500 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded"
                          aria-label="Edit certification"
                          type="button"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
                          aria-label="Delete certification"
                          type="button"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Certification Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">
              Edit Certification
            </DialogTitle>
            <DialogDescription>
              Update your certification details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="e.g., Fire Risk Assessment Level 4"
                className="px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-certification-date">Certification Date *</Label>
              <Input
                id="edit-certification-date"
                type="date"
                value={editForm.certification_date}
                onChange={(e) => setEditForm({ ...editForm, certification_date: e.target.value })}
                className="px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-professional-id">Professional ID</Label>
              <Input
                id="edit-professional-id"
                type="number"
                value={selectedCertification?.professional?.id || ''}
                readOnly
                disabled
                className="px-4 py-2.5 bg-gray-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCertification(null);
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleUpdateCertification}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0A1A2F]">
              Delete Certification
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this certification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCertToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Sure"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
