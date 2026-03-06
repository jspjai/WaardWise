
export type Role = 'ADMIN' | 'SURVEYOR' | 'VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  wardId?: string;
  boothNumber?: string;
  data?: any;
}

export interface ViewerRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  password?: string;
  phone: string;
  surveyRequested: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface SurveyAccess {
  id: string;
  viewerId: string;
  surveyId: string;
  assignedAt: string;
  expiryDate?: string;
}

export interface SupportTicket {
  id: string;
  viewerId: string;
  viewerName: string;
  viewerEmail: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}
