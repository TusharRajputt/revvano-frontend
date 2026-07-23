import { BackButton } from '@/components/common/back-button';
import { PageHeader } from '@/components/common/page-header';

interface PolicyPageProps {
  title: string;
  breadcrumb: string;
  sections: { heading: string; body: string }[];
}

export function PolicyPage({ title, breadcrumb, sections }: PolicyPageProps) {
  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton className="mb-2" />
      </div>
      <PageHeader
        title={title}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: breadcrumb }]}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-heading text-2xl font-medium mb-3">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-12 pt-8 border-t border-border">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </>
  );
}

export function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      breadcrumb="Privacy Policy"
      sections={[
        { heading: 'Information We Collect', body: 'We collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you create an account or place an order. We also automatically collect certain data about your device and browsing behavior.' },
        { heading: 'How We Use Your Information', body: 'We use your information to process orders, communicate with you about your purchases, provide customer support, personalize your shopping experience, and send you updates about new collections and promotions (with your consent).' },
        { heading: 'Information Sharing', body: 'We do not sell your personal information. We may share data with trusted third-party service providers who help us operate our business (payment processors, shipping carriers, email providers) under strict confidentiality agreements.' },
        { heading: 'Data Security', body: 'We implement industry-standard security measures to protect your personal information, including SSL encryption for all transactions and secure data storage. However, no method of transmission over the internet is 100% secure.' },
        { heading: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.' },
        { heading: 'Cookies', body: 'We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings.' },
      ]}
    />
  );
}

export function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      breadcrumb="Refund Policy"
      sections={[
        { heading: 'Return Window', body: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. Items marked as final sale are not eligible for return.' },
        { heading: 'How to Initiate a Return', body: 'To start a return, log into your account, go to your orders, and select the items you wish to return. You will receive a return shipping label via email within 24 hours.' },
        { heading: 'Refund Processing', body: 'Once we receive and inspect your returned items, your refund will be processed within 5-7 business days to your original payment method. Shipping costs are non-refundable unless the return is due to our error.' },
        { heading: 'Exchanges', body: 'To exchange an item for a different size or color, please initiate a return for the original item and place a new order for the desired item. This ensures the fastest possible exchange.' },
        { heading: 'Damaged or Defective Items', body: 'If you receive a damaged or defective item, please contact us within 7 days of delivery with photos. We will arrange a replacement or full refund at no cost to you.' },
      ]}
    />
  );
}

export function CancellationPolicyPage() {
  return (
    <PolicyPage
      title="Cancellation Policy"
      breadcrumb="Cancellation Policy"
      sections={[
        { heading: 'Cancelling Before Shipment', body: 'You may cancel an order free of charge at any time before it has been shipped. Go to your Orders page, select the order, and choose Cancel Order. A full refund will be issued to your original payment method within 5-7 business days.' },
        { heading: 'Cancelling After Shipment', body: 'Once an order has been shipped, it can no longer be cancelled. You may instead refuse delivery or initiate a return once the item arrives, in accordance with our Refund Policy.' },
        { heading: 'Order Changes', body: 'If you need to change the size, color, or shipping address on an order that has not yet shipped, please contact us as soon as possible. We cannot guarantee changes once an order has entered processing.' },
        { heading: 'Cancellations by रेvvano', body: 'We reserve the right to cancel an order due to stock unavailability, pricing errors, or suspected fraudulent activity. If we cancel your order, you will be notified by email and refunded in full within 5-7 business days.' },
        { heading: 'Refund Timeline', body: 'All cancellation refunds are processed to the original payment method used at checkout. Depending on your bank or payment provider, it may take an additional 2-5 business days for the refund to reflect in your account after we initiate it.' },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      breadcrumb="Terms & Conditions"
      sections={[
        { heading: 'Acceptance of Terms', body: 'By accessing and using the Revvano website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our site.' },
        { heading: 'Products & Pricing', body: 'All products are subject to availability. We reserve the right to modify or discontinue products at any time. Prices are listed in Indian Rupees (INR) and are subject to change without notice. We make every effort to display accurate product colors and descriptions.' },
        { heading: 'Orders', body: 'Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order. You will receive an order confirmation email upon successful placement.' },
        { heading: 'Intellectual Property', body: 'All content on this website, including text, images, logos, and design elements, is the property of Revvano and is protected by intellectual property laws. You may not reproduce or distribute our content without written permission.' },
        { heading: 'Limitation of Liability', body: 'Revvano is not liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount you paid for the product in question.' },
        { heading: 'Governing Law', body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Jammu, Jammu and Kashmir.' },
      ]}
    />
  );
}
