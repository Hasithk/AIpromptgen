import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with AI Prompt Generator. Contact us for support, feedback, or business inquiries.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
