// Funny Interactive Egg Break Photo Reveal
class EggBreakExperience {
  constructor() {
    this.overlay = document.getElementById('egg-break-overlay');
    this.eggStage = document.getElementById('egg-stage-interactive');
    this.eggContainer = document.getElementById('egg-container');
    this.eggSpeech = document.getElementById('egg-speech');
    this.eggRevealCard = document.getElementById('egg-reveal-card');
    this.revealedPhoto = document.getElementById('egg-revealed-img');
    this.revealedName = document.getElementById('egg-revealed-name');
    this.revealedSubtext = document.getElementById('egg-revealed-subtext');

    this.tapCount = 0;
    this.maxTaps = 3;
    this.currentPhotoUrl = '';
    this.birthdayPersonName = 'Birthday Star';

    this.phrases = [
      "I am a very fragile birthday egg... Please DO NOT touch me! 🥺",
      "OUCH!! Stop that! Why would you tap an innocent egg?! 😱",
      "I am BEGGING you! One more hit and there's yolk EVERYWHERE!! 😭⚠️",
      "💥 SPLAAAAT! 🍳"
    ];

    this.init();
  }

  init() {
    if (!this.overlay) return;

    // Click handler on egg
    this.eggStage.addEventListener('click', () => this.handleEggTap());

    // Mouse movement to make egg pupils look around
    document.addEventListener('mousemove', (e) => {
      if (!this.overlay.classList.contains('active') || this.tapCount >= this.maxTaps) return;
      const pupils = document.querySelectorAll('.egg-pupil');
      const rect = this.eggContainer.getBoundingClientRect();
      const eggCenterX = rect.left + rect.width / 2;
      const eggCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eggCenterY, e.clientX - eggCenterX);
      const dist = Math.min(6, Math.hypot(e.clientX - eggCenterX, e.clientY - eggCenterY) / 25);

      pupils.forEach(pupil => {
        pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      });
    });

    // Reset button
    const retryBtn = document.getElementById('btn-egg-again');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.resetEgg());
    }

    // Close / back to party button
    const closeBtn = document.getElementById('btn-egg-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  open(photoUrl, name = 'Birthday Star') {
    this.currentPhotoUrl = photoUrl || '';
    this.birthdayPersonName = name;
    this.resetEgg();
    this.overlay.classList.add('active');
  }

  close() {
    this.overlay.classList.remove('active');
    if (window.sounds) window.sounds.playPop();
  }

  resetEgg() {
    this.tapCount = 0;
    this.eggContainer.className = 'egg-container';
    this.eggStage.style.display = 'flex';
    this.eggRevealCard.style.display = 'none';
    this.eggSpeech.textContent = this.phrases[0];
    this.eggSpeech.style.background = '#fffa65';
    this.eggSpeech.style.color = '#2c2c54';

    // Reset cracks
    const cracks = document.querySelectorAll('.crack-line');
    cracks.forEach(c => c.style.display = 'none');
  }

  handleEggTap() {
    if (this.tapCount >= this.maxTaps) return;

    this.tapCount++;

    // Shake animation
    this.eggContainer.classList.remove('wobble');
    void this.eggContainer.offsetWidth; // trigger reflow
    this.eggContainer.classList.add('wobble');

    if (this.tapCount === 1) {
      if (window.sounds) window.sounds.playEggCrack();
      this.eggContainer.classList.add('crack-stage-1');
      const c1 = document.querySelector('.crack-1');
      if (c1) c1.style.display = 'block';
      this.eggSpeech.textContent = this.phrases[1];
      this.eggSpeech.style.background = '#ffd32a';
    } else if (this.tapCount === 2) {
      if (window.sounds) window.sounds.playEggCrack();
      this.eggContainer.classList.add('crack-stage-2');
      const c2 = document.querySelector('.crack-2');
      if (c2) c2.style.display = 'block';
      this.eggSpeech.textContent = this.phrases[2];
      this.eggSpeech.style.background = '#ff5e57';
      this.eggSpeech.style.color = '#ffffff';
    } else if (this.tapCount >= 3) {
      this.explodeEgg();
    }
  }

  explodeEgg() {
    if (window.sounds) {
      window.sounds.playEggSplat();
    }

    // Huge celebratory confetti burst
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ffeaa7', '#fdcb6e', '#e17055', '#ff7675', '#ffffff']
      });
    }

    // Hide unexploded egg, show funny revealed card
    setTimeout(() => {
      this.eggStage.style.display = 'none';
      this.revealedPhoto.src = this.currentPhotoUrl || '';
      this.revealedName.textContent = `Happy Birthday ${this.birthdayPersonName}! 🎉`;
      this.revealedSubtext.textContent = `You are officially EGG-CELLENT and certified 100% Grade-A Birthday Royalty! 👑🍳✨`;
      this.eggRevealCard.style.display = 'flex';
    }, 280);
  }
}

window.EggBreakExperience = EggBreakExperience;
