import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, Mail, Lock } from 'lucide-react';

// --- FIXED IMPORTS ---
import { Button } from '../ui/button'; 
import { Input } from '../ui/input'; 
import { useApp } from '../../../context/AppContext'; 
import apiClient from '../../../lib/api-client'; 

export function OTPAuth() {
  // We need setCurrentPage to manually switch screens after login
  const { setCurrentPage } = useApp(); 
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
        await apiClient.sendOtp({ email }); 
        setStep('otp');
    } catch (err: any) {
        console.error("Send OTP Error:", err);
        setError(err.message || 'Failed to send OTP. Try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Log in via API (Saves token)
      await apiClient.login({ email, otp });
      
      // 2. ✨ CORRECT FIX: Manually switch to Dashboard
      // Do NOT reload the page, or it will reset to Landing!
      setCurrentPage('dashboard'); 
      
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.error || 'Invalid OTP. Please try again.'); 
      setLoading(false); 
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
        await apiClient.sendOtp({ email });
        setOtp('');
    } catch (err) {
        setError('Failed to resend OTP');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-accent/80 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('landing')}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-10 border border-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to ApplySmart</h1>
            <p className="text-muted-foreground">
              Secure, passwordless authentication
            </p>
          </div>

          {/* Email Step */}
          {step === 'email' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e: any) => {
                        setEmail(e.target.value);
                        setError('');
                    }}
                    className="pl-12"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className="w-full"
                size="lg"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </motion.div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Enter OTP</label>
                  <button
                    onClick={() => setStep('email')}
                    className="text-sm text-accent hover:underline"
                  >
                    Change email
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  OTP sent to {email}
                </p>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e: any) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) setOtp(value);
                    }}
                    className="pl-12 font-mono tracking-widest text-center text-lg"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full"
                size="lg"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
            </motion.div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>DPDP Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}