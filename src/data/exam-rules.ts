import { ExamRuleSet } from '@/types';

// NDA 2026 Complete Rule Set (UPSC Official Guidelines - Updated Jan 2026)
export const NDA_2026_RULES: ExamRuleSet = {
  examType: 'NDA',
  year: 2026,
  version: '2.1.0',
  lastUpdated: '2026-01-28',
  applicationTimeline: {
    notificationDate: '2026-01-XX',
    applicationStart: '2026-01-XX',
    applicationEnd: '2026-02-XX',
    examDate1: '2026-04-XX',
    examDate2: '2026-09-XX',
    admitCard: '2026-XX-XX',
    result: '2026-XX-XX'
  },
  eligibilityCriteria: {
    nationality: 'Indian citizen, or subject of Nepal/Bhutan, or Tibetan refugee (before 1 Jan 1962), or Indian origin migrated from specified countries',
    ageLimit: {
      min: 16.5,
      max: 19.5,
      birthDateRange: '2 Jul 2007 to 1 Jan 2011 (NDA 1 2026)'
    },
    maritalStatus: 'Unmarried male and female candidates only',
    education: {
      armyWing: '12th Class pass or appearing',
      airForceNavy: '12th Class with Physics & Maths or appearing'
    }
  },
  applicationProcess: {
    part1: 'One-time registration (Name, DOB, Father name, Mother name, Mobile, Email)',
    part2: 'Upload documents, Photo/Signature, Pay fee, Select exam center',
    correctionWindow: 'Available after submission (limited fields)',
    applicationMode: 'Online only via upsconline.nic.in'
  },
  applicationFees: {
    generalOBC: '₹100/-',
    scSTSonsWidows: 'Exempt',
    women: 'Exempt',
    paymentModes: ['Debit/Credit Card', 'Net Banking', 'UPI', 'Cash at SBI']
  },
  requirements: [
    {
      id: 'nda-photo',
      name: 'Passport Size Photograph',
      type: 'photo',
      required: true,
      description: 'Recent color photo (within 3 months), 80% face coverage, frontal view, white/off-white background',
      rules: [
        {
          id: 'photo-dimension',
          category: 'dimension',
          name: 'Pixel Dimension',
          description: 'Photo must be 350-500 pixels (width/height)',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'dimensionValidator',
          parameters: { minPx: 350, maxPx: 500, tolerance: 10 },
          autoCorrect: true,
        },
        {
          id: 'photo-dpi',
          category: 'quality',
          name: 'Resolution Check',
          description: 'Minimum 96 DPI, clear & sharp image',
          ruleReference: 'UPSC Technical Guidelines',
          validator: 'dpiValidator',
          parameters: { minDpi: 96 },
          autoCorrect: true,
        },
        {
          id: 'photo-size',
          category: 'fileSize',
          name: 'File Size Check',
          description: 'Photo must be 20KB - 100KB',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'fileSizeValidator',
          parameters: { minSize: 20480, maxSize: 102400 },
          autoCorrect: true,
        },
        {
          id: 'photo-format',
          category: 'format',
          name: 'File Format Check',
          description: 'JPG/JPEG format only',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'formatValidator',
          parameters: { allowedFormats: ['image/jpeg', 'image/jpg'] },
          autoCorrect: true,
        },
        {
          id: 'photo-background',
          category: 'background',
          name: 'Background Check',
          description: 'Plain white/light background, no shadows/patterns',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'backgroundValidator',
          parameters: { allowedColors: ['white', 'off-white'], uniformity: 0.9 },
          autoCorrect: true,
        },
        {
          id: 'photo-face',
          category: 'content',
          name: 'Face Detection',
          description: '80% face coverage, eyes open, neutral expression',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'faceDetectionValidator',
          parameters: { minFaceSize: 0.8, frontal: true, eyesOpen: true },
          autoCorrect: false,
        },
      ],
    },
    {
      id: 'nda-signature',
      name: 'Signature',
      type: 'signature',
      required: true,
      description: 'Black/blue ink on white paper, clear signature',
      rules: [
        {
          id: 'sig-dimension',
          category: 'dimension',
          name: 'Pixel Dimension',
          description: 'Signature must be 350-500 pixels (width/height)',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'dimensionValidator',
          parameters: { minPx: 350, maxPx: 500, tolerance: 10 },
          autoCorrect: true,
        },
        {
          id: 'sig-size',
          category: 'fileSize',
          name: 'File Size Check',
          description: 'Signature must be 20KB - 100KB',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'fileSizeValidator',
          parameters: { minSize: 20480, maxSize: 102400 },
          autoCorrect: true,
        },
        {
          id: 'sig-format',
          category: 'format',
          name: 'File Format Check',
          description: 'JPG/JPEG format only',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'formatValidator',
          parameters: { allowedFormats: ['image/jpeg', 'image/jpg'] },
          autoCorrect: true,
        },
        {
          id: 'sig-background',
          category: 'background',
          name: 'Background Check',
          description: 'Plain white background only',
          ruleReference: 'UPSC NDA 2026 Notice',
          validator: 'backgroundValidator',
          parameters: { allowedColors: ['white'], uniformity: 0.95 },
          autoCorrect: true,
        },
      ],
    },
    {
      id: 'nda-idproof',
      name: 'ID Proof',
      type: 'document',
      required: false,
      description: 'Aadhaar Card / Voter ID / PAN (for verification)',
      rules: [
        {
          id: 'id-format',
          category: 'format',
          name: 'File Format',
          description: 'PDF/JPG/PNG (max 1MB)',
          validator: 'formatValidator',
          parameters: { allowedFormats: ['application/pdf', 'image/jpeg', 'image/png'] },
          autoCorrect: false,
        },
      ],
    },
    {
      id: 'nda-10th-marksheet',
      name: '10th Marksheet',
      type: 'document',
      required: true,
      description: 'Matriculation certificate (mandatory for age proof)',
      rules: [
        {
          id: '10th-size',
          category: 'fileSize',
          name: 'File Size',
          description: 'Max 1MB',
          validator: 'fileSizeValidator',
          parameters: { maxSize: 1048576 },
        },
      ],
    },
    {
      id: 'nda-12th-marksheet',
      name: '12th Marksheet',
      type: 'document',
      required: false,
      description: '12th marksheet/certificate (if passed) OR admit card (if appearing)',
      rules: [
        {
          id: '12th-size',
          category: 'fileSize',
          name: 'File Size',
          description: 'Max 1MB',
          validator: 'fileSizeValidator',
          parameters: { maxSize: 1048576 },
        },
      ],
    },
    {
      id: 'nda-category-certificate',
      name: 'Category Certificate',
      type: 'document',
      required: false,
      description: 'SC/ST/OBC-NCL/EWS certificate (if applicable)',
      rules: [
        {
          id: 'cat-size',
          category: 'fileSize',
          name: 'File Size',
          description: 'Max 1MB',
          validator: 'fileSizeValidator',
          parameters: { maxSize: 1048576 },
        },
      ],
    },
  ],
  documentNaming: {
    pattern: '{EXAM}_{TYPE}_{ROLLNO}_{YYYY}_{CANDIDATE_NAME}.jpg',
    examples: [
      'NDA_PHOTO_AB123456_2026_RAHUL_SHARMA.jpg',
      'NDA_SIGNATURE_AB123456_2026_RAHUL_SHARMA.jpg'
    ],
    autoGenerate: true
  },
  examCenters: 'All major cities across India (select during Part-II)',
  helpline: {
    email: 'upsc-help@nic.in',
    phone: '011-23385271, 011-23381125',
    website: 'https://upsc.gov.in'
  },
  importantNotes: [
    'Form rejection rate: 15-20% due to photo/signature issues',
    'Mandatory Aadhaar linkage for 2026 onwards',
    'Women candidates eligible for all wings (Army/Air Force/Navy)',
    'No offline applications accepted'
  ]
};


// JEE 2026 Rule Set
export const JEE_2026_RULES: ExamRuleSet = {
  examType: 'JEE',
  year: 2026,
  version: '2.1.0',
  lastUpdated: '2025-11-20',
  requirements: [
    {
      id: 'jee-photo',
      name: 'Passport Size Photograph',
      type: 'photo',
      required: true,
      rules: [
        {
          id: 'photo-dimension',
          category: 'dimension',
          name: 'Dimension Check',
          description: 'Photo must be 3.5cm x 4.5cm',
          ruleReference: 'JEE Guidelines 2026 - Section 5.1',
          validator: 'dimensionValidator',
          parameters: { width: 3.5, height: 4.5, unit: 'cm', tolerance: 0.05 },
          autoCorrect: true,
        },
        {
          id: 'photo-dpi',
          category: 'dpi',
          name: 'DPI/Resolution Check',
          description: 'Photo must be 300 DPI',
          ruleReference: 'JEE Guidelines 2026 - Section 5.2',
          validator: 'dpiValidator',
          parameters: { minDpi: 300 },
          autoCorrect: true,
        },
        {
          id: 'photo-size',
          category: 'fileSize',
          name: 'File Size Check',
          description: 'Photo file size must be between 10KB and 200KB',
          ruleReference: 'JEE Guidelines 2026 - Section 5.3',
          validator: 'fileSizeValidator',
          parameters: { minSize: 10240, maxSize: 204800 },
          autoCorrect: true,
        },
        {
          id: 'photo-format',
          category: 'format',
          name: 'File Format Check',
          description: 'Photo must be in JPEG or PNG format',
          ruleReference: 'JEE Guidelines 2026 - Section 5.4',
          validator: 'formatValidator',
          parameters: { allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'] },
          autoCorrect: true,
        },
        {
          id: 'photo-background',
          category: 'background',
          name: 'Background Check',
          description: 'Photo must have plain white background',
          ruleReference: 'JEE Guidelines 2026 - Section 5.5',
          validator: 'backgroundValidator',
          parameters: { allowedColors: ['white'], uniformity: 0.9 },
          autoCorrect: true,
        },
        {
          id: 'photo-face',
          category: 'content',
          name: 'Face Detection',
          description: 'Clear frontal face must be visible, 70-80% of photo area',
          ruleReference: 'JEE Guidelines 2026 - Section 5.6',
          validator: 'faceDetectionValidator',
          parameters: { minFaceSize: 0.7, maxFaceSize: 0.8, frontal: true },
          autoCorrect: false,
        },
      ],
    },
    {
      id: 'jee-signature',
      name: 'Signature',
      type: 'signature',
      required: true,
      rules: [
        {
          id: 'sig-dimension',
          category: 'dimension',
          name: 'Dimension Check',
          description: 'Signature must be 4cm x 2cm',
          ruleReference: 'JEE Guidelines 2026 - Section 6.1',
          validator: 'dimensionValidator',
          parameters: { width: 4, height: 2, unit: 'cm', tolerance: 0.1 },
          autoCorrect: true,
        },
        {
          id: 'sig-size',
          category: 'fileSize',
          name: 'File Size Check',
          description: 'Signature file size must be between 4KB and 30KB',
          ruleReference: 'JEE Guidelines 2026 - Section 6.2',
          validator: 'fileSizeValidator',
          parameters: { minSize: 4096, maxSize: 30720 },
          autoCorrect: true,
        },
        {
          id: 'sig-format',
          category: 'format',
          name: 'File Format Check',
          description: 'Signature must be in JPEG or PNG format',
          ruleReference: 'JEE Guidelines 2026 - Section 6.3',
          validator: 'formatValidator',
          parameters: { allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'] },
          autoCorrect: true,
        },
      ],
    },
  ],
  documentNaming: {
    pattern: '{ROLLNO}_{TYPE}.jpg',
    example: '123456789_PHOTO.jpg',
  },
};

export const EXAM_RULES: Record<string, ExamRuleSet> = {
  'NDA-2026': NDA_2026_RULES,
  'JEE-2026': JEE_2026_RULES,
};

export function getRuleSet(examType: string, year: number): ExamRuleSet | undefined {
  const key = `${examType}-${year}`;
  return EXAM_RULES[key];
}
