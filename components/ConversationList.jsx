import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Search, MessageSquare, Clock } from "lucide-react";
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { getConversationsList, getConversation, createConversation, deleteConversation } from "@/lib/storage";

const timeAgo = (timestamp) => {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = () => {
    const ids = getConversationsList();
    const loaded = ids.map(id => getConversation(id)).filter(Boolean);
    // Sort by last message or created at
    loaded.sort((a, b) => {
      const lastA = a.messages.length > 0 ? a.messages[a.messages.length - 1].ts : a.createdAt;
      const lastB = b.messages.length > 0 ? b.messages[b.messages.length - 1].ts : b.createdAt;
      return lastB - lastA;
    });
    setConversations(loaded);
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    const newConv = createConversation(`Conversation ${conversations.length + 1}`);
    // Redirect handled by Link usually, but here we just reload list or nav
    window.location.href = `/conversation/${newConv.conversationId}`;
  };

  const handleDelete = (e, id) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation(id);
      loadConversations();
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto bg-background min-h-screen">
      {/* Enhanced Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dual Chat</h1>
              <p className="text-xs text-muted-foreground">
                {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Stats Row */}
          {conversations.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MessageSquare className="h-4 w-4" />
                  Total Messages
                </div>
                <div className="text-2xl font-bold">
                  {conversations.reduce((acc, conv) => acc + conv.messages.length, 0)}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Recent
                </div>
                <div className="text-2xl font-bold">
                  {conversations.filter(c => {
                    const lastMsg = c.messages[c.messages.length - 1];
                    const ts = lastMsg ? lastMsg.ts : c.createdAt;
                    return Date.now() - ts < 24 * 60 * 60 * 1000;
                  }).length}
                </div>
              </div>
            </div>
          )}

          {/* Conversations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredConversations.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                {searchQuery ? (
                  <>
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Try adjusting your search terms
                    </p>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mb-4">
                      Start your first dual-persona conversation
                    </p>
                    <Button onClick={handleCreate} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Conversation
                    </Button>
                  </>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                const lastTs = lastMessage ? lastMessage.ts : conv.createdAt;
                
                return (
                  <Link 
                    key={conv.conversationId} 
                    href={`/conversation/${conv.conversationId}`}
                    className="group relative flex flex-col rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="flex items-start gap-3 p-5 pb-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <span className="text-lg font-bold">
                          {conv.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-semibold truncate mb-1">{conv.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {conv.messages.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(lastTs)}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => handleDelete(e, conv.conversationId)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {/* Last Message Preview */}
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {conv.messages.length > 0 
                          ? lastMessage.text 
                          : "Start chatting with your dual personas"}
                      </p>
                    </div>

                    {/* Personas Preview */}
                    <div className="flex items-center gap-2 px-5 py-3 border-t bg-muted/30">
                      <div className="flex -space-x-2">
                        {Object.values(conv.personas || {}).map((persona) => (
                          <div 
                            key={persona.id}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-card ring-1 ring-muted"
                            title={persona.name}
                          >
                            <span className="text-[10px] font-medium">
                              {persona.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Object.values(conv.personas || {}).map(p => p.name).join(' & ')}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
