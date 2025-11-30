import { useState, useEffect } from 'react';
import Header from "./Header";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import SettingsModal from "./SettingsModal";
import { getConversation, saveConversation, addMessage, updatePersona, generateMessageId } from "@/lib/storage";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"

export default function ChatWindow({ conversationId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [conversation, setConversation] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId) {
      const data = getConversation(conversationId);
      if (data) {
        setConversation(data);
      } else {
        // Handle not found
        router.push('/');
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleSendMessage = (text) => {
    if (!conversation) return;
    
    try {
      const newMessage = {
        id: generateMessageId(),
        personaId: conversation.activePersona,
        text,
        ts: Date.now()
      };

      const updatedConv = addMessage(conversation.conversationId, newMessage);
      setConversation({ ...updatedConv });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message,
      });
    }
  };

  const handleTogglePersona = (personaId) => {
    if (!conversation) return;
    try {
      const updatedConv = { ...conversation, activePersona: personaId };
      saveConversation(updatedConv);
      setConversation(updatedConv);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error switching persona",
        description: error.message,
      });
    }
  };

  const handleUpdatePersona = (personaId, updates) => {
    if (!conversation) return;
    try {
      const updatedConv = updatePersona(conversation.conversationId, personaId, updates);
      setConversation({ ...updatedConv });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating persona",
        description: error.message,
      });
    }
  };

  const handleRenameConversation = (newTitle) => {
    if (!conversation) return;
    try {
      const updatedConv = { ...conversation, title: newTitle };
      saveConversation(updatedConv);
      setConversation(updatedConv);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error renaming conversation",
        description: error.message,
      });
    }
  };

  const handleClearMessages = () => {
    if (!conversation) return;
    try {
      const updatedConv = { ...conversation, messages: [] };
      saveConversation(updatedConv);
      setConversation(updatedConv);
      toast({
        title: "Messages cleared",
        description: "All messages have been removed from this conversation.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error clearing messages",
        description: error.message,
      });
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!conversation) return null;

  return (
    <div className="flex flex-col h-dvh bg-background overflow-hidden">
      <Header 
        title={conversation.title} 
        showBack={true} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        personas={conversation.personas}
        activePersonaId={conversation.activePersona}
      />
      
      <MessageList 
        messages={conversation.messages} 
        personas={conversation.personas} 
      />
      
      <MessageInput 
        activePersonaId={conversation.activePersona} 
        personas={conversation.personas} 
        onTogglePersona={handleTogglePersona}
        onSendMessage={handleSendMessage}
      />

      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        conversation={conversation}
        onUpdatePersona={handleUpdatePersona}
        onRenameConversation={handleRenameConversation}
        onClearMessages={handleClearMessages}
      />
    </div>
  );
}
