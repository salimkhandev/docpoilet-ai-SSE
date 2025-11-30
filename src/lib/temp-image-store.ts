// In-memory storage for temporary images
// In production, use Redis or a proper storage service
const tempImageStore = new Map<string, { buffer: Buffer; mimeType: string; timestamp: number }>();

const CLEANUP_INTERVAL = 3600000; // 1 hour
const MAX_AGE = 3600000; // 1 hour

// Clean up old images periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [id, data] of tempImageStore.entries()) {
      if (now - data.timestamp > MAX_AGE) {
        tempImageStore.delete(id);
      }
    }
  }, CLEANUP_INTERVAL);
}

export function storeTempImage(buffer: Buffer, mimeType: string, baseUrl: string): string {
  const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  tempImageStore.set(id, { 
    buffer, 
    mimeType,
    timestamp: Date.now()
  });
  
  return `${baseUrl}/api/handle-messages/temp-image/${id}`;
}

export function getTempImage(id: string): { buffer: Buffer; mimeType: string } | null {
  const imageData = tempImageStore.get(id);
  if (!imageData) {
    return null;
  }
  
  // Check if expired
  if (Date.now() - imageData.timestamp > MAX_AGE) {
    tempImageStore.delete(id);
    return null;
  }
  
  return { buffer: imageData.buffer, mimeType: imageData.mimeType };
}

