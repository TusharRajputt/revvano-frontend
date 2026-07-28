import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/common/back-button';
import { GoogleIcon } from '@/components/common/google-icon';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  acceptTerms: z.boolean().refine((v) => v, 'You must accept the terms'),
});

type SignupValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupValues) => {
    setLoading(true);
    try {
     const names = data.name.trim().split(" ");

const firstName = names[0];

const lastName = names.slice(1).join(" ") || "";

await registerUser(
  firstName,
  lastName,
  data.email,
  data.password
);
      toast({ title: 'Welcome to रेvvano!' });
      navigate('/profile');
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast({ title: 'Signup failed', description: apiMessage || 'Unable to create account. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({ title: 'Welcome to रेvvano!' });
      navigate('/profile');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-up failed';
      toast({ title: 'Google sign-up failed', description: message, variant: 'destructive' });
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
            src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop"
            alt="रेvvano"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <p className="font-heading text-3xl font-light">Wear Your Mood.</p>
            <p className="text-white/60 text-sm mt-2">Your wardrobe, your personality.</p>
          </div>
        </div>

        {/* Form side */}
        <div className="p-8 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton className="mb-6" fallback="/shop" />
            <h1 className="font-heading text-3xl font-light mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm mb-8">Join the रेvvano circle.</p>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading || loading}
              className="w-full h-12 flex items-center justify-center gap-3 border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 mb-5"
            >
              <GoogleIcon className="h-5 w-5" />
              {googleLoading ? 'Connecting...' : 'Sign up with Google'}
            </button>

            <div className="relative py-2 mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    {...register('name')}
                    className="w-full bg-background border border-border pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>

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

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" {...register('acceptTerms')} className={cn('mt-1', errors.acceptTerms && 'border-destructive')} />
                <span className="text-xs text-muted-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="underline hover:text-accent">Terms</Link> and{' '}
                  <Link to="/privacy-policy" className="underline hover:text-accent">Privacy Policy</Link>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-foreground hover:text-accent underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
