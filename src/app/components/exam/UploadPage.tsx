import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Download, AlertCircle, Sparkles, FileCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { DocumentUpload, UploadedDocumentCard } from './DocumentUpload';
import { UploadedDocument, ExamRuleSet } from '@/types';
import { AIValidator } from '@/lib/ai-validator';
import { getComplianceColor } from '@/lib/utils';

export function UploadPage() {
  const { setCurrentPage } = useApp();
  const [ruleSet, setRuleSet] = useState<ExamRuleSet | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [currentRequirementIndex, setCurrentRequirementIndex] = useState(0);
  const [allCompleted, setAllCompleted] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentRuleSet');
    if (stored) {
      setRuleSet(JSON.parse(stored));
    }
  }, []);

  const handleDocumentUpload = useCallback(async (doc: UploadedDocument) => {
    // Add to documents
    setDocuments(prev => [...prev, doc]);

    // Start validation
    setTimeout(async () => {
      setDocuments(prev =>
        prev.map(d => (d.id === doc.id ? { ...d, status: 'validating' } : d))
      );

      const currentRequirement = ruleSet?.requirements[currentRequirementIndex];
      if (!currentRequirement) return;

      // Run AI validation
      const validation = await AIValidator.validateDocument(
        doc.file,
        doc.type,
        currentRequirement.rules
      );

      // Update status to correcting if needed
      if (validation.autoCorrections.length > 0) {
        setDocuments(prev =>
          prev.map(d => (d.id === doc.id ? { ...d, status: 'correcting' } : d))
        );

        // Simulate correction time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate corrected file
        const correctedFile = await AIValidator.generateCorrectedFile(
          doc.file,
          validation.autoCorrections
        );
        const correctedPreview = URL.createObjectURL(correctedFile);

        setDocuments(prev =>
          prev.map(d =>
            d.id === doc.id
              ? {
                  ...d,
                  status: 'complete',
                  validation,
                  correctedFile,
                  correctedPreview,
                }
              : d
          )
        );
      } else {
        setDocuments(prev =>
          prev.map(d =>
            d.id === doc.id
              ? { ...d, status: 'complete', validation }
              : d
          )
        );
      }
    }, 500);
  }, [ruleSet, currentRequirementIndex]);

  const handleRemoveDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  const handleViewDocument = useCallback((doc: UploadedDocument) => {
    setSelectedDocument(doc);
  }, []);

  const handleNextRequirement = useCallback(() => {
    if (ruleSet && currentRequirementIndex < ruleSet.requirements.length - 1) {
      setCurrentRequirementIndex(prev => prev + 1);
    } else {
      setAllCompleted(true);
    }
  }, [ruleSet, currentRequirementIndex]);

  const currentRequirement = ruleSet?.requirements[currentRequirementIndex];
  const currentDocuments = documents.filter(d => d.type === currentRequirement?.type);
  const canProceed = currentDocuments.some(d => d.status === 'complete');

  const overallCompliance = documents.length > 0
    ? Math.round(
        documents
          .filter(d => d.validation)
          .reduce((sum, d) => sum + (d.validation?.complianceScore || 0), 0) / documents.filter(d => d.validation).length
      )
    : 0;

  if (!ruleSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (allCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h1 className="text-4xl font-bold mb-4">All Documents Validated!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your documents are now exam-compliant and ready for submission
              </p>

              <div className="bg-card rounded-xl p-8 mb-8 border border-border">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Documents</p>
                    <p className="text-3xl font-bold font-mono">{documents.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Compliance</p>
                    <p className={`text-3xl font-bold font-mono ${getComplianceColor(overallCompliance)}`}>
                      {overallCompliance}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Auto-Fixed</p>
                    <p className="text-3xl font-bold font-mono text-success">
                      {documents.reduce((sum, d) => sum + (d.validation?.autoCorrections.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  size="xl"
                  variant="accent"
                  onClick={() => setCurrentPage('compliance')}
                >
                  <FileCheck className="w-5 h-5 mr-2" />
                  View Full Report
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  onClick={() => {
                    // Download all documents (simulated)
                    alert('In production, this would download a ZIP file with all compliant documents');
                  }}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download All
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage('exam-start')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm opacity-80">Progress</p>
                <p className="font-semibold">
                  {currentRequirementIndex + 1} / {ruleSet.requirements.length}
                </p>
              </div>
              {overallCompliance > 0 && (
                <Badge variant="secondary" className="font-mono">
                  {overallCompliance}% compliant
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Current Requirement */}
          {currentRequirement && (
            <motion.div
              key={currentRequirement.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{currentRequirement.name}</CardTitle>
                      <CardDescription>
                        {currentRequirement.rules.length} validation rules • {currentRequirement.rules.filter(r => r.autoCorrect).length} auto-correctable
                      </CardDescription>
                    </div>
                    {currentRequirement.required && (
                      <Badge variant="destructive">Required</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* AI Checks Preview */}
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">AI will check for:</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {currentRequirement.rules.map(rule => (
                            <div key={rule.id} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" />
                              <span>{rule.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Zone */}
                  {currentDocuments.length === 0 && (
                    <DocumentUpload
                      documentType={currentRequirement.type}
                      onUpload={handleDocumentUpload}
                    />
                  )}

                  {/* Uploaded Documents */}
                  {currentDocuments.length > 0 && (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {currentDocuments.map(doc => (
                          <UploadedDocumentCard
                            key={doc.id}
                            document={doc}
                            onRemove={() => handleRemoveDocument(doc.id)}
                            onView={() => handleViewDocument(doc)}
                          />
                        ))}
                      </AnimatePresence>

                      {canProceed && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3"
                        >
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Allow adding more
                            }}
                            className="flex-1"
                          >
                            Upload Another
                          </Button>
                          <Button
                            variant="accent"
                            onClick={handleNextRequirement}
                            className="flex-1 group"
                          >
                            {currentRequirementIndex < ruleSet.requirements.length - 1
                              ? 'Next Document'
                              : 'Complete Validation'}
                            <CheckCircle2 className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Document Detail Modal (simplified) */}
      {selectedDocument && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDocument(null)}
        >
          <div
            className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Validation Details</h3>
              {selectedDocument.validation && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Compliance Score</p>
                      <p className={`text-3xl font-bold font-mono ${getComplianceColor(selectedDocument.validation.complianceScore)}`}>
                        {selectedDocument.validation.complianceScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-3xl font-bold font-mono text-accent">
                        {selectedDocument.validation.overallConfidence}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Validation Results</h4>
                    <div className="space-y-2">
                      {selectedDocument.validation.results.map((result, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          {result.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{result.rule.name}</p>
                            <p className="text-sm text-muted-foreground">{result.details}</p>
                            {result.correctionApplied && (
                              <Badge variant="success" className="mt-1 text-xs">
                                Auto-corrected
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedDocument(null)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
