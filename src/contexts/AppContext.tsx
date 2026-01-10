import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isAuthenticated, getUserInfo, setUserInfo, removeAuthToken } from "../lib/auth";

export interface Booking {
  id: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  location: string;
  price: string;
  professionalEmail: string;
  professionalPhone: string;
  bookingRef: string;
  hasReport?: boolean;
  professionalImage?: string;
  professionalType?: "individual" | "company";
}

export interface Payment {
  id: string;
  date: string;
  service: string;
  professional: string;
  amount: string;
  status: "paid" | "refunded" | "pending";
  paymentMethod: string;
  invoiceNumber: string;
  bookingRef: string;
}

export interface User {
  name: string;
  role: "customer" | "professional" | "admin";
}

interface AppContextType {
  selectedService: string;
  setSelectedService: (service: string) => void;
  questionnaireData: {
    property_type_id: number;
    approximate_people_id: number;
    number_of_floors: string;
    preferred_date: string;
    access_note: string;
  } | null;
  setQuestionnaireData: (data: any) => void;
  selectedProfessional: any;
  setSelectedProfessional: (professional: any) => void;
  selectedProfessionalId: number | null;
  setSelectedProfessionalId: (id: number | null) => void;
  bookingProfessional: any;
  setBookingProfessional: (professional: any) => void;
  isCustomerLoggedIn: boolean;
  setIsCustomerLoggedIn: (value: boolean) => void;
  customerBookings: Booking[];
  setCustomerBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  customerPayments: Payment[];
  setCustomerPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  bookingData: any;
  setBookingData: (data: any) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addBooking: (booking: Booking) => void;
  addPayment: (payment: Payment) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  deleteBooking: (bookingId: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
  const [bookingProfessional, setBookingProfessional] = useState<any>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  
  // Load bookings and payments from localStorage on mount
  const loadBookingsFromStorage = (): Booking[] => {
    try {
      const stored = localStorage.getItem('customer_bookings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading bookings from localStorage:', error);
    }
    return [];
  };

  const loadPaymentsFromStorage = (): Payment[] => {
    try {
      const stored = localStorage.getItem('customer_payments');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading payments from localStorage:', error);
    }
    return [];
  };

  const [customerBookings, setCustomerBookings] = useState<Booking[]>(loadBookingsFromStorage);
  const [customerPayments, setCustomerPayments] = useState<Payment[]>(loadPaymentsFromStorage);
  const [bookingData, setBookingData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Save bookings to localStorage whenever they change (debounced to avoid excessive writes)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('customer_bookings', JSON.stringify(customerBookings));
      } catch (error) {
        console.error('Error saving bookings to localStorage:', error);
      }
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeoutId);
  }, [customerBookings]);

  // Save payments to localStorage whenever they change (debounced to avoid excessive writes)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('customer_payments', JSON.stringify(customerPayments));
      } catch (error) {
        console.error('Error saving payments to localStorage:', error);
      }
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeoutId);
  }, [customerPayments]);

  // Initialize auth state on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const userInfo = getUserInfo();
      if (userInfo) {
        setCurrentUser({ name: userInfo.name, role: userInfo.role });
        setIsCustomerLoggedIn(userInfo.role === "customer");
      } else {
        removeAuthToken();
      }
    }
  }, []);

  const addBooking = (booking: Booking) => {
    setCustomerBookings(prev => [booking, ...prev]);
  };

  const addPayment = (payment: Payment) => {
    setCustomerPayments(prev => [payment, ...prev]);
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setCustomerBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      )
    );
  };

  const deleteBooking = (bookingId: string) => {
    setCustomerBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsCustomerLoggedIn(false);
    setCustomerBookings([]);
    setCustomerPayments([]);
    // Clear localStorage on logout
    try {
      localStorage.removeItem('customer_bookings');
      localStorage.removeItem('customer_payments');
    } catch (error) {
      console.error('Error clearing localStorage on logout:', error);
    }
    removeAuthToken();
  };

  const value: AppContextType = {
    selectedService,
    setSelectedService,
    questionnaireData,
    setQuestionnaireData,
    selectedProfessional,
    setSelectedProfessional,
    selectedProfessionalId,
    setSelectedProfessionalId,
    bookingProfessional,
    setBookingProfessional,
    isCustomerLoggedIn,
    setIsCustomerLoggedIn,
    customerBookings,
    setCustomerBookings,
    customerPayments,
    setCustomerPayments,
    bookingData,
    setBookingData,
    currentUser,
    setCurrentUser,
    addBooking,
    addPayment,
    updateBooking,
    deleteBooking,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

