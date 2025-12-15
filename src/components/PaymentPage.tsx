import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Flame, 
  CreditCard, 
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  Lock,
  AlertCircle,
  Calendar,
  User
} from "lucide-react";
import type { BookingData } from "./BookingFlow";

interface PaymentPageProps {
  bookingData: BookingData;
  onPaymentComplete: () => void;
  onBack: () => void;
}

export function PaymentPage({
  bookingData,
  onPaymentComplete,
  onBack
}: PaymentPageProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.match(/.{1,4}/g)?.join(" ") || digits;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return digits.substring(0, 2) + "/" + digits.substring(2, 4);
    }
    return digits;
  };

  const updateCardNumber = (value: string) => {
    setCardNumber(formatCardNumber(value));
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" });
  };

  const updateExpiryDate = (value: string) => {
    setExpiryDate(formatExpiryDate(value));
    if (errors.expiryDate) setErrors({ ...errors, expiryDate: "" });
  };

  const updateCvv = (value: string) => {
    const digits = value.replace(/\D/g, "").substring(0, 3);
    setCvv(digits);
    if (errors.cvv) setErrors({ ...errors, cvv: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Please enter a valid card number";
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = "Please enter a valid expiry date";
    }
    if (cvv.length !== 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    onPaymentComplete();
  };

  const { service, professional, selectedDate, selectedTime, customer, pricing } = bookingData;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-[#0A1A2F] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Flame className="w-8 h-8 text-red-500" />
          <span className="text-xl">Fire Guide</span>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white py-6 px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">Select Date & Time</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600">Your Details</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm font-medium text-red-600">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>

          <h1 className="text-[#0A1A2F] mb-8">Secure Payment</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Security Badge */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Secure Payment</p>
                      <p className="text-sm text-green-700">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Card Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => updateCardNumber(e.target.value)}
                          className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    {/* Cardholder Name */}
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="cardName"
                          placeholder="Name on card"
                          value={cardName}
                          onChange={(e) => {
                            setCardName(e.target.value);
                            if (errors.cardName) setErrors({ ...errors, cardName: "" });
                          }}
                          className={`pl-10 ${errors.cardName ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.cardName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.cardName}
                        </p>
                      )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => updateExpiryDate(e.target.value)}
                            className={`pl-10 ${errors.expiryDate ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.expiryDate && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => updateCvv(e.target.value)}
                            maxLength={3}
                            className={`pl-10 ${errors.cvv ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.cvv && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Security Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                      <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-900">
                        We don't store your card details. All payments are processed securely through Stripe.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                      defaultChecked
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-red-600 hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>.
                      I understand that payment will be charged immediately upon confirmation.
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1A2F]">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Service */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Service</p>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.propertyType}</p>
                      </div>

                      {/* Professional */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Professional</p>
                        <div className="flex items-center gap-3">
                          <img
                            src={professional.photo}
                            alt={professional.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{professional.name}</p>
                            <p className="text-xs text-gray-600">{professional.rating} ⭐</p>
                          </div>
                        </div>
                      </div>

                      {/* Appointment */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Appointment</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {new Date(selectedDate).toLocaleDateString('en-GB', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short'
                          })}
                        </p>
                        <p className="text-sm text-gray-700">{selectedTime}</p>
                      </div>

                      {/* Customer */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Customer</p>
                        <p className="font-medium text-gray-900 text-sm">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-gray-600">{customer.email}</p>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Service fee</span>
                          <span className="text-gray-900">£{pricing.servicePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Platform fee</span>
                          <span className="text-gray-900">£{pricing.platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t">
                          <span className="font-semibold text-gray-900">Total to pay</span>
                          <span className="text-2xl font-semibold text-gray-900">£{pricing.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg"
                >
                  {processing ? (
                    <>
                      <span className="animate-pulse">Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay £{pricing.total.toFixed(2)}
                    </>
                  )}
                </Button>

                {/* Money Back Guarantee */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 text-sm mb-1">100% Money-back guarantee</p>
                        <p className="text-xs text-green-700">
                          If you're not satisfied with the service, we'll refund you in full.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
