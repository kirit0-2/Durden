import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import PersonaToggle from "./PersonaToggle";
import { useKeyboardVisibility } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function MessageInput({ activePersonaId, personas, onTogglePersona, onSendMessage }) {
  const [text, setText] = useState("");
  const isKeyboardVisible = useKeyboardVisibility();
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
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

  return (
    <div className="border-t bg-background p-3 pb-safe">
      {/* Toggle above input if keyboard is hidden (or desktop) */}
      {!isKeyboardVisible && (
        <div className="mb-2 flex justify-between items-center">
           <PersonaToggle 
              activePersonaId={activePersonaId} 
              personas={personas} 
              onToggle={onTogglePersona} 
            />
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Toggle inside input row if keyboard is visible */}
        {isKeyboardVisible && (
          <div className="pb-1">
             <PersonaToggle 
              activePersonaId={activePersonaId} 
              personas={personas} 
              onToggle={onTogglePersona}
              className="scale-90 origin-bottom-left"
            />
          </div>
        )}

        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`Message as ${personas[activePersonaId].name}...`}
          className="min-h-[44px] max-h-[150px] resize-none py-3"
          rows={1}
        />
        
        <Button 
          onClick={handleSend} 
          size="icon" 
          className="h-11 w-11 shrink-0 rounded-full"
          disabled={!text.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
