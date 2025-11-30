import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, personas }) {
  const scrollRef = useRef(null);
  const viewportRef = useRef(null);
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    // Find the viewport element inside ScrollArea if not directly accessible
    // Radix UI ScrollArea usually has a viewport child
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewportRef.current = viewport;
      // Initial scroll to bottom (instant)
      if (messages.length > 0) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    // Scroll on new message
    if (messages.length > prevMessageCountRef.current) {
      requestAnimationFrame(() => {
        const viewport = viewportRef.current || scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  return (
    <ScrollArea className="flex-1 h-full" ref={scrollRef}>
      <div className="flex flex-col justify-end min-h-full p-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic opacity-50 py-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const isNewDay = !prevMsg || new Date(msg.ts).toDateString() !== new Date(prevMsg.ts).toDateString();
            
            return (
              <React.Fragment key={msg.id}>
                {isNewDay && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      {new Date(msg.ts).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    </span>
                  </div>
                )}
                <MessageBubble 
                  message={msg} 
                  persona={personas[msg.personaId]} 
                  isMe={msg.personaId === 'A'} 
                />
              </React.Fragment>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
