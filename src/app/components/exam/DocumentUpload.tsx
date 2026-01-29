import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, X, File, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadedDocument } from '@/types';
import { generateId } from '@/lib/utils';

interface DocumentUploadProps {
  documentType: 'photo' | 'signature' | 'document';
  onUpload: (document: UploadedDocument) => void;
  accept?: string;
}

export function DocumentUpload({ documentType, onUpload, accept = 'image/*' }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    // Simulate upload processing
    await new Promise(resolve => setTimeout(resolve, 500));

    const preview = URL.createObjectURL(file);
    const uploadedDoc: UploadedDocument = {
      id: generateId(),
      name: file.name,
      originalName: file.name,
      type: documentType,
      file,
      preview,
      status: 'uploading',
    };

    onUpload(uploadedDoc);
    setIsUploading(false);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, [documentType, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 transition-all duration-200',
          isDragging
            ? 'border-accent bg-accent/5 scale-[1.02]'
            : 'border-border bg-muted/30 hover:border-accent/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-accent/10 rounded-xl flex items-center justify-center"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-accent mx-auto mb-2" />
                <p className="font-semibold text-accent">Drop to upload</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
              <p className="font-medium">Processing...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">
                Drop your {documentType} here
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                or click to browse
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="group"
                >
                  <File className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Choose File
                </Button>
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  variant="outline"
                  className="group"
                >
                  <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Take Photo
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Supports: JPEG, PNG • Max size: 5MB
              </p>
            </>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

interface UploadedDocumentCardProps {
  document: UploadedDocument;
  onRemove: () => void;
  onView: () => void;
}

export function UploadedDocumentCard({ document, onRemove, onView }: UploadedDocumentCardProps) {
  const getStatusInfo = () => {
    switch (document.status) {
      case 'uploading':
        return { icon: Loader2, color: 'text-muted-foreground', text: 'Uploading...', spin: true };
      case 'validating':
        return { icon: Loader2, color: 'text-accent', text: 'Validating...', spin: true };
      case 'correcting':
        return { icon: Loader2, color: 'text-warning', text: 'Auto-correcting...', spin: true };
      case 'complete':
        return { icon: Check, color: 'text-success', text: 'Complete', spin: false };
      case 'failed':
        return { icon: AlertCircle, color: 'text-destructive', text: 'Failed', spin: false };
      default:
        return { icon: File, color: 'text-muted-foreground', text: 'Pending', spin: false };
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          {document.preview ? (
            <img
              src={document.correctedPreview || document.preview}
              alt={document.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <File className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Status overlay */}
          {document.status === 'validating' || document.status === 'correcting' && (
            <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{document.name}</h4>
              <p className="text-sm text-muted-foreground">
                {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <StatusIcon className={cn('w-4 h-4', status.color, status.spin && 'animate-spin')} />
            <span className={cn('text-sm font-medium', status.color)}>
              {status.text}
            </span>
          </div>

          {/* Validation score */}
          {document.validation && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    document.validation.complianceScore >= 90 ? 'bg-success' :
                    document.validation.complianceScore >= 70 ? 'bg-warning' :
                    'bg-destructive'
                  )}
                  style={{ width: `${document.validation.complianceScore}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {document.validation.complianceScore}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* View button */}
      {document.status === 'complete' && (
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="w-full mt-3"
        >
          View Details
        </Button>
      )}
    </motion.div>
  );
}
