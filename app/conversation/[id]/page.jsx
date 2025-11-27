"use client";
import { useParams } from 'next/navigation';
import ChatWindow from "@/components/ChatWindow";

export default function ConversationPage() {
  const params = useParams();
  
  if (!params?.id) return null;

  return <ChatWindow conversationId={params.id} />;
}
