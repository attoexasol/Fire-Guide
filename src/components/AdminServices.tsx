import { useState } from "react";
import { Flame, ClipboardCheck, Bell, DoorOpen, Lightbulb, Plus, Edit, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ServiceCard, Service } from "./ServiceCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { toast } from "sonner@2.0.3";

export function AdminServices() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const handleSaveEdit = () => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
      setEditingService(null);
      toast.success("Service updated successfully!");
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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
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