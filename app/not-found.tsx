import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-gold-400/30 text-center space-y-6">
        <div className="text-6xl font-extrabold gold-gradient-text">404</div>
        <h1 className="text-2xl font-bold text-white">Resource Not Found</h1>
        <p className="text-slate-400 text-sm">
          The page or system specification you requested does not exist or has been moved.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="primary" size="md" className="gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
