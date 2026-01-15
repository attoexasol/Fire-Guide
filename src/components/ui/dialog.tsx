import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  onClick?: () => void;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out" 
        onClick={() => onOpenChange?.(false)}
        style={{ animation: 'fadeIn 0.2s ease-in-out' }}
      />
      <div 
        className="relative z-50 transition-all duration-300 ease-in-out"
        style={{ animation: 'slideUp 0.3s ease-in-out' }}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export function DialogTrigger({ children, className = "", onClick }: DialogTriggerProps) {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
}

export function DialogContent({ children, className = "", style }: DialogContentProps) {
  // Check if className contains a max-w class or custom class, if so don't apply default max-w-lg and w-full
  const hasMaxWidth = className.includes('max-w-') || className.includes('booking-details-modal');
  const defaultMaxWidth = hasMaxWidth ? '' : 'max-w-lg';
  const defaultWidth = hasMaxWidth ? '' : 'w-full';
  
  // Merge inline styles with any existing styles
  const mergedStyle = style || {};
  
  return (
    <div className={`bg-white rounded-xl shadow-2xl ${defaultMaxWidth} ${defaultWidth} mx-4 ${className}`} style={mergedStyle}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = "" }: DialogHeaderProps) {
  return (
    <div className={`px-6 pt-6 pb-4 ${className}`}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = "" }: DialogFooterProps) {
  return (
    <div className={`px-6 pb-6 flex justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = "" }: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-gray-600 mt-2 ${className}`}>
      {children}
    </p>
  );
}