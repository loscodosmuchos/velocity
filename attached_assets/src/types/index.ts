// Core types for Missing Data Generator Module

export interface MissingDataField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'currency' | 'select' | 'textarea';
  required: boolean;
  description: string;
  options?: string[]; // For select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface MissingDataCategory {
  id: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  icon: string;
  fields: MissingDataField[];
}

export interface ClientRequirement {
  id: string;
  clientName: string;
  contractTitle: string;
  contractId: string;
  categories: MissingDataCategory[];
  dueDate: string;
  requestedBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  responses?: { [fieldId: string]: any };
}

export interface ClientNotification {
  id: string;
  clientName: string;
  title: string;
  message: string;
  type: 'new-requirement' | 'reminder' | 'completed' | 'urgent';
  requirementId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContractDocument {
  id: string;
  client: string;
  title: string;
  type: string;
  uploadDate: string;
  fileSize: string;
  status: string;
}

export interface MissingDataGeneratorProps {
  onRequirementCreated?: (requirement: ClientRequirement) => void;
  onError?: (error: Error) => void;
  customCategories?: MissingDataCategory[];
  apiConfig?: {
    baseUrl?: string;
    timeout?: number;
  };
}

export interface ClientPortalProps {
  clientName?: string;
  hideHeader?: boolean;
  onRequirementCompleted?: (requirement: ClientRequirement) => void;
  customTheme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RequirementCreationResponse {
  success: boolean;
  requirement: ClientRequirement;
  message: string;
}

export interface NotificationResponse {
  notifications: ClientNotification[];
  unreadCount: number;
}