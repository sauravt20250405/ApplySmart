// ApplySmart Type Definitions

export type ExamType = 'NDA' | 'JEE' | 'NEET' | 'UPSC';

export interface ExamRequirement {
  id: string;
  name: string;
  type: 'photo' | 'signature' | 'document';
  required: boolean;
  rules: ValidationRule[];
  example?: string;
}

export interface ValidationRule {
  id: string;
  category: 'dimension' | 'fileSize' | 'format' | 'background' | 'dpi' | 'quality' | 'content';
  name: string;
  description: string;
  ruleReference?: string; // e.g., "NDA Rule 4.2"
  validator: string; // function name or algorithm
  parameters: Record<string, any>;
  autoCorrect: boolean;
}

export interface ExamRuleSet {
  examType: ExamType;
  year: number;
  version: string;
  lastUpdated: string;
  requirements: ExamRequirement[];
  documentNaming: {
    pattern: string;
    example: string;
  };
}

export interface ValidationResult {
  passed: boolean;
  confidence: number; // 0-100
  rule: ValidationRule;
  details: string;
  correctionApplied?: boolean;
  correctionDetails?: string;
}

export interface DocumentValidation {
  documentId: string;
  documentType: 'photo' | 'signature' | 'document';
  overallPassed: boolean;
  overallConfidence: number;
  complianceScore: number; // 0-100
  results: ValidationResult[];
  timestamp: string;
  autoCorrections: AutoCorrection[];
}

export interface AutoCorrection {
  id: string;
  type: 'crop' | 'resize' | 'background' | 'shadow' | 'dpi' | 'format' | 'rename';
  description: string;
  before: any;
  after: any;
  confidence: number;
}

export interface UploadedDocument {
  id: string;
  name: string;
  originalName: string;
  type: 'photo' | 'signature' | 'document';
  file: File;
  preview: string;
  status: 'uploading' | 'validating' | 'correcting' | 'complete' | 'failed';
  validation?: DocumentValidation;
  correctedFile?: File;
  correctedPreview?: string;
}

export interface ExamApplication {
  id: string;
  examType: ExamType;
  year: number;
  userId: string;
  status: 'draft' | 'validating' | 'ready' | 'submitted';
  documents: UploadedDocument[];
  complianceScore: number;
  createdAt: string;
  updatedAt: string;
  ruleSet: ExamRuleSet;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  createdAt: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface StoredDocument {
  id: string;
  name: string;
  type: 'photo' | 'signature' | 'document';
  examType: ExamType;
  year: number;
  version: number;
  fileUrl: string;
  thumbnailUrl: string;
  encrypted: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface AnalyticsData {
  userId: string;
  totalApplications: number;
  complianceHistory: {
    date: string;
    score: number;
  }[];
  timeSaved: number; // in minutes
  rejectionRiskTrends: {
    date: string;
    risk: number;
  }[];
  documentStats: {
    total: number;
    autoFixed: number;
    manualFixed: number;
  };
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedAction?: string;
}
