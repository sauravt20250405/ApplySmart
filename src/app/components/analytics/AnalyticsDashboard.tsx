import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Clock, Award, FileCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useApp } from '@/context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getComplianceColor } from '@/lib/utils';

export function AnalyticsDashboard() {
  const { setCurrentPage, analytics } = useApp();

  if (!analytics) return null;

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
            Analytics & Insights
          </h1>
          <p className="text-primary-foreground/80">
            Track your compliance progress and time saved
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 text-success" />
                    <span className={`text-3xl font-bold font-mono ${getComplianceColor(analytics.complianceHistory[analytics.complianceHistory.length - 1].score)}`}>
                      {analytics.complianceHistory[analytics.complianceHistory.length - 1].score}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current Compliance</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileCheck className="w-8 h-8 text-accent" />
                    <span className="text-3xl font-bold font-mono">{analytics.totalApplications}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-warning" />
                    <span className="text-3xl font-bold font-mono">{analytics.timeSaved}<span className="text-lg">m</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <span className="text-3xl font-bold font-mono text-success">
                      {Math.round((analytics.documentStats.autoFixed / analytics.documentStats.total) * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Auto-Fix Rate</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Compliance Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Score Trend</CardTitle>
                  <CardDescription>Your improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analytics.complianceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--accent-cyan)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--accent-cyan)', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rejection Risk */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Rejection Risk Trend</CardTitle>
                  <CardDescription>Lower is better</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analytics.rejectionRiskTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 30]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke="var(--error-red)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--error-red)', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Document Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Document Processing Statistics</CardTitle>
                <CardDescription>Breakdown of document handling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold font-mono mb-2">{analytics.documentStats.total}</div>
                    <p className="text-sm text-muted-foreground">Total Documents</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold font-mono text-success mb-2">{analytics.documentStats.autoFixed}</div>
                    <p className="text-sm text-muted-foreground">Auto-Fixed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold font-mono text-warning mb-2">{analytics.documentStats.manualFixed}</div>
                    <p className="text-sm text-muted-foreground">Manual Fixes</p>
                  </div>
                </div>

                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[
                        { name: 'Auto-Fixed', value: analytics.documentStats.autoFixed, fill: 'var(--success-green)' },
                        { name: 'Manual', value: analytics.documentStats.manualFixed, fill: 'var(--warning-orange)' },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" fill="var(--accent-cyan)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                    <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="font-semibold text-success mb-1">Excellent Progress!</p>
                      <p className="text-sm text-muted-foreground">
                        Your compliance score improved by 20% over the last month. Keep up the good work!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <Clock className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-semibold text-accent mb-1">Time Saved</p>
                      <p className="text-sm text-muted-foreground">
                        ApplySmart has saved you {analytics.timeSaved} minutes compared to manual corrections. That's over {Math.round(analytics.timeSaved / 60)} hours!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Award className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Automation Rate</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((analytics.documentStats.autoFixed / analytics.documentStats.total) * 100)}% of your documents were automatically corrected without any manual intervention.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
