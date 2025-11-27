import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, personas }) {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom on new message
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="flex flex-col justify-end min-h-full pb-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic opacity-50">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              persona={personas[msg.personaId]} 
              isMe={msg.personaId === 'A'} 
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
