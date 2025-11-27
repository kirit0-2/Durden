import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AvatarUploader from "./AvatarUploader";
import { Trash2, Download } from "lucide-react";

export default function SettingsModal({ 
  open, 
  onOpenChange, 
  conversation, 
  onUpdatePersona, 
  onRenameConversation, 
  onClearMessages 
}) {
  const [title, setTitle] = useState(conversation.title);
  const [personaAName, setPersonaAName] = useState(conversation.personas.A.name);
  const [personaBName, setPersonaBName] = useState(conversation.personas.B.name);

  const handleSave = () => {
    if (title !== conversation.title) onRenameConversation(title);
    if (personaAName !== conversation.personas.A.name) onUpdatePersona('A', { name: personaAName });
    if (personaBName !== conversation.personas.B.name) onUpdatePersona('B', { name: personaBName });
    onOpenChange(false);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(conversation, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `conversation-${conversation.conversationId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Conversation Settings</DialogTitle>
          <DialogDescription>
            Customize personas and manage this conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Conversation Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium leading-none">Person A</h4>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input 
                value={personaAName} 
                onChange={(e) => setPersonaAName(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Avatar</Label>
              <AvatarUploader 
                currentAvatar={conversation.personas.A.avatar} 
                name={personaAName}
                onSave={(avatar) => onUpdatePersona('A', { avatar })}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium leading-none">Person B</h4>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input 
                value={personaBName} 
                onChange={(e) => setPersonaBName(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Avatar</Label>
              <AvatarUploader 
                currentAvatar={conversation.personas.B.avatar} 
                name={personaBName}
                onSave={(avatar) => onUpdatePersona('B', { avatar })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="destructive" onClick={onClearMessages} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Messages
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
