import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/Aipromptgen.png"
                  alt="AI Prompt Gen Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold gradient-text">
                AI Prompt Gen
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The #1 free AI prompt generator. Create perfect AI prompts for ChatGPT, Midjourney, DALL-E, Sora, and all AI platforms.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com/aipromptgen" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="View our GitHub repository">
                <Github className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="mailto:lookinternationallk@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Send us an email">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">AI Prompt Tools</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Prompt Generator
              </Link>
              <Link href="/library" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Prompt Library
              </Link>
              <Link href="/history" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Prompt History
              </Link>
              <Link href="/api" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Prompt API
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">AI Prompt Resources</h4>
            <div className="space-y-2 text-sm">
              <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Prompt Blog
              </Link>
              <Link href="/guides" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Prompt Guides
              </Link>
              <Link href="/docs" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Prompt Docs
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Company</h4>
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

        <div className="mt-8 pt-8 border-t text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI Prompt Gen — The Best Free AI Prompt Generator. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            AI Prompt Generator for ChatGPT, Midjourney, DALL-E, Sora, Claude, Gemini. Free AI prompt templates, examples, and engineering tools.
          </p>
        </div>
      </div>
    </footer>
  );
}