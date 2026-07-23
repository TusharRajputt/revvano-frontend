import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/common/back-button';

const schema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Values) => {
    if (!email || !token) {
      toast({
        title: 'Reset session expired',
        description: 'Please start the forgot password flow again.',
        variant: 'destructive',
      });
      navigate('/forgot-password');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, token, data.password);
      toast({ title: 'Password reset!', description: 'You can now log in with your new password.' });
      navigate('/login');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not reset password. Please try again.';
      toast({ title: 'Reset failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <BackButton className="mb-6" fallback="/login" label="Back to login" />
        <h1 className="font-heading text-3xl font-light mb-2">Set New Password</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Choose a new password for <span className="font-semibold text-foreground">{email || 'your account'}</span>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full bg-background border border-border pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="w-full bg-background border border-border pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
            {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Remembered your password? <Link to="/login" className="font-semibold text-foreground hover:text-accent underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
