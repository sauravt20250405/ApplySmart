import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Download, Home, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { getComplianceColor } from '@/lib/utils';

export function ComplianceReport() {
  const { setCurrentPage } = useApp();

  // Mock data (in production, this would come from actual validation)
  const mockReport = {
    overallScore: 98,
    totalChecks: 14,
    passed: 13,
    autoFixed: 7,
    confidence: 97,
    documents: [
      {
        name: 'NDA_PHOTO_123456_2026.jpg',
        type: 'Photo',
        compliance: 100,
        checks: [
          { name: 'Dimension Check', passed: true, autoFixed: true, rule: 'NDA Rule 4.2(a)', confidence: 98 },
          { name: 'DPI Check', passed: true, autoFixed: true, rule: 'NDA Rule 4.2(b)', confidence: 96 },
          { name: 'File Size', passed: true, autoFixed: true, rule: 'NDA Rule 4.2(c)', confidence: 99 },
          { name: 'Format', passed: true, autoFixed: false, rule: 'NDA Rule 4.2(d)', confidence: 100 },
          { name: 'Background', passed: true, autoFixed: true, rule: 'NDA Rule 4.2(e)', confidence: 94 },
          { name: 'Shadow/Glare', passed: true, autoFixed: true, rule: 'NDA Rule 4.2(f)', confidence: 91 },
          { name: 'Face Detection', passed: true, autoFixed: false, rule: 'NDA Rule 4.2(g)', confidence: 97 },
        ],
      },
      {
        name: 'NDA_SIGNATURE_123456_2026.jpg',
        type: 'Signature',
        compliance: 95,
        checks: [
          { name: 'Dimension Check', passed: true, autoFixed: true, rule: 'NDA Rule 4.3(a)', confidence: 98 },
          { name: 'File Size', passed: true, autoFixed: true, rule: 'NDA Rule 4.3(b)', confidence: 95 },
          { name: 'Format', passed: true, autoFixed: false, rule: 'NDA Rule 4.3(c)', confidence: 100 },
          { name: 'Background', passed: false, autoFixed: false, rule: 'NDA Rule 4.3(d)', confidence: 85 },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-success to-success/80 text-success-foreground py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 bg-success-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Exam-Ready Documents
            </h1>
            <p className="text-xl opacity-90 mb-6">
              All documents validated and compliant with NDA 2026 standards
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div>
                <p className="text-sm opacity-80">Overall Compliance</p>
                <p className="text-4xl font-bold font-mono">{mockReport.overallScore}%</p>
              </div>
              <div className="w-px h-12 bg-success-foreground/20" />
              <div>
                <p className="text-sm opacity-80">AI Confidence</p>
                <p className="text-4xl font-bold font-mono">{mockReport.confidence}%</p>
              </div>
              <div className="w-px h-12 bg-success-foreground/20" />
              <div>
                <p className="text-sm opacity-80">Auto-Fixed</p>
                <p className="text-4xl font-bold font-mono">{mockReport.autoFixed}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" />
                    Validation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Checks</span>
                      <span className="font-bold font-mono">{mockReport.totalChecks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Passed</span>
                      <span className="font-bold font-mono text-success">{mockReport.passed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Auto-Corrected</span>
                      <span className="font-bold font-mono text-accent">{mockReport.autoFixed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Explainable AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Every validation includes full transparency:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>What was checked & why it passed/failed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Which official rule was applied</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>How auto-correction was performed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>AI confidence score for each check</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Document Details */}
          <div className="space-y-6">
            {mockReport.documents.map((doc, docIndex) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (docIndex + 2) }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{doc.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{doc.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={doc.compliance >= 90 ? 'success' : 'warning'}
                          className="mb-2"
                        >
                          {doc.compliance}% Compliant
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {doc.checks.filter(c => c.passed).length} / {doc.checks.length} checks passed
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {doc.checks.map((check, checkIndex) => (
                        <div
                          key={checkIndex}
                          className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {check.passed ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-warning" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <h4 className="font-semibold">{check.name}</h4>
                              <Badge
                                variant="outline"
                                className="flex-shrink-0 font-mono text-xs"
                              >
                                {check.confidence}%
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Reference: {check.rule}
                            </p>
                            {check.autoFixed && (
                              <div className="flex items-center gap-2">
                                <Badge variant="success" className="text-xs">
                                  Auto-corrected
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  AI automatically fixed this issue
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="xl"
              variant="accent"
              onClick={() => {
                alert('In production, this would download all compliant documents as a ZIP file');
              }}
              className="flex-1 group"
            >
              <Download className="w-5 h-5 mr-2" />
              Download All Documents
            </Button>
            <Button
              size="xl"
              variant="outline"
              onClick={() => setCurrentPage('dashboard')}
              className="flex-1"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>

          {/* Trust Message */}
          <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border text-center">
            <p className="text-sm text-muted-foreground">
              <Shield className="w-4 h-4 inline mr-2" />
              All documents are encrypted and will be auto-deleted after 30 days.
              <br />
              You can manually delete them anytime from your Document Vault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
