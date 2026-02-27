export type Role = 'ADMIN' | 'SURVEYOR' | 'CANDIDATE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Ward {
  id: string;
  name: string;
  district: string;
  surveyCount: number;
  unlocked?: boolean;
}

export interface SurveySubmission {
  id: string;
  wardId: string;
  boothNumber: string;
  date: string;
  surveyorId: string;
  demographics: {
    gender: string;
    ageGroup: string;
    residenceType: string;
    yearsLiving: string;
  };
  community: {
    language: string;
    group?: string;
    affiliations: string[];
  };
  voters: {
    maleCount: number;
    femaleCount: number;
    youthCount: number;
    behavior: string;
  };
  issues: {
    water: string;
    roads: string;
    drainage: string;
    garbage: string;
    safety: string;
    topIssue: string;
  };
  sentiment: string;
  notes: string;
}

export interface SentimentAnalysis {
  keyLocalIssues: string[];
  overallSentiment: 'Positive' | 'Neutral' | 'Negative';
  detailedSentiment: { aspect: string; sentiment: string }[];
  emergingTrends: string[];
  summary: string;
}
