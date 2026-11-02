// Secret Admin Portal - Protected by Passcode 4505
const ADMIN_PASSCODE = '4505';

class AdminPortal {
  constructor() {
    this.modal = document.getElementById('admin-modal');
    this.pinView = document.getElementById('admin-pin-view');
    this.dashboardView = document.getElementById('admin-dashboard-view');
    this.pinDots = document.querySelectorAll('.pin-dot');
    this.errorMsg = document.getElementById('pin-error-msg');
    this.closeBtn = document.getElementById('btn-admin-close');

    this.currentPin = '';
    this.clickCount = 0;
    this.clickTimer = null;

    this.init();
  }

  init() {
    if (!this.modal) return;

    // 1. Discreet Footer Trigger (Triple click)
    const trigger = document.getElementById('discrete-admin-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.clickCount++;
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          this.clickCount = 0;
        }, 1200);

        if (this.clickCount >= 3) {
          this.clickCount = 0;
          this.open();
        }
      });
    }

    // 2. Secret Keyboard Shortcut: Ctrl+Shift+A or Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        this.open();
      }

      // If PIN modal is open, allow keyboard typing of digits
      if (this.modal.classList.contains('active') && this.pinView.style.display !== 'none') {
        if (/^[0-9]$/.test(e.key)) {
          this.handleKeyInput(e.key);
        } else if (e.key === 'Backspace') {
          this.handleDelete();
        } else if (e.key === 'Escape') {
          this.close();
        }
      }
    });

    // 3. Keypad Buttons
    const keys = document.querySelectorAll('.key-btn');
    keys.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        if (val === 'clear') {
          this.currentPin = '';
          this.updatePinDots();
        } else if (val === 'backspace') {
          this.handleDelete();
        } else if (val) {
          this.handleKeyInput(val);
        }
      });
    });

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Export JSON Button
    const exportBtn = document.getElementById('btn-admin-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportData());
    }

    // Clear All Button
    const clearBtn = document.getElementById('btn-admin-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllData());
    }
  }

  open() {
    this.currentPin = '';
    this.updatePinDots();
    this.errorMsg.textContent = '';
    this.pinView.style.display = 'flex';
    this.dashboardView.style.display = 'none';
    this.modal.classList.add('active');
    if (window.sounds) window.sounds.playPop();
  }

  close() {
    this.modal.classList.remove('active');
    this.currentPin = '';
    if (window.sounds) window.sounds.playPop();
  }

  handleKeyInput(digit) {
    if (this.currentPin.length >= 4) return;
    this.currentPin += digit;
    this.updatePinDots();
    if (window.sounds) window.sounds.playPop();

    if (this.currentPin.length === 4) {
      this.verifyPin();
    }
  }

  handleDelete() {
    if (this.currentPin.length > 0) {
      this.currentPin = this.currentPin.slice(0, -1);
      this.updatePinDots();
      if (window.sounds) window.sounds.playPop();
    }
  }

  updatePinDots() {
    this.pinDots.forEach((dot, idx) => {
      if (idx < this.currentPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  verifyPin() {
    if (this.currentPin === ADMIN_PASSCODE) {
      // Access Granted!
      if (window.sounds) window.sounds.playPartyHorn();
      this.pinView.style.display = 'none';
      this.dashboardView.style.display = 'block';
      this.loadDashboardData();
    } else {
      // Error Feedback
      this.errorMsg.textContent = 'Incorrect passcode. Try again!';
      const display = document.getElementById('pin-display');
      display.style.animation = 'eggShake 0.4s ease';
      setTimeout(() => {
        display.style.animation = '';
        this.currentPin = '';
        this.updatePinDots();
      }, 500);
    }
  }

  async loadDashboardData() {
    const submissions = await window.appStorage.getAllSubmissions();

    // Stats
    document.getElementById('stat-total-submissions').textContent = submissions.length;
    let totalPhotos = 0;
    submissions.forEach(s => totalPhotos += (s.photos ? s.photos.length : 0));
    document.getElementById('stat-total-photos').textContent = totalPhotos;

    // Table
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';

    if (submissions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #888;">No submissions yet. Create one on the main page!</td></tr>`;
    } else {
      submissions.forEach(sub => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${sub.formattedDate || 'Recent'}</td>
          <td><strong style="color:#ffc75f">${this.escapeHtml(sub.birthdayPerson)}</strong> ${sub.age ? `(${sub.age})` : ''}</td>
          <td>${this.escapeHtml(sub.senderName)}</td>
          <td>${sub.photos ? sub.photos.length : 0} photos</td>
          <td style="max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${this.escapeHtml(sub.message)}">${this.escapeHtml(sub.message)}</td>
          <td>
            <button class="btn btn-primary table-action-btn" onclick="window.adminPortal.launchSubmission(${sub.id})">▶️ Present</button>
            <button class="btn btn-secondary table-action-btn" style="background:rgba(255,50,50,0.2); border-color:rgba(255,50,50,0.4);" onclick="window.adminPortal.deleteSubmission(${sub.id})">🗑️</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Photo Gallery
    const galleryGrid = document.getElementById('admin-gallery-grid');
    galleryGrid.innerHTML = '';
    let renderedPhotos = 0;

    submissions.forEach(sub => {
      if (sub.photos && sub.photos.length) {
        sub.photos.forEach((photoUrl, pIdx) => {
          renderedPhotos++;
          const item = document.createElement('div');
          item.className = 'admin-gallery-item';
          item.title = `For: ${sub.birthdayPerson} (Photo #${pIdx + 1})`;
          item.innerHTML = `<img src="${photoUrl}" alt="Photo">`;
          item.addEventListener('click', () => {
            const w = window.open('');
            w.document.write(`<img src="${photoUrl}" style="max-width:100%; height:auto; display:block; margin:auto;" />`);
          });
          galleryGrid.appendChild(item);
        });
      }
    });

    if (renderedPhotos === 0) {
      galleryGrid.innerHTML = `<p style="color: #888; font-size: 0.95rem;">No photos uploaded yet.</p>`;
    }
  }

  async launchSubmission(id) {
    this.close();
    if (window.appController) {
      await window.appController.loadAndPresent(id);
    }
  }

  async deleteSubmission(id) {
    if (confirm('Are you sure you want to delete this submission?')) {
      await window.appStorage.deleteSubmission(id);
      this.loadDashboardData();
    }
  }

  async clearAllData() {
    if (confirm('Delete ALL submissions and photos? This cannot be undone!')) {
      await window.appStorage.clearAll();
      this.loadDashboardData();
    }
  }

  async exportData() {
    const list = await window.appStorage.getAllSubmissions();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `birthday_submissions_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.AdminPortal = AdminPortal;
