import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header({ title, showBack, onSettingsClick, personas, activePersonaId }) {
  // Determine the "other" persona (the one we are talking TO)
  // If active is A, show B. If active is B, show A.
  // Default to the first one if logic fails
  let otherPersona = null;
  if (personas && activePersonaId) {
    const otherId = activePersonaId === 'A' ? 'B' : 'A';
    otherPersona = personas[otherId];
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
      <div className="flex h-14 md:h-16 items-center gap-2 px-3 md:px-6">
        {showBack && (
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0 -ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        
        {/* Avatar of the person we are talking to */}
        {otherPersona && (
          <Avatar className="h-8 w-8 border border-border shrink-0">
            <AvatarImage src={otherPersona.avatar} />
            <AvatarFallback>{otherPersona.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 min-w-0 ml-4">
          <h1 className="font-bold text-base md:text-2xl truncate leading-tight">
            {title}
          </h1>
          {/* {otherPersona && (
            <p className="text-xs text-muted-foreground truncate">
              Talking to {otherPersona.name}
            </p>
          )} */}
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
