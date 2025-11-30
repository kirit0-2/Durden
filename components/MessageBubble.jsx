import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Copy, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function MessageBubble({ message, persona, isMe, onEdit, onDelete }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const date = new Date(message.ts);
  const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    toast({ description: "Message copied to clipboard" });
    setIsMenuOpen(false);
  };

  const handleEditStart = () => {
    setEditText(message.text);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleEditSave = () => {
    if (editText.trim() !== message.text) {
      onEdit(message.id, editText);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(message.text);
  };

  const handleDelete = () => {
    onDelete(message.id);
    setIsMenuOpen(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  return (
    <div 
      className={cn(
        "group flex w-full gap-2 mb-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {/* Message Box Wrapper with Context Menu Trigger */}
      <div 
        className={cn(
          "relative max-w-[75%] flex items-end gap-2",
          isMe ? "flex-row-reverse" : "flex-row"
        )}
        onContextMenu={handleContextMenu}
      >
        {/* The Bubble */}
        <div 
          className={cn(
            "relative px-4 py-2 border shadow-sm w-fit min-w-[120px]",
            isMe 
              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm" 
              : "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-sm",
            isEditing ? "w-full min-w-[250px]" : ""
          )}
        >
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <Textarea 
                value={editText} 
                onChange={(e) => setEditText(e.target.value)}
                className="text-foreground bg-background min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleEditCancel}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleEditSave}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap wrap-break-words">
              {message.text}
              <span 
                className={cn(
                  "float-right ml-3 text-[10px] opacity-70 select-none mt-1 inline-block align-bottom",
                  isMe ? "text-primary-foreground/80" : "text-secondary-foreground/80"
                )}
              >
                {message.edited && <span className="mr-1">(edited)</span>}
                {timeString}
              </span>
            </div>
          )}
        </div>

        {/* Actions Dropdown (Visible on Hover or Open) */}
        {!isEditing && (
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100 shrink-0",
                  isMe ? "mr-1" : "ml-1"
                )}
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMe ? "end" : "start"}>
              <DropdownMenuItem onClick={handleEditStart}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
