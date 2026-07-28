import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/common/back-button';

const schema = z.object({ email: z.string().email('Invalid email address') });
type Values = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Values) => {
    setLoading(true);
    await authService.forgotPassword(data.email);
    toast({ title: 'OTP sent', description: 'Check your email for the verification code.' });
    navigate(`/otp?email=${encodeURIComponent(data.email)}`);
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <BackButton className="mb-6" fallback="/login" label="Back to login" />
        <h1 className="font-heading text-3xl font-light mb-2">Forgot Password</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your email and we'll send you a verification code to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                {...register('email')}
                className="w-full bg-background border border-border pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Code'}
            {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
