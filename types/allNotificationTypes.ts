// types\allNotificationTypes.ts
export interface NotificationTypes {
  id: string;
  title?: string;
  description?: string;
  message?: string;
  date?: string;
  time?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean; 
  metadata?: Record<string, any>;
  [key: string]: any;
}