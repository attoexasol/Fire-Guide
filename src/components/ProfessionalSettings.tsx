import React, { useState } from "react";
import { Save, User, Bell, Lock, CreditCard, Mail, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

export function ProfessionalSettings() {
  // Account Settings
  const [fullName, setFullName] = useState("John Smith");
  const [email, setEmail] = useState("john.smith@example.com");
  const [phone, setPhone] = useState("+44 7700 900123");
  const [address, setAddress] = useState("123 Fire Safety Street, London, SW1A 1AA");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showPhoneNumber, setShowPhoneNumber] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [allowReviews, setAllowReviews] = useState(true);

  // Payout Settings
  const [accountHolderName, setAccountHolderName] = useState("John Smith");
  const [sortCode, setSortCode] = useState("12-34-56");
  const [accountNumber, setAccountNumber] = useState("12345678");

  const handleSaveAccount = () => {
    toast.success("Account settings saved successfully!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved successfully!");
  };

  const handleSavePrivacy = () => {
    toast.success("Privacy settings saved successfully!");
  };

  const handleSavePayout = () => {
    toast.success("Payout settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#0A1A2F] mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative mt-2">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={handleSaveAccount} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Account Settings
          </Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10"
                placeholder="Enter new password"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <Button onClick={handleChangePassword} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
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
              <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
            </div>
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive browser notifications</p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Booking Alerts</p>
              <p className="text-sm text-gray-500">Notify me of new bookings and changes</p>
            </div>
            <Switch
              checked={bookingAlerts}
              onCheckedChange={setBookingAlerts}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Payment Alerts</p>
              <p className="text-sm text-gray-500">Notify me of payments and payouts</p>
            </div>
            <Switch
              checked={paymentAlerts}
              onCheckedChange={setPaymentAlerts}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Emails</p>
              <p className="text-sm text-gray-500">Receive tips and promotional offers</p>
            </div>
            <Switch
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
            />
          </div>

          <Button onClick={handleSaveNotifications} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Notification Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to all customers</SelectItem>
                <SelectItem value="limited">Limited - Visible in search results only</SelectItem>
                <SelectItem value="private">Private - Not visible to customers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Show Phone Number</p>
              <p className="text-sm text-gray-500">Display phone number on public profile</p>
            </div>
            <Switch
              checked={showPhoneNumber}
              onCheckedChange={setShowPhoneNumber}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Show Email Address</p>
              <p className="text-sm text-gray-500">Display email address on public profile</p>
            </div>
            <Switch
              checked={showEmail}
              onCheckedChange={setShowEmail}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Allow Customer Reviews</p>
              <p className="text-sm text-gray-500">Let customers leave reviews on your profile</p>
            </div>
            <Switch
              checked={allowReviews}
              onCheckedChange={setAllowReviews}
            />
          </div>

          <Button onClick={handleSavePrivacy} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Privacy Settings
          </Button>
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Changes to payout details may take 1-2 business days to process. Ensure all information is accurate.
            </p>
          </div>

          <div>
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortCode">Sort Code</Label>
              <Input
                id="sortCode"
                value={sortCode}
                onChange={(e) => setSortCode(e.target.value)}
                className="mt-2"
                placeholder="12-34-56"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-2"
                placeholder="12345678"
              />
            </div>
          </div>

          <Button onClick={handleSavePayout} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Payout Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}