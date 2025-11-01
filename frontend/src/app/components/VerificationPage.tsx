"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, Mail, Loader2 } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface VerificationPageProps {
  email: string;
  onVerified?: () => void;
}

export function VerificationPage({ email, onVerified }: VerificationPageProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const router = useRouter();

  const checkVerification = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      if (user) {
        // If we can get the user, they're likely verified
        setIsVerified(true);
        setIsChecking(false);
        toast.success('Email verified successfully!');
        
        // Wait a moment to show the success animation
        setTimeout(() => {
          if (onVerified) {
            onVerified();
          } else {
            router.push('/');
          }
        }, 2000);
        return true;
      }
    } catch (error) {
      // User not verified yet or token expired
      console.log('Not verified yet, checking again...');
    }
    
    setIsChecking(false);
    return false;
  };

  useEffect(() => {
    // Initial check
    checkVerification();

    // Poll every 3 seconds for verification
    const interval = setInterval(async () => {
      if (!isVerified) {
        setIsChecking(true);
        const verified = await checkVerification();
        if (verified) {
          clearInterval(interval);
        } else {
          setCheckCount(prev => prev + 1);
        }
        setIsChecking(false);
      }
    }, 3000);

    // Cleanup interval after 2 minutes (40 checks)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!isVerified) {
        toast.error('Verification timed out. Please check your email and try again.');
      }
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVerified]);

  const handleResendEmail = () => {
    // TODO: Implement resend verification email endpoint
    toast.info('Verification email will be resent (feature coming soon)');
  };

  const handleSkip = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {isVerified ? (
              <div className="relative">
                {/* Green gradient check icon */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-lg">
                  <CheckCircle2 className="w-16 h-16 text-white animate-scale-in" />
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Animated mail icon with gradient ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-gray-100 rounded-full p-4">
                  {isChecking ? (
                    <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
                  ) : (
                    <Mail className="w-16 h-16 text-green-600" />
                  )}
                </div>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isVerified ? 'Email Verified!' : 'Verify Your Email'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerified ? (
            <>
              <div className="text-center space-y-2">
                <p className="text-green-600 font-semibold text-lg animate-fade-in">
                  Your email has been verified successfully!
                </p>
                <p className="text-gray-600">
                  Redirecting you to the home page...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <p className="text-gray-700 font-medium">
                  We've sent a verification email to:
                </p>
                <p className="text-green-600 font-semibold break-all">
                  {email}
                </p>
                <p className="text-gray-600 text-sm mt-4">
                  Please check your inbox and click the verification link.
                </p>
                {isChecking && (
                  <p className="text-green-600 text-sm mt-2 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking verification status...
                  </p>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                  disabled={isChecking}
                >
                  Resend Verification Email
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="w-full text-gray-600"
                  disabled={isChecking}
                >
                  Skip for now
                </Button>
              </div>

              {checkCount > 0 && (
                <p className="text-center text-xs text-gray-500">
                  Checked {checkCount} time{checkCount !== 1 ? 's' : ''}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

