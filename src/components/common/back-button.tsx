import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
  label?: string;
  fallback?: string;
}

export function BackButton({ className, label = 'Back', fallback = '/' }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1 && location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group',
        className,
      )}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </button>
  );
}
