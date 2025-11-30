import { useAIState } from '@/contexts/AIStateContext';
import { ChevronDown, ChevronUp, FileText, Image as ImageIcon, Send, X } from 'lucide-react';
import mammoth from 'mammoth';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import pdfToText from 'react-pdftotext';

interface InputComponentProps {
  onSendMessage: (message: string) => void;
  conversationId?: string;
}

const InputComponent = React.memo(({ onSendMessage, conversationId }: InputComponentProps) => {
  const { state, dispatch } = useAIState();
  const [inputValue, setInputValue] = useState('');
  const [extractedFileText, setExtractedFileText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isTextareaOpen, setIsTextareaOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Extract text from file
  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'pdf') {
      // Extract text from PDF using react-pdftotext
      const text = await pdfToText(file);
      return text.trim();
    } else if (fileExtension === 'docx') {
      // Extract text from DOCX using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }
  }, []);

  // Handle file selection (PDF/DOCX)
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValidFile = 
      fileName.endsWith('.pdf') || 
      fileName.endsWith('.docx') ||
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isValidFile) {
      dispatch({
        type: "GENERATE_ERROR",
        payload: "Please upload a PDF or DOCX file only.",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      dispatch({
        type: "GENERATE_ERROR",
        payload: "File size must be less than 10MB.",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsExtracting(true);

    try {
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText.trim()) {
        throw new Error('No text found in the file.');
      }

      // Store extracted text separately and file name
      setExtractedFileText(extractedText);
      setFileName(file.name);
      setIsTextareaOpen(false); // Start with textarea closed
      
      // Focus the input so user can add additional text
      inputRef.current?.focus();
      
    } catch (error) {
      console.error('File processing error:', error);
      dispatch({
        type: "GENERATE_ERROR",
        payload: error instanceof Error ? error.message : 'Failed to process file.',
      });
    } finally {
      setIsExtracting(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [extractTextFromFile, dispatch]);

  // Compress image to fit within Botpress 128KB limit
  const compressImage = useCallback((file: File, maxSizeKB: number = 120): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          let quality = 0.9;
          
          // Calculate max dimension to keep aspect ratio
          const maxDimension = 1200; // Max width or height
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try to compress to JPEG (smaller than PNG)
          const compress = (q: number): void => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }
                
                const sizeKB = blob.size / 1024;
                console.log(`Compressed image: ${sizeKB.toFixed(1)}KB at quality ${q}`);
                
                // If still too large and quality can be reduced, try again
                if (sizeKB > maxSizeKB && q > 0.3) {
                  compress(Math.max(0.3, q - 0.1));
                } else {
                  // Create a new File object with compressed blob
                  const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              },
              'image/jpeg',
              q
            );
          };
          
          compress(quality);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle image selection
  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      dispatch({
        type: "GENERATE_ERROR",
        payload: "Please upload a valid image file (JPEG, PNG, GIF, or WebP).",
      });
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (max 10MB for original upload)
    if (file.size > 10 * 1024 * 1024) {
      dispatch({
        type: "GENERATE_ERROR",
        payload: "Image size must be less than 10MB.",
      });
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    setIsExtracting(true);

    try {
      // Compress image to fit within Botpress 128KB limit
      const compressedFile = await compressImage(file, 120);
      
      // Create preview from compressed file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
      
      setImageFile(compressedFile);
      inputRef.current?.focus();
      
      console.log(`Image compressed: ${(file.size / 1024).toFixed(1)}KB -> ${(compressedFile.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('Image compression error:', error);
      dispatch({
        type: "GENERATE_ERROR",
        payload: error instanceof Error ? error.message : 'Failed to process image.',
      });
    } finally {
      setIsExtracting(false);
      // Clear file input
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  }, [dispatch, compressImage]);

  // Send image to Botpress
  const sendImage = useCallback(async () => {
    if (!imageFile || !conversationId) {
      if (!conversationId) {
        dispatch({
          type: "GENERATE_ERROR",
          payload: "Please select or create a conversation first",
        });
      }
      return;
    }

    setIsSendingImage(true);
    dispatch({ type: "GENERATE_START" });

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("conversationId", conversationId);

      const response = await fetch("/api/handle-messages/send-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send image");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to send image");
      }

      // Clear image after sending
      setImageFile(null);
      setImagePreview(null);
      
      // If there's a text response, it will be handled by the SSE listener
      if (data.text) {
        // Response will come via real-time SSE stream
      }
    } catch (error) {
      console.error("Error sending image:", error);
      dispatch({
        type: "GENERATE_ERROR",
        payload: error instanceof Error ? error.message : "Failed to send image",
      });
    } finally {
      setIsSendingImage(false);
    }
  }, [imageFile, conversationId, dispatch]);

  const handleImageButtonClick = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    inputRef.current?.focus();
  }, []);

  // Memoized send message function - combines extracted text and input value
  const sendMessage = useCallback(async () => {
    // If there's an image, send it first
    if (imageFile) {
      await sendImage();
      // Also send text if there's any
      const combinedText = [
        extractedFileText.trim(),
        inputValue.trim()
      ].filter(Boolean).join('\n\n');
      
      if (combinedText.trim()) {
        // Send text after image is sent
        onSendMessage(combinedText);
        dispatch({ type: "GENERATE_START" });
      }
      
      // Clear text fields (image is cleared in sendImage)
      setInputValue('');
      setExtractedFileText('');
      setFileName('');
      setIsTextareaOpen(false);
      return;
    }

    const combinedText = [
      extractedFileText.trim(),
      inputValue.trim()
    ].filter(Boolean).join('\n\n');
    
    if (!combinedText.trim()) return;
    
    onSendMessage(combinedText);
    dispatch({ type: "GENERATE_START" });
    setInputValue('');
    setExtractedFileText('');
    setFileName('');
    setIsTextareaOpen(false);
  }, [onSendMessage, dispatch, extractedFileText, inputValue, imageFile, sendImage]);

  // Memoized event handlers
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  }, [sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleTextareaKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Memoized input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    setExtractedFileText('');
    setFileName('');
    setIsTextareaOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleToggleTextarea = useCallback(() => {
    setIsTextareaOpen(prev => !prev);
    if (!isTextareaOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isTextareaOpen]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtractedFileText(e.target.value);
  }, []);

  const isLoading = state.isLoading || isExtracting || isSendingImage;

  const hasContent = extractedFileText.trim() || inputValue.trim() || imageFile !== null;

  return (
    <div className="border-t border-gray-800 bg-gray-900 py-4">
      <div className="max-w-3xl mx-auto px-4 space-y-3">
        {/* File preview card */}
        {fileName && extractedFileText && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {fileName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({extractedFileText.length} characters)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleTextarea}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                  title={isTextareaOpen ? "Collapse" : "Edit file content"}
                >
                  {isTextareaOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Expandable textarea for editing */}
            {isTextareaOpen && (
              <div className="border-t border-gray-200 dark:border-gray-600 p-3">
                <textarea
                  ref={textareaRef}
                  value={extractedFileText}
                  onChange={handleTextareaChange}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Edit extracted text..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all resize-none min-h-[200px] text-sm"
                  rows={10}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Press Ctrl+Enter to send
                </p>
              </div>
            )}
          </div>
        )}

        {/* Image preview card */}
        {imagePreview && imageFile && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {imageFile.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({(imageFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-600">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto max-h-48 rounded-lg object-contain"
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3">
          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="hidden"
            disabled={isLoading}
          />
          
          {/* File upload button with icon */}
          <button
            type="button"
            onClick={handleFileButtonClick}
            disabled={isLoading}
            className="px-3 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Upload PDF or DOCX file"
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* Image upload button */}
          <button
            type="button"
            onClick={handleImageButtonClick}
            disabled={isLoading}
            className="px-3 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isExtracting ? "Extracting text from file..." : extractedFileText ? "Add additional text here..." : "Message Docpilot AI..."}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !hasContent}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-gray-100 font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed border border-gray-700"
          >
            <span className="hidden sm:inline">
              {isExtracting ? 'Extracting...' : isSendingImage ? 'Sending image...' : isLoading ? 'Sending...' : 'Send'}
            </span>
            <Send className="w-4 h-4 sm:hidden" />
            {(isExtracting || isLoading) && (
              <span className="sm:hidden">⏳</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
});

InputComponent.displayName = 'InputComponent';

export default InputComponent;
