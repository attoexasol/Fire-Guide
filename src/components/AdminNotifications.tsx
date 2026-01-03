import React, { useState } from "react";
import { Bell, Users, DollarSign, AlertCircle, CheckCircle, Info, Trash2, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "user" | "professional" | "payment" | "system" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "critical";
  recipientType?: string;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "alert",
      title: "High Volume Alert",
      message: "Platform experiencing 200% increase in booking requests today",
      timestamp: "10 minutes ago",
      read: false,
      priority: "high",
      recipientType: "Platform Alert"
    },
    {
      id: 2,
      type: "professional",
      title: "New Professional Application",
      message: "5 new professionals awaiting approval for Fire Risk Assessment services",
      timestamp: "30 minutes ago",
      read: false,
      priority: "medium",
      recipientType: "Professional Alert"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Dispute Opened",
      message: "Customer #4521 has opened a dispute for booking #1234",
      timestamp: "1 hour ago",
      read: false,
      priority: "critical",
      recipientType: "Payment Alert"
    },
    {
      id: 4,
      type: "user",
      title: "Customer Support Ticket",
      message: "New high-priority support ticket from ABC Office Ltd",
      timestamp: "2 hours ago",
      read: true,
      priority: "high",
      recipientType: "Customer Alert"
    },
    {
      id: 5,
      type: "system",
      title: "Database Backup Complete",
      message: "Automated daily backup completed successfully at 3:00 AM",
      timestamp: "5 hours ago",
      read: true,
      priority: "low",
      recipientType: "System Alert"
    },
    {
      id: 6,
      type: "payment",
      title: "Payout Processed",
      message: "£25,450 distributed to 42 professionals",
      timestamp: "1 day ago",
      read: true,
      priority: "medium",
      recipientType: "Payment Alert"
    },
    {
      id: 7,
      type: "professional",
      title: "Professional Suspended",
      message: "John Smith's account suspended due to policy violation",
      timestamp: "2 days ago",
      read: true,
      priority: "high",
      recipientType: "Professional Alert"
    },
    {
      id: 8,
      type: "user",
      title: "Surge in New Registrations",
      message: "150 new customer accounts created in the last 24 hours",
      timestamp: "3 days ago",
      read: true,
      priority: "medium",
      recipientType: "Customer Alert"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all_users");
  const [notificationPriority, setNotificationPriority] = useState("medium");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="w-5 h-5 text-blue-600" />;
      case "professional":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "system":
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
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

  const sendNotification = () => {
    if (!notificationTitle || !notificationMessage) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success(`Notification sent to ${recipientType.replace('_', ' ')}`);
    setIsComposeOpen(false);
    setNotificationTitle("");
    setNotificationMessage("");
    setRecipientType("all_users");
    setNotificationPriority("medium");
  };

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filterNotifications(activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ROOT MOBILE FRAME: 375×812, 16px L/R padding, 16px top, 24px bottom */}
      <div className="w-full max-w-[375px] mx-auto px-4 pt-4 pb-6 md:max-w-none md:px-0 md:pt-6">
        
        {/* VERTICAL AUTO LAYOUT - 14px spacing between major sections */}
        <div className="flex flex-col gap-3.5">
          
          {/* 1. HEADER TEXT */}
          <div>
            <h1 className="text-2xl font-semibold text-[#0A1A2F]">Notifications</h1>
            <p className="text-sm text-gray-500 mt-2">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>

          {/* 2. BUTTON GROUP - Vertical stack with 10px spacing */}
          <div className="flex flex-col gap-2.5 md:flex-row md:gap-2">
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-sm font-medium justify-center rounded-lg md:w-auto md:h-10">
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[92%] max-w-[360px] mx-auto p-4 pb-5 max-h-[85vh] overflow-y-auto md:max-w-2xl md:p-6">
                <DialogHeader className="text-center mb-3 md:text-left">
                  <DialogTitle className="text-lg leading-tight pr-6">Send Platform Notification</DialogTitle>
                  <DialogDescription className="text-sm mt-1.5">
                    Send a notification to users or professionals on the platform
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <div>
                    <Label htmlFor="recipient" className="text-sm font-medium text-gray-700 mb-1.5 block">Recipient Type</Label>
                    <Select value={recipientType} onValueChange={setRecipientType}>
                      <SelectTrigger id="recipient" className="w-full h-11 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_users">All Users (Customers & Professionals)</SelectItem>
                        <SelectItem value="customers">All Customers</SelectItem>
                        <SelectItem value="professionals">All Professionals</SelectItem>
                        <SelectItem value="active_professionals">Active Professionals Only</SelectItem>
                        <SelectItem value="new_users">New Users (Last 7 days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm font-medium text-gray-700 mb-1.5 block">Priority Level</Label>
                    <Select value={notificationPriority} onValueChange={setNotificationPriority}>
                      <SelectTrigger id="priority" className="w-full h-11 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Informational</SelectItem>
                        <SelectItem value="medium">Medium - Standard</SelectItem>
                        <SelectItem value="high">High - Important</SelectItem>
                        <SelectItem value="critical">Critical - Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1.5 block">Notification Title</Label>
                    <Input
                      id="title"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      className="w-full h-11 text-sm"
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1.5 block">Message</Label>
                    <Textarea
                      id="message"
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      className="w-full min-h-[96px] text-sm resize-none"
                      rows={4}
                      placeholder="Enter notification message"
                    />
                  </div>

                  <div className="flex flex-row gap-2 justify-end pt-2 md:gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsComposeOpen(false)}
                      className="w-[48%] h-11 text-sm md:w-auto md:h-10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={sendNotification} 
                      className="w-[48%] h-11 bg-red-600 hover:bg-red-700 text-sm md:w-auto md:h-10"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={markAllAsRead} 
                className="w-full h-11 text-sm font-medium justify-center rounded-lg border-gray-300 md:w-auto md:h-10"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}

            {notifications.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearAll} 
                className="w-full h-11 text-sm font-medium justify-center rounded-lg border-gray-300 md:w-auto md:h-10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* 3. STATS CARDS - Clean vertical stack, NO floating icons, 12px spacing */}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-4 md:gap-4">
            <Card className="w-full border-gray-200 shadow-sm rounded-lg">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-1">Total Notifications</p>
                <p className="text-3xl font-semibold text-[#0A1A2F]">{notifications.length}</p>
              </CardContent>
            </Card>

            <Card className="w-full border-gray-200 shadow-sm rounded-lg">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-1">Unread</p>
                <p className="text-3xl font-semibold text-[#0A1A2F]">{unreadCount}</p>
              </CardContent>
            </Card>

            <Card className="w-full border-gray-200 shadow-sm rounded-lg">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-1">Critical</p>
                <p className="text-3xl font-semibold text-[#0A1A2F]">
                  {notifications.filter(n => n.priority === "critical").length}
                </p>
              </CardContent>
            </Card>

            <Card className="w-full border-gray-200 shadow-sm rounded-lg">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-1">System Alerts</p>
                <p className="text-3xl font-semibold text-[#0A1A2F]">
                  {notifications.filter(n => n.type === "system").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 4. TABS - Horizontal scroll, 44px height, 72px min width per tab */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="w-full overflow-x-auto -mx-4 px-4 scrollbar-hide md:mx-0 md:px-0">
              <TabsList className="inline-flex h-11 gap-1 bg-gray-100 p-1 rounded-lg md:grid md:w-full md:grid-cols-7">
                <TabsTrigger 
                  value="all" 
                  className="flex items-center justify-center gap-1.5 min-w-[72px] px-3 text-sm whitespace-nowrap rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  All
                  {notifications.length > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-gray-300 text-gray-700 rounded-full text-[10px] font-medium">
                      {notifications.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="flex items-center justify-center gap-1.5 min-w-[72px] px-3 text-sm whitespace-nowrap rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Unread
                  {unreadCount > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-100 text-red-700 rounded-full text-[10px] font-medium">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="user" 
                  className="flex items-center justify-center min-w-[72px] px-3 text-sm whitespace-nowrap rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="professional" 
                  className="flex items-center justify-center min-w-[72px] px-3 text-sm whitespace-nowrap rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Professionals
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  className="flex items-center justify-center min-w-[72px] px-3 text-sm whitespace-nowrap rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Payments
                </TabsTrigger>
                <TabsTrigger 
                  value="alert" 
                  className="flex items-center justify-center min-w-[72px] px-3 text-sm whitespace-nowrap rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Alerts
                </TabsTrigger>
                <TabsTrigger 
                  value="system" 
                  className="flex items-center justify-center min-w-[72px] px-3 text-sm whitespace-nowrap rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  System
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 5. NOTIFICATION ALERT CARDS - Vertical layout, 16px padding */}
            <TabsContent value={activeTab} className="mt-3.5">
              {filteredNotifications.length === 0 ? (
                <Card className="w-full border-gray-200 shadow-sm rounded-lg">
                  <CardContent className="p-12 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-sm text-gray-500">
                      {activeTab === "unread" 
                        ? "You're all caught up! No unread notifications."
                        : "You don't have any notifications in this category."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredNotifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`w-full shadow-sm rounded-lg transition-shadow hover:shadow-md ${
                        !notification.read 
                          ? 'border-l-[3px] border-l-red-600 bg-red-50/50 border-y border-r border-gray-200' 
                          : 'border border-gray-200'
                      } ${
                        notification.priority === 'critical' 
                          ? 'ring-2 ring-red-400 ring-offset-1' 
                          : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        {/* Vertical Layout - Icon → Title → Description → Timestamp */}
                        <div className="flex flex-col">
                          {/* Icon + Title Row */}
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900 break-words flex-1 leading-tight`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Priority Badge */}
                          <div className="mb-1.5 ml-7">
                            <Badge 
                              className={`${getPriorityColor(notification.priority)} text-[11px] px-2 py-0.5 font-medium`} 
                              variant="outline"
                            >
                              {notification.priority}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 leading-relaxed break-words ml-7 mb-2">
                            {notification.message}
                          </p>

                          {/* Recipient Badge */}
                          {notification.recipientType && (
                            <div className="ml-7 mb-2">
                              <Badge variant="outline" className="text-[11px] px-2 py-0.5 bg-gray-50 border-gray-300">
                                {notification.recipientType}
                              </Badge>
                            </div>
                          )}

                          {/* Timestamp + Actions */}
                          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400 ml-7">{notification.timestamp}</p>
                            
                            <div className="flex flex-col gap-2 ml-7">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="w-full h-9 justify-start text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 mr-2" />
                                  Mark as read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="w-full h-9 justify-start text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Delete
                              </Button>
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
      </div>
    </div>
  );
}