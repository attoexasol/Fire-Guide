import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  Info,
  TrendingUp,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { fetchPrices, deletePrice, PriceItem } from "../api/pricingService";
import { getApiToken } from "../lib/auth";
import { toast } from "sonner";

export function ProfessionalPricingContent() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [priceToDelete, setPriceToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadPrices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPrices();
        setPrices(data);
      } catch (err: any) {
        console.error("Error loading prices:", err);
        setError(err.message || "Failed to load pricing data");
        toast.error(err.message || "Failed to load pricing data");
      } finally {
        setIsLoading(false);
      }
    };

    loadPrices();
  }, []);

  const updatePrice = (id: number, value: string) => {
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return;
    
    setPrices(prices.map(price => 
      price.id === id ? { ...price, price: value } : price
    ));
  };

  const handleEditPrice = (id: number) => {
    navigate(`/customer/dashboard/pricing/edit/${id}`);
  };

  const handleDeletePrice = (id: number) => {
    setPriceToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeletePrice = async () => {
    if (!priceToDelete) {
      return;
    }

    const token = getApiToken();
    if (!token) {
      toast.error("Please log in to delete price.");
      setDeleteModalOpen(false);
      setPriceToDelete(null);
      return;
    }

    try {
      const response = await deletePrice({
        api_token: token,
        id: priceToDelete
      });

      if (response.status === "success" || response.success || (response.message && !response.error)) {
        // Remove from local state
        setPrices(prices.filter(price => price.id !== priceToDelete));
        toast.success(response.message || "Price deleted successfully");
      } else {
        toast.error(response.message || response.error || "Failed to delete price. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "An error occurred while deleting price. Please try again.";
      toast.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setPriceToDelete(null);
    }
  };

  const cancelDeletePrice = () => {
    setDeleteModalOpen(false);
    setPriceToDelete(null);
  };

  const totalPrices = prices.length;
  const averagePrice = prices.length > 0
    ? prices.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / prices.length
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error Loading Prices</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-[#0A1A2F]">
            Service Pricing
          </h1>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => navigate("/customer/dashboard/pricing/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pricing
          </Button>
        </div>
        <p className="text-gray-600">
          View and manage your service pricing information
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Pricing Display - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {prices.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pricing Data</h3>
                <p className="text-gray-600">No pricing information available at this time.</p>
              </CardContent>
            </Card>
          ) : (
            prices.map((priceItem) => {
              const currentPrice = parseFloat(priceItem.price) || 0;
              const formattedDate = new Date(priceItem.created_at).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <Card key={priceItem.id} className="border-0 shadow-md hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{priceItem.title}</CardTitle>
                        <CardDescription>
                          Created: {formattedDate}
                          {priceItem.creator && ` • By ${priceItem.creator.full_name}`}
                        </CardDescription>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-gray-500">Price</p>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPrice(priceItem.id)}
                              className="h-7 w-7 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                              title="Edit price"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePrice(priceItem.id)}
                              className="h-7 w-7 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                              title="Delete price"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-700 text-xl">£{currentPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                      <div className="flex-1 w-full">
                        <Label htmlFor={`price-${priceItem.id}`} className="mb-2 block">
                          Update Price
                        </Label>
                        <div className="relative">
                          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            £
                          </span> */}
                          {/* <Input
                            id={`price-${priceItem.id}`}
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={priceItem.price}
                            onChange={(e) => updatePrice(priceItem.id, e.target.value)}
                            className="pl-7 text-lg h-12"
                          /> */}

                          <p
                            id={`price-${priceItem.id}`}
                            className="pl-7 text-lg h-12 flex items-center"
                          >
                              £{Number(priceItem.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Price Status */}
                      <div className="w-full md:w-auto">
                        {currentPrice > 0 && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {priceItem.updated_at && priceItem.updated_at !== priceItem.created_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last updated: {new Date(priceItem.updated_at).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {priceItem.updater && ` by ${priceItem.updater.full_name}`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar - Takes 1 column on desktop */}
        <div className="space-y-6">
          {/* Pricing Summary - Sticky on desktop */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Services</span>
                <span className="text-2xl font-semibold text-gray-900">{totalPrices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Price</span>
                <span className="text-2xl font-semibold text-gray-900">
                  {averagePrice > 0 ? `£${averagePrice.toFixed(2)}` : '£0.00'}
                </span>
              </div>
              <div className="pt-4 border-t border-blue-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Prices</span>
                    <span className="font-semibold text-gray-900">
                      {prices.filter(p => parseFloat(p.price) > 0).length}
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${totalPrices > 0 ? (prices.filter(p => parseFloat(p.price) > 0).length / totalPrices) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commission Info */}
          <Card className="border-0 shadow-md bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900 mb-2">Platform Commission</p>
                  <p className="text-sm text-yellow-800 mb-2">
                    Fire Guide charges a 15% commission on each booking. Your listed prices are what customers pay, and you receive 85%.
                  </p>
                  <p className="text-sm text-yellow-900 font-medium">
                    Example: £100 booking = £85 for you
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tips */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Pricing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>Stay within market range for more bookings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>Higher prices may reduce booking frequency</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>Lower prices attract more customers</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>You can adjust prices anytime</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Price</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this price? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeletePrice}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeletePrice}
            >
              Sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
