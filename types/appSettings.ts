// Application settings interface
export interface AppSettings {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
}