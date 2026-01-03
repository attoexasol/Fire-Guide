import { Card, CardContent } from "./ui/card";
import { Star, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FeaturedProfessionalsProps {
  onViewProfile: () => void;
}

export function FeaturedProfessionals({ onViewProfile }: FeaturedProfessionalsProps) {
  const professionals = [
    {
      name: "James Mitchell",
      specialty: "Fire Risk Assessment",
      location: "London",
      rating: 4.9,
      reviews: 127,
      completedJobs: 450,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      certifications: ["NEBOSH", "Fire Safety Level 4"],
      responseTime: "< 2 hours",
      startingPrice: "£150"
    },
    {
      name: "Emma Richardson",
      specialty: "Fire Alarm Systems",
      location: "Manchester",
      rating: 5.0,
      reviews: 98,
      completedJobs: 320,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      certifications: ["FIA Certified", "ECS Gold Card"],
      responseTime: "< 1 hour",
      startingPrice: "£120"
    },
    {
      name: "Robert Davies",
      specialty: "Fire Extinguisher Service",
      location: "Birmingham",
      rating: 4.8,
      reviews: 156,
      completedJobs: 580,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      certifications: ["BAFE Approved", "CFPA Certified"],
      responseTime: "< 3 hours",
      startingPrice: "£80"
    },
    {
      name: "Sophie Anderson",
      specialty: "Fire Marshal Training",
      location: "Leeds",
      rating: 5.0,
      reviews: 84,
      completedJobs: 210,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
      certifications: ["Accredited Trainer", "IOSH Certified"],
      responseTime: "< 2 hours",
      startingPrice: "£250"
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-[42px] font-[800] leading-[130%] tracking-[-0.01em] mt-3 mb-2">
            Featured Fire Safety Professionals
          </h2>
          <p className="text-[16px] leading-[140%] text-[#666] max-w-2xl mx-auto">
            Independent, experienced, and highly-rated experts ready to help with your fire safety needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((professional, index) => (
            <div 
              key={index} 
              className="transition-all cursor-pointer group flex flex-col"
              onClick={onViewProfile}
            >
              {/* Professional Image - Full Width Block */}
              <div className="relative w-full overflow-hidden">
                <ImageWithFallback
                  src={professional.image}
                  alt={professional.name}
                  className="w-full h-[200px] md:h-48 object-cover block"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{professional.rating}</span>
                </div>
              </div>

              {/* Content Section - White Background */}
              <div className="p-5 bg-white border-2 border-transparent group-hover:border-red-100 transition-all">
                {/* Name & Specialty */}
                <div>
                  <h3 className="text-lg mb-1 group-hover:text-red-600 transition-colors">
                    {professional.name}
                  </h3>
                  <p className="text-red-600 font-semibold mb-2">{professional.specialty}</p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{professional.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span>{professional.reviews} reviews</span>
                    <span>{professional.completedJobs} jobs</span>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {professional.certifications.map((cert, i) => (
                      <div key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {cert}
                      </div>
                    ))}
                  </div>

                  {/* Response Time & Price */}
                  <div className="border-t pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Response time</p>
                      <p className="font-semibold text-sm">{professional.responseTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-xl font-semibold text-red-600">{professional.startingPrice}</p>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 group-hover:shadow-lg">
                    View Profile <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={onViewProfile}
            variant="outline" 
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-6 text-lg"
          >
            Browse All Professionals <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}