import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/common/back-button';

export function OtpPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[i] = value;
    setOtp(next);
    if (value && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const code = otp.join('');
    try {
      const { resetToken } = await authService.verifyOtp(email, code);
      toast({ title: 'Verified!', description: 'Now set your new password.' });
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`);
    } catch {
      toast({ title: 'Invalid code', description: 'Please try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <BackButton className="mb-6" fallback="/forgot-password" label="Back" />
        <h1 className="font-heading text-3xl font-light mb-2">Enter Verification Code</h1>
        <p className="text-muted-foreground text-sm mb-8">
          We sent a 6-digit code to <span className="font-semibold text-foreground">{email || 'your email'}</span>
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                'w-12 h-14 text-center text-xl font-semibold border-2 bg-background focus:outline-none transition-colors',
                digit ? 'border-accent' : 'border-border focus:border-accent',
              )}
            />
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={loading || otp.some((d) => !d)} className="w-full h-12">
          {loading ? 'Verifying...' : 'Verify Code'}
          {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>

        <p className="text-sm text-muted-foreground mt-6">
          Didn't receive a code?{' '}
          <button
            type="button"
            onClick={async () => {
              try {
                await authService.forgotPassword(email);
                toast({ title: 'Code resent', description: 'Check your email again.' });
              } catch {
                toast({ title: 'Could not resend code', variant: 'destructive' });
              }
            }}
            className="font-semibold text-foreground hover:text-accent underline"
          >
            Resend
          </button>
        </p>
      </motion.div>
    </div>
  );
}
