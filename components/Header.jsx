import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Home } from "lucide-react";
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header({ title, showBack, onSettingsClick, personas }) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        {showBack && (
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-3 w-3" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span>/</span>
            <span className="truncate">{title}</span>
          </div>
          {personas && (
            <div className="flex items-center gap-2">
              {Object.values(personas).map((persona) => (
                <div key={persona.id} className="flex items-center gap-1.5 text-xs">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {persona.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium">{persona.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
