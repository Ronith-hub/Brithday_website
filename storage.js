// Storage Manager using IndexedDB & LocalStorage for Birthday Submissions
const DB_NAME = 'BirthdayPresentationDB';
const DB_VERSION = 1;
const STORE_NAME = 'submissions';

class StorageManager {
  constructor() {
    this.db = null;
    this.initPromise = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('birthdayPerson', 'birthdayPerson', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB unavailable, falling back to LocalStorage', e);
        resolve(null);
      };
    });
  }

  async saveSubmission(data) {
    await this.initPromise;
    const submission = {
      senderName: data.senderName || 'A Loving Friend',
      birthdayPerson: data.birthdayPerson || 'Birthday Star',
      age: data.age || '',
      message: data.message || 'Wishing you the happiest, funnest birthday ever! May your year be filled with treats and joy!',
      photos: data.photos || [],
      eggPhotoIndex: data.eggPhotoIndex !== undefined ? data.eggPhotoIndex : 0,
      danceStyle: data.danceStyle || 'disco',
      timestamp: Date.now(),
      formattedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.add(submission);
        req.onsuccess = (e) => {
          submission.id = e.target.result;
          this.setLastActiveId(submission.id);
          resolve(submission);
        };
        req.onerror = () => reject(req.error);
      });
    } else {
      // LocalStorage fallback
      const list = this.getLocalStorageList();
      submission.id = Date.now();
      list.push(submission);
      localStorage.setItem('bday_submissions', JSON.stringify(list));
      this.setLastActiveId(submission.id);
      return submission;
    }
  }

  async getAllSubmissions() {
    await this.initPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const res = req.result || [];
          res.sort((a, b) => b.timestamp - a.timestamp);
          resolve(res);
        };
        req.onerror = () => resolve(this.getLocalStorageList());
      });
    }
    return this.getLocalStorageList();
  }

  async getSubmissionById(id) {
    await this.initPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(Number(id));
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }
    const list = this.getLocalStorageList();
    return list.find(s => s.id === Number(id)) || null;
  }

  async deleteSubmission(id) {
    await this.initPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(Number(id));
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    }
    let list = this.getLocalStorageList();
    list = list.filter(s => s.id !== Number(id));
    localStorage.setItem('bday_submissions', JSON.stringify(list));
    return true;
  }

  async clearAll() {
    await this.initPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    }
    localStorage.removeItem('bday_submissions');
    return true;
  }

  setLastActiveId(id) {
    localStorage.setItem('bday_last_active_id', String(id));
  }

  getLastActiveId() {
    return localStorage.getItem('bday_last_active_id');
  }

  getLocalStorageList() {
    try {
      const data = localStorage.getItem('bday_submissions');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Create cute SVG placeholder photos for initial sample
  createSamplePhoto(label, bgColor, emoji) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 400, 400);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, '#ff6b8b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 400);

    // Emoji face
    ctx.font = '100px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 200, 170);

    // Text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(label, 200, 290);

    return canvas.toDataURL('image/png');
  }

  async ensureDefaultSample() {
    const list = await this.getAllSubmissions();
    if (list.length === 0) {
      const sample1 = this.createSamplePhoto('Birthday Star! 🌟', '#6c5ce7', '👑');
      const sample2 = this.createSamplePhoto('Cute Moments 🐱', '#fd79a8', '🥳');
      const sample3 = this.createSamplePhoto('The Egg-cellent One 🍳', '#ffeaa7', '🐣');

      await this.saveSubmission({
        senderName: 'Your Favorite Humans & Cats',
        birthdayPerson: 'Alex',
        age: '24',
        message: 'May your day be filled with lots of treats, crazy dancing cats, and zero egg-smashing accidents! 🎂🎉✨',
        photos: [sample1, sample2, sample3],
        eggPhotoIndex: 2,
        danceStyle: 'disco'
      });
    }
  }
}

window.appStorage = new StorageManager();
