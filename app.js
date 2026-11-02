// Main Application Controller for Birthday Presentation 3D
class AppController {
  constructor() {
    this.uploadedPhotos = [];
    this.eggPhotoIndex = 0;
    this.currentSubmission = null;
    this.scene3d = null;
    this.eggBreak = null;
    this.adminPortal = null;

    this.init();
  }

  async init() {
    // Initialize components
    this.eggBreak = new window.EggBreakExperience();
    this.adminPortal = new window.AdminPortal();
    window.eggBreak = this.eggBreak;
    window.adminPortal = this.adminPortal;

    // Ensure default sample exists
    await window.appStorage.ensureDefaultSample();

    // DOM Elements
    this.bindFormEvents();
    this.bindPresentationEvents();
  }

  bindFormEvents() {
    const photoInput = document.getElementById('photo-input');
    const uploadZone = document.getElementById('upload-zone');
    const form = document.getElementById('birthday-form');
    const loadSampleBtn = document.getElementById('btn-load-sample');

    // Drag and Drop
    if (uploadZone && photoInput) {
      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
      });

      uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
      });

      uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
          this.handlePhotoFiles(e.dataTransfer.files);
        }
      });

      photoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length) {
          this.handlePhotoFiles(e.target.files);
        }
      });
    }

    // Load sample data button
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener('click', async () => {
        const lastId = window.appStorage.getLastActiveId();
        let sub = null;
        if (lastId) {
          sub = await window.appStorage.getSubmissionById(lastId);
        }
        if (!sub) {
          const list = await window.appStorage.getAllSubmissions();
          sub = list[0];
        }

        if (sub) {
          document.getElementById('input-sender').value = sub.senderName;
          document.getElementById('input-birthday-person').value = sub.birthdayPerson;
          document.getElementById('input-age').value = sub.age || '';
          document.getElementById('input-message').value = sub.message;
          document.getElementById('select-cat-dance').value = sub.danceStyle || 'disco';
          this.uploadedPhotos = [...(sub.photos || [])];
          this.eggPhotoIndex = sub.eggPhotoIndex || 0;
          this.renderPhotoPreviews();
          this.showToast('Sample details loaded! 🐱✨');
        }
      });
    }

    // Form Submit
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const senderName = document.getElementById('input-sender').value.trim() || 'A Best Friend';
        const birthdayPerson = document.getElementById('input-birthday-person').value.trim() || 'Birthday Star';
        const age = document.getElementById('input-age').value.trim();
        const message = document.getElementById('input-message').value.trim() || 'Happy Birthday!';
        const danceStyle = document.getElementById('select-cat-dance').value || 'disco';

        // If no photos uploaded, generate default cute photos
        let photos = this.uploadedPhotos;
        if (photos.length === 0) {
          photos = [
            window.appStorage.createSamplePhoto(`${birthdayPerson} 👑`, '#ff758c', '🎂'),
            window.appStorage.createSamplePhoto('Egg-cellent Star 🍳', '#ffeaa7', '🐣')
          ];
        }

        const submission = await window.appStorage.saveSubmission({
          senderName,
          birthdayPerson,
          age,
          message,
          photos,
          eggPhotoIndex: this.eggPhotoIndex,
          danceStyle
        });

        this.startPresentation(submission);
      });
    }
  }

  bindPresentationEvents() {
    // Back to edit
    const backBtn = document.getElementById('btn-back-to-edit');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.exitPresentation();
      });
    }

    // Music toggle
    const musicBtn = document.getElementById('btn-toggle-music');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        const isPlaying = window.sounds.toggleHappyBirthday();
        musicBtn.innerHTML = isPlaying ? '🎵 Stop Music' : '🎵 Play Music';
        this.showToast(isPlaying ? '🎶 Playing Happy Birthday tune!' : 'Music paused');
      });
    }

    // Dance style switcher
    const danceBtn = document.getElementById('btn-change-dance');
    if (danceBtn) {
      const styles = ['disco', 'wobble', 'hop'];
      let currentIdx = 0;
      danceBtn.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % styles.length;
        const newStyle = styles[currentIdx];
        if (this.scene3d) {
          this.scene3d.setDanceStyle(newStyle);
        }
        danceBtn.innerHTML = `🐱 Style: ${newStyle.toUpperCase()}`;
        if (window.sounds) window.sounds.playCatMeow();
        this.showToast(`Cats are now doing the ${newStyle.toUpperCase()} dance! 🐾`);
      });
    }

    // Blow candles button
    const blowBtn = document.getElementById('btn-blow-candles');
    if (blowBtn) {
      blowBtn.addEventListener('click', () => {
        if (this.scene3d) {
          const isBlown = this.scene3d.blowCandles();
          blowBtn.innerHTML = isBlown ? '🔥 Relight Candles' : '🎂 Blow Candles';
          if (isBlown) {
            this.showToast('🎂 Wishes made! Candles blown out! 🎉');
          } else {
            this.showToast('🔥 Candles relit for more birthday magic!');
          }
        }
      });
    }

    // Smash Egg button
    const eggBtn = document.getElementById('btn-smash-egg');
    if (eggBtn) {
      eggBtn.addEventListener('click', () => {
        const eggPhoto = (this.currentSubmission && this.currentSubmission.photos && this.currentSubmission.photos[this.currentSubmission.eggPhotoIndex])
          ? this.currentSubmission.photos[this.currentSubmission.eggPhotoIndex]
          : (this.uploadedPhotos[0] || '');
        const name = this.currentSubmission ? this.currentSubmission.birthdayPerson : 'Birthday Star';
        this.eggBreak.open(eggPhoto, name);
      });
    }

    // Toggle message card
    const msgBtn = document.getElementById('btn-show-message');
    const msgBubble = document.getElementById('presentation-message-bubble');
    if (msgBtn && msgBubble) {
      msgBtn.addEventListener('click', () => {
        if (msgBubble.style.display === 'block') {
          msgBubble.style.display = 'none';
          msgBtn.innerHTML = '💌 Show Wish';
        } else {
          msgBubble.style.display = 'block';
          msgBtn.innerHTML = '✕ Hide Wish';
          if (window.sounds) window.sounds.playPop();
        }
      });
    }
  }

  // Handle Photo Files with browser-based canvas optimization
  async handlePhotoFiles(files) {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const base64 = await this.optimizeImage(file);
      this.uploadedPhotos.push(base64);
    }
    this.renderPhotoPreviews();
  }

  optimizeImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  renderPhotoPreviews() {
    const grid = document.getElementById('preview-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.uploadedPhotos.forEach((photo, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `preview-thumb ${idx === this.eggPhotoIndex ? 'is-egg-photo' : ''}`;
      thumb.innerHTML = `
        <img src="${photo}" alt="Preview" />
        <button type="button" class="remove-btn" title="Remove">&times;</button>
        ${idx === this.eggPhotoIndex ? '<span class="egg-badge">🥚 Egg Photo</span>' : ''}
      `;

      // Set as egg photo on click
      thumb.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) return;
        this.eggPhotoIndex = idx;
        this.renderPhotoPreviews();
        this.showToast('Selected as the funny Egg Break Photo! 🍳');
      });

      // Remove button
      thumb.querySelector('.remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.uploadedPhotos.splice(idx, 1);
        if (this.eggPhotoIndex >= this.uploadedPhotos.length) {
          this.eggPhotoIndex = Math.max(0, this.uploadedPhotos.length - 1);
        }
        this.renderPhotoPreviews();
      });

      grid.appendChild(thumb);
    });
  }

  async loadAndPresent(id) {
    const sub = await window.appStorage.getSubmissionById(id);
    if (sub) {
      this.startPresentation(sub);
    }
  }

  startPresentation(submission) {
    this.currentSubmission = submission;

    // Switch views
    document.getElementById('creator-view').classList.remove('active');
    document.getElementById('presentation-view').classList.add('active');

    // Update HUD titles
    const titleEl = document.getElementById('hud-bday-name');
    const subtitleEl = document.getElementById('hud-bday-sub');
    const msgText = document.getElementById('hud-bday-msg');
    const msgSender = document.getElementById('hud-bday-sender');

    titleEl.textContent = `Happy Birthday ${submission.birthdayPerson}! 🎉`;
    subtitleEl.textContent = submission.age ? `Celebrating ${submission.age} glorious years!` : `A special celebration from ${submission.senderName}`;
    msgText.textContent = `"${submission.message}"`;
    msgSender.textContent = `— With love, ${submission.senderName} ❤️`;

    // Initialize 3D scene safely once Three.js is ready
    const initScene = () => {
      if (window.THREE) {
        if (!this.scene3d) {
          this.scene3d = new window.BirthdayScene3D('canvas3d-container');
        }
        if (this.scene3d) {
          this.scene3d.setDanceStyle(submission.danceStyle || 'disco');
          this.scene3d.updatePhotos(submission.photos || []);
        }
      } else {
        setTimeout(initScene, 100);
      }
    };
    initScene();

    // Auto-start birthday music
    setTimeout(() => {
      window.sounds.startHappyBirthday();
      const musicBtn = document.getElementById('btn-toggle-music');
      if (musicBtn) musicBtn.innerHTML = '🎵 Stop Music';
    }, 400);

    // Initial Confetti Welcome
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.4 }
      });
    }

    this.showToast(`🎂 Welcome to ${submission.birthdayPerson}'s 3D Birthday Bash!`);
  }

  exitPresentation() {
    document.getElementById('presentation-view').classList.remove('active');
    document.getElementById('creator-view').classList.add('active');
    window.sounds.stopHappyBirthday();
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
});
