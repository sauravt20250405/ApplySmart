import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Trash2, Download, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';

export function DocumentVault() {
  const { setCurrentPage } = useApp();
  const [mockDocuments] = useState([
    {
      id: '1',
      name: 'NDA_PHOTO_123456_2026.jpg',
      type: 'photo' as const,
      examType: 'NDA' as const,
      year: 2026,
      version: 1,
      fileUrl: '#',
      thumbnailUrl: '#',
      encrypted: true,
      createdAt: '2026-01-25T10:30:00.000Z',
      expiresAt: '2026-02-24T10:30:00.000Z',
    },
    {
      id: '2',
      name: 'NDA_SIGNATURE_123456_2026.jpg',
      type: 'signature' as const,
      examType: 'NDA' as const,
      year: 2026,
      version: 1,
      fileUrl: '#',
      thumbnailUrl: '#',
      encrypted: true,
      createdAt: '2026-01-25T10:35:00.000Z',
      expiresAt: '2026-02-24T10:35:00.000Z',
    },
    {
      id: '3',
      name: 'JEE_PHOTO_987654_2026.jpg',
      type: 'photo' as const,
      examType: 'JEE' as const,
      year: 2026,
      version: 2,
      fileUrl: '#',
      thumbnailUrl: '#',
      encrypted: true,
      createdAt: '2026-01-24T14:20:00.000Z',
      expiresAt: '2026-02-23T14:20:00.000Z',
    },
  ]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      // In production, this would delete the document
      alert('Document deleted');
    }
  };

  const handleDownload = (doc: any) => {
    // In production, this would download the file
    alert(`Downloading ${doc.name}`);
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

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
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Document Vault
          </h1>
          <p className="text-primary-foreground/80">
            Securely stored, encrypted, and versioned documents
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Security Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 border-accent/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">End-to-End Encryption & Privacy</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• All documents are encrypted at rest and in transit</li>
                      <li>• Auto-delete after 30 days (DPDP Act compliance)</li>
                      <li>• Manual deletion available anytime</li>
                      <li>• No third-party access to your documents</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents List */}
          <div className="space-y-4">
            {mockDocuments.map((doc, index) => {
              const daysLeft = getDaysUntilExpiry(doc.expiresAt);
              const isExpiringSoon = daysLeft <= 7;

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="hover:border-accent/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-8 h-8 text-accent" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate mb-1">{doc.name}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline">
                                  {doc.examType} {doc.year}
                                </Badge>
                                <Badge variant="outline">
                                  {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                                </Badge>
                                {doc.version > 1 && (
                                  <Badge variant="accent">v{doc.version}</Badge>
                                )}
                                {doc.encrypted && (
                                  <Badge variant="success" className="text-xs">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Encrypted
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                            <div>
                              <span className="font-medium">Created:</span> {formatDate(doc.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Expires:</span> {formatDate(doc.expiresAt)}
                              {isExpiringSoon && (
                                <AlertCircle className="w-4 h-4 text-warning ml-1" />
                              )}
                            </div>
                          </div>

                          {isExpiringSoon && (
                            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
                              <p className="text-sm text-warning">
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                This document will auto-delete in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(doc)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(doc.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State (if no documents) */}
          {mockDocuments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start an application to create and store compliant documents
                </p>
                <Button onClick={() => setCurrentPage('dashboard')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Data Control</CardTitle>
                <CardDescription>
                  You have full control over your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => alert('In production, this would download all your data')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete ALL documents? This action cannot be undone.')) {
                      alert('All documents deleted');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Documents
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
