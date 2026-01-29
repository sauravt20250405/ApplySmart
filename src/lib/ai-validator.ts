import { ValidationRule, ValidationResult, AutoCorrection, DocumentValidation } from '@/types';
import { generateId } from './utils';

// Mock AI validation engine with realistic processing
export class AIValidator {
  
  /**
   * Validate a document against rules
   * Simulates OpenCV-style computer vision checks
   */
  static async validateDocument(
    file: File,
    documentType: 'photo' | 'signature' | 'document',
    rules: ValidationRule[]
  ): Promise<DocumentValidation> {
    const results: ValidationResult[] = [];
    const autoCorrections: AutoCorrection[] = [];
    
    // Simulate processing time (realistic for AI operations)
    await this.delay(1500);
    
    // Process image to get metadata
    const imageData = await this.processImage(file);
    
    // Run each validation rule
    for (const rule of rules) {
      const result = await this.runValidation(rule, file, imageData);
      results.push(result);
      
      // If validation failed and auto-correct is enabled
      if (!result.passed && rule.autoCorrect && result.correctionApplied) {
        autoCorrections.push({
          id: generateId(),
          type: this.getCorrectionType(rule.category),
          description: result.correctionDetails || `Auto-corrected ${rule.name}`,
          before: imageData,
          after: { ...imageData, corrected: true },
          confidence: result.confidence,
        });
      }
    }
    
    // Calculate overall metrics
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const overallPassed = passedCount === totalCount;
    const complianceScore = Math.round((passedCount / totalCount) * 100);
    const overallConfidence = Math.round(
      results.reduce((sum, r) => sum + r.confidence, 0) / totalCount
    );
    
    return {
      documentId: generateId(),
      documentType,
      overallPassed,
      overallConfidence,
      complianceScore,
      results,
      timestamp: new Date().toISOString(),
      autoCorrections,
    };
  }
  
  /**
   * Process image to extract metadata (simulated)
   */
  private static async processImage(file: File): Promise<any> {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          // Calculate approximate DPI (simulated from pixel dimensions)
          const pixelWidth = img.width;
          const pixelHeight = img.height;
          
          // Simulate metadata extraction
          const metadata = {
            width: pixelWidth,
            height: pixelHeight,
            fileSize: file.size,
            format: file.type,
            estimatedDpi: this.calculateEstimatedDpi(pixelWidth, pixelHeight),
            hasAlpha: file.type === 'image/png',
          };
          
          resolve(metadata);
        };
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Calculate estimated DPI from pixel dimensions
   */
  private static calculateEstimatedDpi(width: number, height: number): number {
    // Assume standard photo size 3.5cm x 4.5cm
    const cmToInch = 0.393701;
    const widthInches = 3.5 * cmToInch;
    const estimatedDpi = Math.round(width / widthInches);
    return estimatedDpi;
  }
  
  /**
   * Run a single validation rule
   */
  private static async runValidation(
    rule: ValidationRule,
    file: File,
    imageData: any
  ): Promise<ValidationResult> {
    await this.delay(300); // Simulate AI processing time
    
    switch (rule.category) {
      case 'dimension':
        return this.validateDimension(rule, imageData);
      
      case 'dpi':
        return this.validateDpi(rule, imageData);
      
      case 'fileSize':
        return this.validateFileSize(rule, file);
      
      case 'format':
        return this.validateFormat(rule, file);
      
      case 'background':
        return this.validateBackground(rule, imageData);
      
      case 'quality':
        return this.validateQuality(rule, imageData);
      
      case 'content':
        return this.validateContent(rule, imageData);
      
      default:
        return {
          passed: false,
          confidence: 0,
          rule,
          details: 'Unknown validation category',
        };
    }
  }
  
  /**
   * Validate image dimensions
   */
  private static validateDimension(rule: ValidationRule, imageData: any): ValidationResult {
    const { width: reqWidth, height: reqHeight, unit, tolerance } = rule.parameters;
    
    // Convert pixels to cm (assume 96 DPI for screen, adjust for actual DPI)
    const dpi = imageData.estimatedDpi || 96;
    const pixelToCm = 2.54 / dpi;
    const actualWidthCm = imageData.width * pixelToCm;
    const actualHeightCm = imageData.height * pixelToCm;
    
    const widthDiff = Math.abs(actualWidthCm - reqWidth);
    const heightDiff = Math.abs(actualHeightCm - reqHeight);
    
    const passed = widthDiff <= tolerance && heightDiff <= tolerance;
    const confidence = passed ? 98 : 85;
    
    let details = passed
      ? `Dimensions correct: ${actualWidthCm.toFixed(1)}cm × ${actualHeightCm.toFixed(1)}cm`
      : `Dimensions incorrect: ${actualWidthCm.toFixed(1)}cm × ${actualHeightCm.toFixed(1)}cm (required: ${reqWidth}cm × ${reqHeight}cm)`;
    
    let correctionApplied = false;
    let correctionDetails = '';
    
    if (!passed && rule.autoCorrect) {
      correctionApplied = true;
      correctionDetails = `Resized from ${actualWidthCm.toFixed(1)}cm × ${actualHeightCm.toFixed(1)}cm to ${reqWidth}cm × ${reqHeight}cm`;
      details += ` → Auto-corrected`;
    }
    
    return {
      passed,
      confidence,
      rule,
      details,
      correctionApplied,
      correctionDetails,
    };
  }
  
  /**
   * Validate DPI/Resolution
   */
  private static validateDpi(rule: ValidationRule, imageData: any): ValidationResult {
    const { minDpi } = rule.parameters;
    const actualDpi = imageData.estimatedDpi || 96;
    
    const passed = actualDpi >= minDpi;
    const confidence = passed ? 96 : 88;
    
    let details = passed
      ? `DPI correct: ${actualDpi} DPI`
      : `DPI too low: ${actualDpi} DPI (required: ${minDpi} DPI)`;
    
    let correctionApplied = false;
    let correctionDetails = '';
    
    if (!passed && rule.autoCorrect) {
      correctionApplied = true;
      correctionDetails = `Upscaled from ${actualDpi} DPI to ${minDpi} DPI`;
      details += ` → Auto-corrected`;
    }
    
    return {
      passed,
      confidence,
      rule,
      details,
      correctionApplied,
      correctionDetails,
    };
  }
  
  /**
   * Validate file size
   */
  private static validateFileSize(rule: ValidationRule, file: File): ValidationResult {
    const { minSize, maxSize } = rule.parameters;
    const actualSize = file.size;
    
    const passed = actualSize >= minSize && actualSize <= maxSize;
    const confidence = passed ? 99 : 92;
    
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes}B`;
      return `${(bytes / 1024).toFixed(1)}KB`;
    };
    
    let details = passed
      ? `File size correct: ${formatSize(actualSize)}`
      : `File size incorrect: ${formatSize(actualSize)} (required: ${formatSize(minSize)} - ${formatSize(maxSize)})`;
    
    let correctionApplied = false;
    let correctionDetails = '';
    
    if (!passed && rule.autoCorrect) {
      correctionApplied = true;
      if (actualSize > maxSize) {
        correctionDetails = `Compressed from ${formatSize(actualSize)} to ${formatSize(maxSize)}`;
      } else {
        correctionDetails = `Quality adjusted from ${formatSize(actualSize)} to ${formatSize(minSize)}`;
      }
      details += ` → Auto-corrected`;
    }
    
    return {
      passed,
      confidence,
      rule,
      details,
      correctionApplied,
      correctionDetails,
    };
  }
  
  /**
   * Validate file format
   */
  private static validateFormat(rule: ValidationRule, file: File): ValidationResult {
    const { allowedFormats } = rule.parameters;
    const actualFormat = file.type;
    
    const passed = allowedFormats.includes(actualFormat);
    const confidence = passed ? 100 : 95;
    
    let details = passed
      ? `Format correct: ${actualFormat}`
      : `Format incorrect: ${actualFormat} (required: ${allowedFormats.join(' or ')})`;
    
    let correctionApplied = false;
    let correctionDetails = '';
    
    if (!passed && rule.autoCorrect) {
      correctionApplied = true;
      correctionDetails = `Converted from ${actualFormat} to ${allowedFormats[0]}`;
      details += ` → Auto-corrected`;
    }
    
    return {
      passed,
      confidence,
      rule,
      details,
      correctionApplied,
      correctionDetails,
    };
  }
  
  /**
   * Validate background (simulated computer vision)
   */
  private static validateBackground(rule: ValidationRule, imageData: any): ValidationResult {
    const { allowedColors, uniformity } = rule.parameters;
    
    // Simulate background analysis with realistic confidence
    const simulatedUniformity = 0.75 + Math.random() * 0.2; // 75-95%
    const passed = simulatedUniformity >= uniformity;
    const confidence = passed ? 94 : 87;
    
    let details = passed
      ? `Background correct: ${allowedColors.join('/')} background detected (${(simulatedUniformity * 100).toFixed(0)}% uniformity)`
      : `Background incorrect: Non-uniform or colored background detected (${(simulatedUniformity * 100).toFixed(0)}% uniformity, required: ${(uniformity * 100).toFixed(0)}%)`;
    
    let correctionApplied = false;
    let correctionDetails = '';
    
    if (!passed && rule.autoCorrect) {
      correctionApplied = true;
      correctionDetails = `Background normalized to white, uniformity improved to ${(uniformity * 100).toFixed(0)}%`;
      details += ` → Auto-corrected`;
    }
    
    return {
      passed,
      confidence,
      rule,
      details,
      correctionApplied,
      correctionDetails,
    };
  }
  
  /**
   * Validate quality (shadow/glare detection)
   */
  private static validateQuality(rule: ValidationRule, imageData: any): ValidationResult {
    const { maxShadowPercentage } = rule.parameters;
    
    // Simulate shadow detection
    const simulatedShadowPercentage = Math.random() * 15; // 0-15%
    const passed = simulatedShadowPercentage <= maxShadowPercentage;
    const confidence = passed ? 91 : 84;
    
    let details = passed
      ? `Quality correct: Minimal shadow/glare detected (${simulatedShadowPercentage.toFixed(1)}%)`
      : `Quality issue: Shadow/glare detected (${simulatedShadowPercentage.toFixed(1)}%, max allowed: ${maxShadowPercentage}%)`;
    
    let correctionApplied = false;
    let correctionDetails = '';
    
    if (!passed && rule.autoCorrect) {
      correctionApplied = true;
      correctionDetails = `Shadow removal applied, reduced from ${simulatedShadowPercentage.toFixed(1)}% to ${maxShadowPercentage}%`;
      details += ` → Auto-corrected`;
    }
    
    return {
      passed,
      confidence,
      rule,
      details,
      correctionApplied,
      correctionDetails,
    };
  }
  
  /**
   * Validate content (face detection)
   */
  private static validateContent(rule: ValidationRule, imageData: any): ValidationResult {
    const { minFaceSize, frontal } = rule.parameters;
    
    // Simulate face detection (not auto-correctable)
    const simulatedFaceDetected = Math.random() > 0.1; // 90% success rate
    const simulatedFaceSize = 0.55 + Math.random() * 0.3; // 55-85%
    const simulatedFrontal = Math.random() > 0.05; // 95% frontal
    
    const passed = simulatedFaceDetected && simulatedFaceSize >= minFaceSize && simulatedFrontal;
    const confidence = passed ? 97 : 72;
    
    let details = '';
    if (!simulatedFaceDetected) {
      details = 'No face detected in image';
    } else if (simulatedFaceSize < minFaceSize) {
      details = `Face too small: ${(simulatedFaceSize * 100).toFixed(0)}% of image (required: ${(minFaceSize * 100).toFixed(0)}%)`;
    } else if (!simulatedFrontal) {
      details = 'Face not frontal - please face the camera directly';
    } else {
      details = `Face detected correctly: Frontal, ${(simulatedFaceSize * 100).toFixed(0)}% of image`;
    }
    
    // Face detection is typically not auto-correctable
    return {
      passed,
      confidence,
      rule,
      details,
      correctionApplied: false,
    };
  }
  
  /**
   * Get correction type from validation category
   */
  private static getCorrectionType(category: string): AutoCorrection['type'] {
    const mapping: Record<string, AutoCorrection['type']> = {
      dimension: 'resize',
      dpi: 'dpi',
      fileSize: 'format',
      format: 'format',
      background: 'background',
      quality: 'shadow',
    };
    return mapping[category] || 'format';
  }
  
  /**
   * Utility: delay for simulating async operations
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Generate corrected file (simulated)
   */
  static async generateCorrectedFile(
    originalFile: File,
    corrections: AutoCorrection[]
  ): Promise<File> {
    // In a real implementation, this would use canvas/image processing
    // For demo, we return the original file with a new name
    await this.delay(1000);
    
    const newName = originalFile.name.replace(/\.(jpg|jpeg|png)$/i, '_corrected.$1');
    return new File([originalFile], newName, { type: originalFile.type });
  }
}
