import React, { useState } from "react";
import { Save, Globe, Search, Zap, Bell, Shield, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

export function AdminSettings() {
  const [seoTitle, setSeoTitle] = useState("Fire Guide - Book Fire Safety Services Instantly");
  const [seoDescription, setSeoDescription] = useState("Compare and book qualified fire safety professionals in your area. Instant booking, secure payment, transparent pricing.");
  const [keywords, setKeywords] = useState("fire safety, fire risk assessment, fire equipment, emergency lighting");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@fireguide.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [bookingBuffer, setBookingBuffer] = useState("24");
  const [cancellationWindow, setCancellationWindow] = useState("48");
  const [stripePublicKey, setStripePublicKey] = useState("pk_test_************************");
  const [stripeSecretKey, setStripeSecretKey] = useState("sk_test_************************");
  const [currency, setCurrency] = useState("GBP");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  const handleSaveSEO = () => {
    toast.success("SEO settings saved successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully!");
  };

  const handleSaveSystem = () => {
    toast.success("System settings saved successfully!");
  };

  const handleSavePayment = () => {
    toast.success("Payment settings saved successfully!");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully!");
  };

  const handleClearCache = () => {
    toast.success("Cache cleared successfully!");
  };

  const handleResetStats = () => {
    toast.error("This action cannot be performed in demo mode.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Platform Settings</h1>
        <p className="text-gray-600">Configure platform-wide settings and preferences</p>
      </div>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <Globe className="w-5 h-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seo-title">Meta Title</Label>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="mt-2"
              placeholder="Page title for search engines"
            />
            <p className="text-sm text-gray-500 mt-1">{seoTitle.length}/60 characters</p>
          </div>

          <div>
            <Label htmlFor="seo-description">Meta Description</Label>
            <Textarea
              id="seo-description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="mt-2"
              rows={3}
              placeholder="Description shown in search results"
            />
            <p className="text-sm text-gray-500 mt-1">{seoDescription.length}/160 characters</p>
          </div>

          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              className="mt-2"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="fire safety, fire risk assessment, fire equipment"
            />
          </div>

          <Button onClick={handleSaveSEO} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save SEO Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Send email notifications to users</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Send SMS alerts for urgent updates</p>
            </div>
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="admin-email">Admin Alert Email</Label>
            <Input
              id="admin-email"
              type="email"
              className="mt-2"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@fireguide.com"
            />
            <p className="text-sm text-gray-500 mt-1">Receive important platform alerts</p>
          </div>

          <Button onClick={handleSaveNotifications} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <Zap className="w-5 h-5" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Temporarily disable public access to the platform</p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-Approve Professionals</p>
              <p className="text-sm text-gray-500">Automatically approve new professional registrations</p>
            </div>
            <Switch
              checked={autoApprove}
              onCheckedChange={setAutoApprove}
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="booking-buffer">Booking Buffer Time (hours)</Label>
            <Input
              id="booking-buffer"
              type="number"
              className="mt-2"
              value={bookingBuffer}
              onChange={(e) => setBookingBuffer(e.target.value)}
              placeholder="24"
            />
            <p className="text-sm text-gray-500 mt-1">Minimum notice required for bookings</p>
          </div>

          <div>
            <Label htmlFor="cancellation-window">Cancellation Window (hours)</Label>
            <Input
              id="cancellation-window"
              type="number"
              className="mt-2"
              value={cancellationWindow}
              onChange={(e) => setCancellationWindow(e.target.value)}
              placeholder="48"
            />
            <p className="text-sm text-gray-500 mt-1">Hours before appointment when cancellations are allowed</p>
          </div>

          <Button onClick={handleSaveSystem} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save System Settings
          </Button>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="stripe-key">Stripe Public Key</Label>
            <Input
              id="stripe-key"
              type="password"
              className="mt-2"
              value={stripePublicKey}
              onChange={(e) => setStripePublicKey(e.target.value)}
              placeholder="pk_test_..."
            />
          </div>

          <div>
            <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
            <Input
              id="stripe-secret"
              type="password"
              className="mt-2"
              value={stripeSecretKey}
              onChange={(e) => setStripeSecretKey(e.target.value)}
              placeholder="sk_test_..."
            />
          </div>

          <div>
            <Label htmlFor="currency">Default Currency</Label>
            <Input
              id="currency"
              className="mt-2"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="GBP"
            />
          </div>

          <Button onClick={handleSavePayment} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Payment Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input
              id="session-timeout"
              type="number"
              className="mt-2"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              placeholder="30"
            />
            <p className="text-sm text-gray-500 mt-1">Automatically log out inactive users</p>
          </div>

          <div>
            <Label htmlFor="max-attempts">Max Login Attempts</Label>
            <Input
              id="max-attempts"
              type="number"
              className="mt-2"
              value={maxLoginAttempts}
              onChange={(e) => setMaxLoginAttempts(e.target.value)}
              placeholder="5"
            />
            <p className="text-sm text-gray-500 mt-1">Lock account after failed attempts</p>
          </div>

          <Button onClick={handleSaveSecurity} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Clear All Cache</p>
              <p className="text-sm text-gray-600">Remove all cached data from the platform</p>
            </div>
            <Button onClick={handleClearCache} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Clear Cache
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Reset Platform Statistics</p>
              <p className="text-sm text-gray-600">Reset all analytics and statistics (cannot be undone)</p>
            </div>
            <Button onClick={handleResetStats} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Reset Stats
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}