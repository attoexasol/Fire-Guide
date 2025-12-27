import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";

export interface Service {
  id: number;
  name: string;
  icon?: string;
  iconComponent?: LucideIcon;
  description: string;
  basePrice: string;
  popular?: boolean;
  active?: boolean;
  category?: string;
  color?: string;
}

interface ServiceCardProps {
  service: Service;
  variant?: "default" | "admin" | "customer" | "professional";
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: () => void;
  showActions?: boolean;
}

export function ServiceCard({
  service,
  variant = "default",
  onEdit,
  onDelete,
  onClick,
  showActions = true
}: ServiceCardProps) {
  const colorClasses = {
    red: "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
  };

  const isClickable = variant !== "admin" && onClick;
  const isAdmin = variant === "admin";

  return (
    <Card
      onClick={isClickable ? onClick : undefined}
      className={`
        border-2 border-transparent rounded-xl transition-all
        ${isClickable ? "cursor-pointer hover:shadow-2xl hover:border-red-100 group" : "shadow-md"}
      `}
    >
      {/* Card Header - 16px padding from all edges */}
      <CardHeader className="p-4 pb-3">
        {/* Top Row: Icon + Title + Buttons */}
        <div className="flex items-start gap-3">
          {/* Icon - 56px (follows 8px grid: 7 × 8 = 56px) */}
          {service.iconComponent && (
            <div
              className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                service.color && colorClasses[service.color as keyof typeof colorClasses]
                  ? colorClasses[service.color as keyof typeof colorClasses]
                  : "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"
              }`}
            >
              <service.iconComponent className="w-7 h-7" />
            </div>
          )}
          {service.icon && !service.iconComponent && (
            <span className="text-3xl leading-none flex-shrink-0">{service.icon}</span>
          )}

          {/* Title + Buttons Container - fills remaining space */}
          <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
            {/* Title Section - flexible width */}
            <div className="flex-1 min-w-0">
              <CardTitle
                className={`text-base font-semibold leading-tight truncate ${
                  isClickable ? "group-hover:text-red-600 transition-colors" : "text-[#0A1A2F]"
                }`}
                title={service.name}
              >
                {service.name}
              </CardTitle>
              
              {/* Badges Row - only for non-admin views, moved below title */}
              {!isAdmin && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {service.active === true && (
                    <Badge className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg h-6">
                      Active
                    </Badge>
                  )}
                  {service.active === false && (
                    <Badge className=" text-white text-xs px-2 py-1 rounded-lg h-6">
                      Inactive
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Edit/Delete Buttons - flex-shrink-0 prevents squeezing */}
            {isAdmin && showActions && (
              <div className="flex gap-2 flex-shrink-0">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(service.id);
                    }}
                    className="h-8 px-2.5 sm:px-3 text-xs bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                  >
                    <Edit className="w-3 h-3 sm:mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(service.id);
                    }}
                    className="h-8 px-2.5 sm:px-3 text-xs bg-white border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-sm"
                  >
                    <Trash2 className="w-3 h-3 sm:mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Card Content - 16px horizontal padding, bottom padding */}
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          {/* Description - 12px font, gray-600 color */}
          <p className="text-xs text-gray-600 leading-relaxed">
            {service.description}
          </p>

          {/* Price Section - 12px spacing above */}
          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-xs text-gray-500 mb-1">Starting from</p>
              <p className={`text-base font-bold leading-none ${
                service.active === false ? "text-gray-400" : "text-red-600"
              }`}>
                {service.basePrice}
              </p>
            </div>

            {/* Category Badge (if exists) */}
            {service.category && (
              <Badge variant="outline" className="text-xs px-2 py-1 rounded-lg h-6">
                {service.category}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
