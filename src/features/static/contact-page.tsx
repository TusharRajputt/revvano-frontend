import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BRAND } from '@/constants';

export function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message sent', description: 'We will get back to you within 24 hours.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton className="mb-2" />
      </div>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with any questions, styling advice, or just to say hello."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-8">
            {[
              { icon: Mail, label: 'Email', value: BRAND.email },
              { icon: Phone, label: 'Phone', value: BRAND.phone },
              { icon: MapPin, label: 'Address', value: BRAND.address },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <item.icon className="h-6 w-6 text-accent mb-3" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              </div>
              <FormField label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">Message</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <Button type="submit" className="h-12">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function FormField({
  label, value, onChange, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
