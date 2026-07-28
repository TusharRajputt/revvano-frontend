import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSiteSettings } from '@/hooks/use-site-settings';

interface SizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productSizeGuide?: { note: string; headers: string[]; rows: string[][] };
}

export function SizeGuideModal({ open, onOpenChange, productSizeGuide }: SizeGuideModalProps) {
  const { data: settings } = useSiteSettings();
  const guide = productSizeGuide || settings?.sizeGuide;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-light">Size Guide</DialogTitle>
        </DialogHeader>

        {guide ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">{guide.note}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {guide.headers.map((h, i) => (
                      <th key={i} className="text-left py-2 pr-4 font-semibold uppercase text-xs tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border/50">
                      {row.map((cell, j) => (
                        <td key={j} className={j === 0 ? 'py-2 pr-4 font-medium' : 'py-2 pr-4 text-muted-foreground'}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Size guide is being updated. Please check back shortly.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
