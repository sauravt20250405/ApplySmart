import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getComplianceColor(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-warning';
  return 'text-destructive';
}

export function getComplianceBgColor(score: number): string {
  if (score >= 90) return 'bg-success/10';
  if (score >= 70) return 'bg-warning/10';
  return 'bg-destructive/10';
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 90) return 'low';
  if (score >= 70) return 'medium';
  return 'high';
}

export function maskAadhaar(aadhaar: string): string {
  // Mask middle 8 digits of Aadhaar (XXXX XXXX 1234)
  if (aadhaar.length !== 12) return aadhaar;
  return `XXXX XXXX ${aadhaar.slice(-4)}`;
}

export function calculateTimeSaved(autoCorrections: number): number {
  // Each auto-correction saves approximately 5 minutes
  return autoCorrections * 5;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 95) return 'text-success';
  if (confidence >= 80) return 'text-warning';
  return 'text-destructive';
}

export function truncateFilename(filename: string, maxLength: number = 20): string {
  if (filename.length <= maxLength) return filename;
  const ext = filename.split('.').pop() || '';
  const nameWithoutExt = filename.substring(0, filename.length - ext.length - 1);
  const truncated = nameWithoutExt.substring(0, maxLength - ext.length - 4);
  return `${truncated}...${ext}`;
}
