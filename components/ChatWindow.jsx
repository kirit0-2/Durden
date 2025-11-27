import { useState, useEffect } from 'react';
import Header from "./Header";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import SettingsModal from "./SettingsModal";
import { getConversation, saveConversation, addMessage, updatePersona, generateMessageId } from "@/lib/storage";
import { useRouter } from 'next/navigation';

export default function ChatWindow({ conversationId }) {
  const router = useRouter();
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
    
    const newMessage = {
      id: generateMessageId(),
      personaId: conversation.activePersona,
      text,
      ts: Date.now()
    };

    const updatedConv = addMessage(conversation.conversationId, newMessage);
    setConversation({ ...updatedConv });
  };

  const handleTogglePersona = (personaId) => {
    if (!conversation) return;
    const updatedConv = { ...conversation, activePersona: personaId };
    saveConversation(updatedConv);
    setConversation(updatedConv);
  };

  const handleUpdatePersona = (personaId, updates) => {
    if (!conversation) return;
    const updatedConv = updatePersona(conversation.conversationId, personaId, updates);
    setConversation({ ...updatedConv });
  };

  const handleRenameConversation = (newTitle) => {
    if (!conversation) return;
    const updatedConv = { ...conversation, title: newTitle };
    saveConversation(updatedConv);
    setConversation(updatedConv);
  };

  const handleClearMessages = () => {
    if (!conversation) return;
    if (confirm("Clear all messages? This cannot be undone.")) {
        const updatedConv = { ...conversation, messages: [] };
        saveConversation(updatedConv);
        setConversation(updatedConv);
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
