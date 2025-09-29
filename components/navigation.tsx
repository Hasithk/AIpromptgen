'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CreditDisplay } from '@/components/credit-display';

const navigation = [
  { name: 'Generator', href: '/' },
  { name: 'Library', href: '/library' },
  { name: 'History', href: '/history' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <nav className="container-max section-padding flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-hero-gradient rounded-lg group-hover:shadow-lg transition-all duration-200">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">
            AI Prompt Gen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                pathname === item.href
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <CreditDisplay />
          <ThemeToggle />
          <Button variant="outline" size="sm" className="space-x-2">
            <User className="h-4 w-4" />
            <span>Sign In</span>
          </Button>
          <Button size="sm" className="btn-primary space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Upgrade</span>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="container-max section-padding py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-base font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-3">
              <CreditDisplay />
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  Sign In
                </Button>
                <Button className="flex-1 btn-primary">
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}