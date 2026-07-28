import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BRAND } from '@/constants';
import { BackButton } from '@/components/common/back-button';
import { GoogleIcon } from '@/components/common/google-icon';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast({ title: 'Welcome back!' });
      navigate('/profile');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid email or password.';
      toast({ title: 'Login failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({ title: 'Welcome back!' });
      navigate('/profile');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      toast({ title: 'Google sign-in failed', description: message, variant: 'destructive' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="grid lg:grid-cols-2 max-w-5xl w-full border border-border overflow-hidden">
        {/* Image side */}
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
            alt="रेvvano"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <p className="font-heading text-3xl font-light">{BRAND.tagline}</p>
            <p className="text-white/60 text-sm mt-2">Join the रेvvano circle.</p>
          </div>
        </div>

        {/* Form side */}
        <div className="p-8 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton className="mb-6" fallback="/shop" />
            <h1 className="font-heading text-3xl font-light mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mb-8">Sign in to your रेvvano account.</p>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full h-12 flex items-center justify-center gap-3 border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <GoogleIcon className="h-5 w-5" />
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Password</label>
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
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs underline text-muted-foreground hover:text-accent">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-foreground hover:text-accent underline">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
