
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
