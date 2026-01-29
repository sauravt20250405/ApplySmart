import { motion } from 'motion/react';
import { FileText, TrendingUp, Award, Clock, ChevronRight } from 'lucide-react';

// --- FIXED IMPORTS (One level up only) ---
import { Button } from '../ui/button'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// --- FIXED IMPORTS (Three levels up to src) ---
import { useApp } from '../../../context/AppContext';
import { formatDate, getComplianceColor } from '../../../lib/utils';

export function Dashboard() {
  const { user, analytics, setCurrentPage } = useApp();

  // --- SAFE DATA ACCESS (Prevents White Screen Crash) ---
  const complianceHistory = analytics?.complianceHistory || [];
  const latestCompliance = complianceHistory.length > 0 
    ? complianceHistory[complianceHistory.length - 1] 
    : { score: 0 };

  const examCards = [
    {
      id: 'NDA',
      name: 'National Defence Academy',
      shortName: 'NDA',
      year: 2026,
      deadline: '2026-03-15',
      status: 'active',
      applicationCount: 2,
    },
    {
      id: 'JEE',
      name: 'Joint Entrance Examination',
      shortName: 'JEE Main',
      year: 2026,
      deadline: '2026-02-28',
      status: 'active',
      applicationCount: 1,
    },
    {
      id: 'NEET',
      name: 'National Eligibility Entrance Test',
      shortName: 'NEET',
      year: 2026,
      deadline: '2026-04-10',
      status: 'upcoming',
      applicationCount: 0,
    },
  ];

  const recentApplications = [
    {
      id: '1',
      exam: 'NDA 2026',
      status: 'ready',
      compliance: 98,
      date: '2026-01-25',
    },
    {
      id: '2',
      exam: 'JEE Main 2026',
      status: 'validating',
      compliance: 85,
      date: '2026-01-24',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}!
            </h1>
            <p className="text-primary-foreground/80">
              Your exam applications at a glance
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
                    <p className={`text-3xl font-bold font-mono ${getComplianceColor(latestCompliance.score)}`}>
                      {latestCompliance.score}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-success" />
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Applications</p>
                    <p className="text-3xl font-bold font-mono">{analytics?.totalApplications || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Time Saved</p>
                    <p className="text-3xl font-bold font-mono">{analytics?.timeSaved || 0}<span className="text-lg">m</span></p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Auto-Fixed</p>
                    <p className="text-3xl font-bold font-mono">{analytics?.documentStats?.autoFixed || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Exams */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Available Exams</h2>
            </div>

            <div className="space-y-4">
              {examCards.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card 
                    className="hover:border-accent/50 transition-colors cursor-pointer group"
                    onClick={() => {
                        localStorage.setItem('selectedExam', JSON.stringify(exam));
                        setCurrentPage('exam-start');
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{exam.shortName} {exam.year}</h3>
                            {exam.status === 'active' && <Badge variant="success">Active</Badge>}
                            {exam.status === 'upcoming' && <Badge variant="outline">Upcoming</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{exam.name}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Deadline:</span>{' '}
                              <span className="font-medium">{formatDate(exam.deadline)}</span>
                            </div>
                            {exam.applicationCount > 0 && (
                              <div>
                                <span className="text-muted-foreground">Applications:</span>{' '}
                                <span className="font-medium">{exam.applicationCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button className="flex-1 group-hover:bg-primary/90">
                          {exam.applicationCount > 0 ? 'Continue Application' : 'Start Application'}
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{app.exam}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(app.date)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={app.status === 'ready' ? 'success' : 'warning'} className="text-xs">
                          {app.status}
                        </Badge>
                        <span className={`text-xs font-mono ${getComplianceColor(app.compliance)}`}>
                          {app.compliance}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentPage('vault')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Document Vault
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentPage('analytics')}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}