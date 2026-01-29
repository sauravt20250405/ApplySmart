import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileCheck, Upload, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { getRuleSet } from '@/data/exam-rules';
import { formatDate } from '@/lib/utils';

export function ExamStart() {
  const { setCurrentPage } = useApp();
  const [examInfo, setExamInfo] = useState<any>(null);
  const [ruleSet, setRuleSet] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedExam');
    if (stored) {
      const exam = JSON.parse(stored);
      setExamInfo(exam);
      
      // Load rule set
      const rules = getRuleSet(exam.id, exam.year);
      setRuleSet(rules);
    }
  }, []);

  if (!examInfo || !ruleSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {examInfo.shortName} {examInfo.year} Application
              </h1>
              <p className="text-primary-foreground/80">
                {examInfo.name}
              </p>
            </div>
            <Badge variant="secondary" className="hidden md:inline-flex">
              Deadline: {formatDate(examInfo.deadline)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Rule Version Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 border-accent/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      Latest Rules Loaded: Version {ruleSet.version}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Last updated: {formatDate(ruleSet.lastUpdated)}
                    </p>
                    <p className="text-sm">
                      All requirements and validations are automatically synced with the latest official {examInfo.id} guidelines.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
                <CardDescription>
                  Upload the following documents. Our AI will validate and auto-correct them.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ruleSet.requirements.map((req: any, index: number) => (
                  <div key={req.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{req.name}</h4>
                        {req.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {req.rules.length} validation rules will be checked
                      </p>
                      <div className="space-y-1">
                        {req.rules.slice(0, 3).map((rule: any) => (
                          <div key={rule.id} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 text-success" />
                            <span className="text-muted-foreground">{rule.name}</span>
                            {rule.autoCorrect && (
                              <Badge variant="success" className="text-xs">Auto-fix</Badge>
                            )}
                          </div>
                        ))}
                        {req.rules.length > 3 && (
                          <p className="text-xs text-muted-foreground ml-5">
                            +{req.rules.length - 3} more checks
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Document Naming Convention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>File Naming Convention</CardTitle>
                <CardDescription>
                  Your files will be automatically renamed to match {examInfo.id} requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                  <p className="text-muted-foreground mb-1">Pattern:</p>
                  <p className="font-semibold">{ruleSet.documentNaming.pattern}</p>
                  <p className="text-muted-foreground mt-3 mb-1">Example:</p>
                  <p className="text-success">{ruleSet.documentNaming.example}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Button
              size="xl"
              variant="accent"
              onClick={() => {
                setCurrentPage('upload');
                localStorage.setItem('currentRuleSet', JSON.stringify(ruleSet));
              }}
              className="group"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Uploading Documents
              <CheckCircle2 className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Your documents will be validated and corrected in real-time
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
