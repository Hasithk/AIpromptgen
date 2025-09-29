import Link from 'next/link';
import { Zap, Twitter, Github, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-hero-gradient rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">
                AI Prompt Gen
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The most advanced AI prompt generation platform for creators, designers, and professionals.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Generator
              </Link>
              <Link href="/library" className="block text-muted-foreground hover:text-primary transition-colors">
                Prompt Library
              </Link>
              <Link href="/history" className="block text-muted-foreground hover:text-primary transition-colors">
                History
              </Link>
              <Link href="/api" className="block text-muted-foreground hover:text-primary transition-colors">
                API Access
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <div className="space-y-2 text-sm">
              <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/guides" className="block text-muted-foreground hover:text-primary transition-colors">
                Guides
              </Link>
              <Link href="/docs" className="block text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </Link>
              <Link href="/support" className="block text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI Prompt Gen. All rights reserved. Built with 💜 for the AI community.
          </p>
        </div>
      </div>
    </footer>
  );
}