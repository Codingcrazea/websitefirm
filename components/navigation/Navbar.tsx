'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CompanyConfig, NavigationConfig } from '@/types/config';
import { Button } from '../ui/Button';
import { CallButton } from '../ui/CallButton';
import { Menu, X, ChevronDown, Cpu, Building2, Smartphone, Cloud, ShieldCheck, ArrowRight } from 'lucide-react';

interface NavbarProps {
  company: CompanyConfig;
  nav: NavigationConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ company, nav }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-gold-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-gold-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-gold-400" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-gold-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-gold-400" />;
      default:
        return <Cpu className="w-5 h-5 text-gold-400" />;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-dark/90 backdrop-blur-md border-b border-gold-glass shadow-lg py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 flex items-center justify-center p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <span className="font-bold text-gold-300 text-xl tracking-tighter">N</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight group-hover:text-gold-300 transition-colors">
              {company.companyName}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Enterprise Systems</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.mainNav.map((item) => {
            const isActive = pathname === item.path;
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div
                key={item.path}
                className="relative group"
                onMouseEnter={() => hasChildren && setActiveDropdown(item.label)}
                onMouseLeave={() => hasChildren && setActiveDropdown(null)}
              >
                <Link
                  href={item.path}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 ${
                    isActive ? 'text-gold-300' : 'text-slate-300 hover:text-gold-300'
                  }`}
                >
                  {item.label}
                  {hasChildren && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />}
                </Link>

                {/* Dropdown Menu */}
                {hasChildren && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 w-80 pt-2 z-50">
                    <div className="glass-panel rounded-2xl p-4 shadow-2xl border border-gold-400/20 backdrop-blur-xl">
                      <div className="space-y-3">
                        {item.children?.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gold-400/10 transition-colors group/item"
                          >
                            <div className="p-2 rounded-lg bg-surface-light border border-gold-400/10 group-hover/item:border-gold-400/30">
                              {getIconComponent(child.icon)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white group-hover/item:text-gold-300 flex items-center gap-1">
                                {child.label}
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-gold-400" />
                              </div>
                              <div className="text-xs text-slate-400 line-clamp-1">{child.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <CallButton company={company} variant="ghost" size="sm" />
          <Link href="/contact">
            <Button variant="primary" size="sm">
              Book Proposal Call
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-gold-glass px-4 pt-4 pb-6 space-y-4">
          {nav.mainNav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block text-base font-medium text-slate-200 hover:text-gold-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <CallButton company={company} variant="outline" className="w-full" />
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Book Proposal Call
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
