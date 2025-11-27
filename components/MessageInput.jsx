import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function MessageInput({ activePersonaId, personas, onTogglePersona, onSendMessage }) {
  const [text, setText] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Ensure focus stays
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
    setText(target.value);
  };

  const handlePersonaToggle = () => {
    const newPersonaId = activePersonaId === 'A' ? 'B' : 'A';
    const hadFocus = document.activeElement === textareaRef.current;
    
    // Trigger animation
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    onTogglePersona(newPersonaId);
    
    if (hadFocus) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const currentPersona = personas[activePersonaId];

  return (
    <div className="border-t bg-background z-10 shrink-0 pb-safe">
      <div className="p-3 flex items-end gap-2">
        {/* 1. Text Input Area */}
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`Message as ${currentPersona.name}...`}
          className="min-h-[44px] max-h-[150px] resize-none py-3 flex-1"
          rows={1}
        />

        {/* 2. Persona Box (Avatar + Toggle Button) - Entire box is clickable */}
        <div 
          className="flex items-center gap-1 p-1 pr-2 rounded-full border bg-muted/30 h-11 shrink-0 cursor-pointer hover:bg-muted/50 transition-colors"
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          onClick={handlePersonaToggle} // Click handler on container
          title="Switch Persona"
        >
          {/* Avatar */}
          <Avatar className="h-8 w-8 border border-border pointer-events-none">
            <AvatarImage src={currentPersona.avatar} />
            <AvatarFallback>{currentPersona.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Toggle Icon */}
          <div className="h-7 w-7 flex items-center justify-center rounded-full">
            <RefreshCw 
              className={cn(
                "h-4 w-4 text-muted-foreground transition-all duration-500",
                isRotating && "rotate-180"
              )} 
            />
          </div>
        </div>
        
        {/* 3. Send Button */}
        <Button 
          onClick={handleSend}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          onTouchStart={(e) => e.preventDefault()} 
          size="icon" 
          className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all hover:scale-105 active:scale-95"
          disabled={!text.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
