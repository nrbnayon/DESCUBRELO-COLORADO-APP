// Enhanced User interface
export interface User {
  id: string;
  name: string;
  email: string;
  balance?: number;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    [key: string]: any;
  };
  preferences?: {
    language?: string;
    currency?: string;
    notifications?: boolean;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
  isVerified?: boolean;
  role?: "user" | "admin" | "moderator";
  [key: string]: any;
}
