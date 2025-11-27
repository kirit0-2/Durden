import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { compressImage } from "@/lib/storage";
import { Upload, X } from "lucide-react";

export default function AvatarUploader({ currentAvatar, name, onSave }) {
  const [preview, setPreview] = useState(currentAvatar);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file.");
      return;
    }

    try {
      const compressedDataUrl = await compressImage(file);
      setPreview(compressedDataUrl);
      onSave(compressedDataUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to process image.");
    }
  };

  const handleClear = () => {
    setPreview(null);
    onSave(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 border-2 border-border">
        <AvatarImage src={preview} />
        <AvatarFallback className="text-lg">
          {name ? name.substring(0, 2).toUpperCase() : "??"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          {preview && (
            <Button variant="ghost" size="icon" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}
