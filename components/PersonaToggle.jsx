import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function PersonaToggle({ activePersonaId, personas, onToggle, className }) {
  const isB = activePersonaId === 'B';
  const currentPersona = personas[activePersonaId];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Send as
        </span>
        <span className="text-xs font-bold truncate max-w-[80px]">
          {currentPersona.name}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch 
          checked={isB} 
          onCheckedChange={() => onToggle(isB ? 'A' : 'B')}
          aria-label="Toggle persona"
        />
        <Avatar className="h-8 w-8 border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2">
          <AvatarImage src={currentPersona.avatar} />
          <AvatarFallback>{currentPersona.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
