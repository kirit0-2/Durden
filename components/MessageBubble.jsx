import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function MessageBubble({ message, persona, isMe }) {
  const date = new Date(message.ts);
  const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div 
      className={cn(
        "flex w-full gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {/* Left Avatar (Alter / Persona B) */}
      {!isMe && (
        <Avatar className="h-8 w-8 mt-auto mb-1 border border-border shrink-0">
          <AvatarImage src={persona.avatar} />
          <AvatarFallback>{persona.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      {/* Message Box */}
      <div 
        className={cn(
          "relative max-w-[75%] rounded-2xl px-4 py-2 border shadow-sm flex flex-col",
          isMe 
            ? "bg-primary text-primary-foreground rounded-br-sm" 
            : "bg-secondary text-secondary-foreground rounded-bl-sm"
        )}
      >
        <div className="text-sm whitespace-pre-wrap wrap-break-words">
          {message.text}
        </div>
        
        {/* Timestamp inside box, bottom-right */}
        <div 
          className={cn(
            "text-[10px] opacity-70 font-medium self-end mt-1 whitespace-nowrap",
            isMe ? "text-primary-foreground/80" : "text-secondary-foreground/80"
          )}
        >
          {timeString}
        </div>
      </div>

      {/* Right Avatar (Me / Persona A) */}
      {isMe && (
        <Avatar className="h-8 w-8 mt-auto mb-1 border border-border shrink-0">
          <AvatarImage src={persona.avatar} />
          <AvatarFallback>{persona.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
