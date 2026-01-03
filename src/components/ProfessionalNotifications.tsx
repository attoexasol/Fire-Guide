import React, { useState } from "react";
import { Bell, Calendar, DollarSign, AlertCircle, CheckCircle, Info, Trash2, Filter, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "booking" | "payment" | "system" | "review";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export function ProfessionalNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "booking",
      title: "New Booking Request",
      message: "ABC Office Ltd has requested a Fire Risk Assessment for tomorrow at 10:00 AM",
      timestamp: "2 minutes ago",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message: "£450 has been added to your account for job #1234",
      timestamp: "1 hour ago",
      read: false,
      priority: "medium"
    },
    {
      id: 3,
      type: "booking",
      title: "Booking Confirmed",
      message: "XYZ Retail Shop confirmed their appointment for Nov 22 at 2:00 PM",
      timestamp: "3 hours ago",
      read: true,
      priority: "medium"
    },
    {
      id: 4,
      type: "review",
      title: "New Review Received",
      message: "Sarah Johnson left a 5-star review for your Fire Extinguisher Service",
      timestamp: "5 hours ago",
      read: true,
      priority: "low"
    },
    {
      id: 5,
      type: "payment",
      title: "Payout Processed",
      message: "Your weekly payout of £1,250 has been transferred to your bank account",
      timestamp: "1 day ago",
      read: true,
      priority: "high"
    },
    {
      id: 6,
      type: "system",
      title: "Profile Update Required",
      message: "Please update your certifications. Some documents will expire in 30 days",
      timestamp: "2 days ago",
      read: false,
      priority: "high"
    },
    {
      id: 7,
      type: "booking",
      title: "Booking Cancelled",
      message: "Customer cancelled the appointment scheduled for Nov 21 at 9:00 AM",
      timestamp: "2 days ago",
      read: true,
      priority: "medium"
    },
    {
      id: 8,
      type: "system",
      title: "Platform Maintenance",
      message: "Scheduled maintenance on Nov 25 from 2:00 AM to 4:00 AM",
      timestamp: "3 days ago",
      read: true,
      priority: "low"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "review":
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case "system":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filterNotifications(activeTab);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-[#0A1A2F] mb-2">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={clearAll} className="text-sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
          <TabsTrigger value="all" className="relative text-xs md:text-sm">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-1 md:ml-2 px-1.5 py-0.5 text-xs">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative text-xs md:text-sm">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 md:ml-2 px-1.5 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="booking" className="text-xs md:text-sm">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-xs md:text-sm">
            Payments
          </TabsTrigger>
          <TabsTrigger value="review" className="text-xs md:text-sm">
            Reviews
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs md:text-sm">
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 w-full">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">
                  {activeTab === "unread" 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications in this category."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 w-full">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md w-full ${!notification.read ? 'border-l-4 border-l-red-600 bg-red-50/30' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="mt-1 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className={`${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900 break-words`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 break-words">
                              {notification.message}
                            </p>
                          </div>
                          
                          <Badge className={`${getPriorityColor(notification.priority)} flex-shrink-0`} variant="outline">
                            {notification.priority}
                          </Badge>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <p className="text-xs text-gray-400">{notification.timestamp}</p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs h-8"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}