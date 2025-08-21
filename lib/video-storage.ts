/**
 * Temporary video file storage using IndexedDB
 */

const DB_NAME = 'VideoAnalysisDB';
const DB_VERSION = 1;
const STORE_NAME = 'videoFiles';

interface VideoFileEntry {
  id: string;
  file: File;
  timestamp: number;
}

class VideoStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async storeFile(file: File): Promise<string> {
    if (!this.db) await this.init();
    
    const id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const entry: VideoFileEntry = {
      id,
      file,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(entry);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(id);
    });
  }

  async getFile(id: string): Promise<File | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as VideoFileEntry | undefined;
        resolve(entry ? entry.file : null);
      };
    });
  }

  async deleteFile(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async cleanup(): Promise<void> {
    if (!this.db) await this.init();
    
    // Clean up files older than 1 hour
    const cutoff = Date.now() - (60 * 60 * 1000);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const entry = cursor.value as VideoFileEntry;
          if (entry.timestamp < cutoff) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

export const videoStorage = new VideoStorage();