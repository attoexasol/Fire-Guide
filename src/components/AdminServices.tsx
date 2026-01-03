import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Flame, ClipboardCheck, Bell, DoorOpen, Lightbulb, Plus, Edit, Save, X, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ServiceCard, Service } from "./ServiceCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { toast } from "sonner";
import { updateService, UpdateServiceRequest, createService, CreateServiceRequest } from "../api/servicesService";
import { getApiToken } from "../lib/auth";

export function AdminServices() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Check if we're on the add service route
  const isAddServiceRoute = location.pathname === "/admin/dashboard/services/add";
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Fire Risk Assessment",
      icon: "🔥",
      iconComponent: ClipboardCheck,
      description: "Comprehensive evaluation of fire hazards and safety measures in your property",
      basePrice: "£250",
      popular: true,
      active: true,
      color: "red"
    },
    {
      id: 2,
      name: "Fire Equipment Service",
      icon: "🧯",
      iconComponent: Flame,
      description: "Inspection, testing, and maintenance of fire extinguishers and equipment",
      basePrice: "£150",
      popular: true,
      active: true,
      color: "orange"
    },
    {
      id: 3,
      name: "Emergency Lighting Test",
      icon: "💡",
      iconComponent: Lightbulb,
      description: "Testing and certification of emergency lighting systems to ensure compliance",
      basePrice: "£180",
      popular: false,
      active: true,
      color: "blue"
    },
    {
      id: 4,
      name: "Fire Alarm Testing",
      icon: "🔔",
      iconComponent: Bell,
      description: "Comprehensive testing and maintenance of fire alarm and detection systems",
      basePrice: "£200",
      popular: true,
      active: true,
      color: "purple"
    },
    {
      id: 5,
      name: "Fire Door Inspection",
      icon: "🚪",
      iconComponent: DoorOpen,
      description: "Detailed inspection of fire doors to ensure they meet safety standards",
      basePrice: "£120",
      popular: false,
      active: true,
      color: "green"
    },
  ]);

  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    basePrice: "",
    popular: false,
    active: true
  });

  // Form data for Add Service page
  const [addServiceForm, setAddServiceForm] = useState({
    service_name: "",
    type: "DELIVERY",
    status: "ACTIVE",
    price: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to update service.");
      return;
    }

    try {
      // Map the Service type to API format
      const updateData: UpdateServiceRequest = {
        api_token: token,
        id: editingService.id,
        service_name: editingService.name,
        type: "DELIVERY", // Default type, you may want to add this to the Service interface
        status: editingService.active ? "ACTIVE" : "INACTIVE",
        price: editingService.basePrice.replace("£", "").replace(",", ""),
        description: editingService.description || ""
      };

      const response = await updateService(updateData);

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        setServices(services.map(s => s.id === editingService.id ? editingService : s));
        setEditingService(null);
        toast.success(response.message || "Service updated successfully!");
      } else {
        toast.error(response.message || response.error || "Failed to update service. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while updating service. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(s => s.id !== id));
      toast.success("Service deleted successfully!");
    }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.description || !newService.basePrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const service: Service = {
      id: Math.max(...services.map(s => s.id)) + 1,
      name: newService.name,
      description: newService.description,
      basePrice: newService.basePrice,
      popular: newService.popular || false,
      active: newService.active !== false,
      color: "red"
    };

    setServices([...services, service]);
    setNewService({ name: "", description: "", basePrice: "", popular: false, active: true });
    setIsAddModalOpen(false);
    toast.success("Service added successfully!");
  };

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addServiceForm.service_name.trim() || !addServiceForm.description.trim() || !addServiceForm.price.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to add a service.");
      return;
    }

    setIsSubmitting(true);
    try {
      const createData: CreateServiceRequest = {
        api_token: token,
        service_name: addServiceForm.service_name.trim(),
        type: addServiceForm.type,
        status: addServiceForm.status,
        price: addServiceForm.price.trim(),
        description: addServiceForm.description.trim()
      };

      const response = await createService(createData);

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        toast.success(response.message || "Service created successfully!");
        // Reset form
        setAddServiceForm({
          service_name: "",
          type: "DELIVERY",
          status: "ACTIVE",
          price: "",
          description: ""
        });
        // Navigate back to services list
        navigate("/admin/dashboard/services");
      } else {
        toast.error(response.message || response.error || "Failed to create service. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while adding the service. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToServices = () => {
    navigate("/admin/dashboard/services");
  };

  // Render Add Service form if on add route
  if (isAddServiceRoute) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={handleBackToServices}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#0A1A2F]">Add New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddServiceSubmit} className="space-y-6">
              <div>
                <Label htmlFor="service_name" className="text-sm font-medium">
                  Service Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="service_name"
                  value={addServiceForm.service_name}
                  onChange={(e) => setAddServiceForm({ ...addServiceForm, service_name: e.target.value })}
                  className="mt-2 h-11"
                  placeholder="e.g., Fire Safety Training"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium">
                  Type <span className="text-red-600">*</span>
                </Label>
                <select
                  id="type"
                  value={addServiceForm.type}
                  onChange={(e) => setAddServiceForm({ ...addServiceForm, type: e.target.value })}
                  className="mt-2 w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                >
                  <option value="DELIVERY">DELIVERY</option>
                  <option value="CONSULTATION">CONSULTATION</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status <span className="text-red-600">*</span>
                </Label>
                <select
                  id="status"
                  value={addServiceForm.status}
                  onChange={(e) => setAddServiceForm({ ...addServiceForm, status: e.target.value })}
                  className="mt-2 w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div>
                <Label htmlFor="price" className="text-sm font-medium">
                  Price <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="price"
                  type="text"
                  value={addServiceForm.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setAddServiceForm({ ...addServiceForm, price: value });
                    }
                  }}
                  className="mt-2 h-11"
                  placeholder="150"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={addServiceForm.description}
                  onChange={(e) => setAddServiceForm({ ...addServiceForm, description: e.target.value })}
                  className="mt-2"
                  rows={4}
                  placeholder="Describe the service..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToServices}
                  disabled={isSubmitting}
                  className="h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 h-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Service
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#0A1A2F] mb-2">Service Management</h1>
          <p className="text-[14px] text-gray-600">
            Manage fire safety services offered on the platform
          </p>
        </div>
        {!isAddServiceRoute && (
          <Button
            onClick={() => navigate("/admin/dashboard/services/add")}
            className="bg-red-600 hover:bg-red-700 h-11"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200 rounded-xl">
        <CardContent className="p-4">
          <p className="text-sm text-blue-900">
            <strong>Automatic Sync:</strong> Services created, edited, or deleted here automatically
            appear across Landing Page, Customer Portal, and Professional Portal. Only "Active" services
            are visible to customers.
          </p>
        </CardContent>
      </Card>

      {/* Services Grid - 24px spacing between cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id}>
            {editingService?.id === service.id ? (
              <Card className="rounded-xl shadow-md p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Service Name</Label>
                    <Input
                      value={editingService.name}
                      onChange={(e) =>
                        setEditingService({ ...editingService, name: e.target.value })
                      }
                      className="mt-2 h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      value={editingService.description}
                      onChange={(e) =>
                        setEditingService({ ...editingService, description: e.target.value })
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Base Price</Label>
                      <Input
                        value={editingService.basePrice}
                        onChange={(e) =>
                          setEditingService({ ...editingService, basePrice: e.target.value })
                        }
                        className="mt-2 h-11"
                        placeholder="£250"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Status</Label>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingService.popular}
                            onChange={(e) =>
                              setEditingService({ ...editingService, popular: e.target.checked })
                            }
                            className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">Popular</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingService.active}
                            onChange={(e) =>
                              setEditingService({ ...editingService, active: e.target.checked })
                            }
                            className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 h-11 flex-1"
                      onClick={handleSaveEdit}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-11 flex-1"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <ServiceCard
                service={service}
                variant="admin"
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#0A1A2F]">Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="text-sm">
                Service Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                value={newService.name || ""}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="mt-2 h-11"
                placeholder="e.g., Fire Safety Training"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm">
                Description <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="description"
                value={newService.description || ""}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="mt-2"
                rows={3}
                placeholder="Describe the service..."
              />
            </div>

            <div>
              <Label htmlFor="basePrice" className="text-sm">
                Base Price <span className="text-red-600">*</span>
              </Label>
              <Input
                id="basePrice"
                value={newService.basePrice || ""}
                onChange={(e) => setNewService({ ...newService, basePrice: e.target.value })}
                className="mt-2 h-11"
                placeholder="£250"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newService.popular || false}
                  onChange={(e) => setNewService({ ...newService, popular: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Mark as Popular</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newService.active !== false}
                  onChange={(e) => setNewService({ ...newService, active: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Active (visible to customers)</span>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="h-11">
              Cancel
            </Button>
            <Button onClick={handleAddService} className="bg-red-600 hover:bg-red-700 h-11">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}