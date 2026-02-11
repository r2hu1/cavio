"use client";

import * as React from "react";

export interface Base64File {
  name: string;
  size: number;
  type: string;
  base64: string;
}

interface UseUploadFileProps {
  onUploadComplete?: (file: Base64File) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<Base64File>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      reader.onerror = reject;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 1600;
        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL("image/webp", 0.8);
        resolve(base64);
      };

      reader.readAsDataURL(file);
    });
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  async function uploadFile(file: File) {
    try {
      setIsUploading(true);
      setUploadingFile(file);
      setProgress(20);

      const isImage = file.type.startsWith("image/");

      const base64 = isImage
        ? await compressImage(file)
        : await fileToBase64(file);

      setProgress(100);

      const result: Base64File = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64,
      };

      setUploadedFile(result);
      onUploadComplete?.(result);

      return result;
    } catch (error) {
      onUploadError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadingFile(undefined);
      setProgress(0);
    }
  }

  return {
    uploadFile,
    uploadedFile,
    uploadingFile,
    isUploading,
    progress,
  };
}
