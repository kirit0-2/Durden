import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Search, MessageSquare, Clock } from "lucide-react";
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { getConversationsList, getConversation, createConversation, deleteConversation } from "@/lib/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

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
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

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
    try {
      const newConv = createConversation(`Conversation ${conversations.length + 1}`);
      // Redirect handled by Link usually, but here we just reload list or nav
      window.location.href = `/conversation/${newConv.conversationId}`;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating conversation",
        description: error.message,
      });
    }
  };

  const handleDeleteClick = (e, id) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = (e) => {
    if (e) e.stopPropagation();
    if (deleteId) {
      deleteConversation(deleteId);
      loadConversations();
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Conversation deleted",
        description: "The conversation has been permanently removed.",
      });
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto bg-background min-h-screen">
      {/* Enhanced Header */}
      <header className="mt-6 mx-2 md:mx-4 rounded-xl border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-2 z-10 shadow-sm">
        <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Durden</h1>
              <p className="text-xs text-muted-foreground">
                {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-3 md:px-6 md:pb-4">
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
        <div className="p-4 md:p-8">
          {/* Hero Action Button */}
          <div className="mb-8">
            <Button 
              onClick={handleCreate} 
              className="w-full h-14 rounded-2xl text-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              Start New Conversation
            </Button>
          </div>

          {/* Conversations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredConversations.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                {searchQuery ? (
                  <>
                    <Search className="h-12 w-12 opacity-20 mb-4" />
                    <p>No results found</p>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-12 w-12 opacity-20 mb-4" />
                    <p>No conversations yet</p>
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
                        className="h-8 w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => handleDeleteClick(e, conv.conversationId)}
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
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this conversation and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
