import { Lock, Layers, Zap, BookOpen } from "lucide-react";

export function TrustIndicators() {
  return (
    <div className="bg-[#0A1A2F] border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white text-xl">Experienced Fire Safety Professionals</h3>
            </div>
            <p className="text-white/70">Connect with independent fire safety professionals who declare relevant experience, qualifications, and service history when joining the platform.</p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white text-xl">Complete Fire Safety Services</h3>
            </div>
            <p className="text-white/70">Fire risk assessments, alarms, emergency lighting, extinguishers, training, and fire safety consultation — all accessible through one platform.</p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white text-xl">Simple & Efficient Booking</h3>
            </div>
            <p className="text-white/70">Request services, manage appointments, and access reports and records quickly — without chasing multiple contractors.</p>
          </div>

          {/* Feature 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white text-xl">Designed Around Fire Safety Responsibilities</h3>
            </div>
            <p className="text-white/70">Services structured to support dutyholders in understanding and meeting their fire safety responsibilities, based on the nature and use of their premises.</p>
          </div>

        </div>
        
        {/* Helper Text */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Fire Guide is a booking and management platform that connects customers with independent fire safety professionals. Services are delivered by the professionals listed on the platform.
          </p>
        </div>
      </div>
    </div>
  );
}