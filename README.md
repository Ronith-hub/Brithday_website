# 🐱🎂 MeowParty 3D — Birthday Presentation Website

A vibrant, hilarious, and heartwarming 3D interactive birthday presentation website. Features customizable sender & recipient names, photo uploads, adorable **animated dancing cats**, an interactive **3D birthday cake with blowable candles**, a comedic **interactive Egg Break photo reveal**, festive **synthesized audio**, and a **discrete admin portal** (Passcode: `4505`).

---

## ✨ Features

- **🐾 3D Cute Dancing Cartoon Cats**:
  - Four distinct animated cats (*Mochi*, *Ginger*, *Oreo*, and *Marshmallow*) dressed in festive party hats.
  - Animated paws, wagging tails, bobbing heads, and hip swaying in sync with the birthday rhythm.
  - **Clickable Cats**: Tap or click any cat to trigger a meow sound, jump, and 360° spin!
  - **Dance Styles**: Switch on the fly between **Disco Paw Shake**, **Silly Kitty Wiggle**, and **High-Energy Cat Hop**.

- **🎂 3D Multi-Tier Birthday Cake**:
  - 3-tier colorful cake with dripping cream frosting, sprinkles, and fresh strawberries.
  - Glowing 3D candles with flickering flames and warm dynamic lights.
  - **Interactive Candle Blowout**: Blow out the candles with sound effects, smoke particles, and a full-screen confetti blast! Click again to relight.

- **🥚 The "Funny Egg Break" Interactive Surprise**:
  - A giant wobbling egg equipped with cartoon googly eyes that track the user's cursor.
  - **3-Hit Interactive Cracking**:
    - *Tap 1*: Hairline crack forms with a snappy sound: *"OUCH!! Stop that! Why would you tap an innocent egg?! 😱"*
    - *Tap 2*: Cracks spread wider with dizzy eyes: *"I am BEGGING you! One more hit and there's yolk EVERYWHERE!! 😭⚠️"*
    - *Tap 3*: **CRACK-SPLAT!** Dramatic cartoon explosion revealing the birthday person's photo inside a sunny-side-up egg yolk frame wearing a royal crown!

- **📸 3D Floating Polaroid Photo Carousel**:
  - Upload multiple photos of the birthday star.
  - Photos float gracefully around the stage in rotating 3D polaroid frames with dynamic party lighting.

- **🎵 Synthesized Web Audio Engine**:
  - 100% self-contained using the browser's native **Web Audio API** (zero external MP3 links that can fail or 404):
    - Cheerful polyphonic "Happy Birthday" melody loop.
    - Playful high-pitched cat meows.
    - Crisp egg-cracking snaps & cartoon splat sounds.
    - Realistic wind gusts & chime fanfare for candle blowout.
    - Celebratory party horn buzzes.

- **🔒 Discrete Secret Admin Portal (`PIN: 4505`)**:
  - Kept completely hidden from ordinary guests.
  - **Secret Trigger**: Triple-click the discreet decorative paw print (`🐾`) in the footer, or press `Ctrl + Shift + A` (`Cmd + Shift + A` on Mac).
  - **Security Passcode**: Enter `4505` on the PIN keypad.
  - **Admin Dashboard**:
    - View all saved submissions (Sender, Birthday Person, Date, Message, Photos).
    - Launch past presentations directly.
    - Photo Gallery Vault with full-size preview and download options.
    - Export all submissions as JSON backup.

---

## 📁 File Structure

```text
├── index.html          # Application shell, form, 3D overlays, and modals
├── server.py           # Optional Python web server with REST endpoints
├── README.md           # Documentation
├── css/
│   └── style.css       # Party aesthetics, glassmorphism, responsive UI & animations
└── js/
    ├── audio.js        # Web Audio API synthesizers (music, meows, egg crack, horns)
    ├── storage.js      # IndexedDB & LocalStorage submission manager
    ├── scene3d.js      # Three.js 3D world: stage, dancing cats, cake, photo frames
    ├── eggBreak.js     # Funny interactive egg-cracking mini-game & photo reveal
    ├── admin.js        # Secret admin keypad (PIN 4505), table, gallery, export
    └── app.js          # Master coordinator for presentation flows & image optimization
```

---

## 🚀 How to Run

### Method 1: Open Directly in Any Browser (Zero Setup)
Simply double-click `index.html` or open it with Google Chrome, Safari, Firefox, Edge, or Arc.

### Method 2: Run with Python Server (Localhost)
If you prefer running via a local web server:
```bash
python3 server.py
```
Then visit **`http://localhost:8000`** in your browser.

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

1. Create a new repository on [GitHub](https://github.com) (e.g. `birthday-3d`).
2. Push your files to the repository:
   ```bash
   git init
   git add index.html css/ js/ README.md
   git commit -m "Initial commit of 3D Birthday Presentation"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
3. In your GitHub repository, go to **Settings** > **Pages**.
4. Under **Build and deployment > Branch**, select `main` and `/ (root)`, then click **Save**.
5. Your website will be live in ~1 minute at:
   ```
   https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```

---

## 🐾 Secret Admin Access Instructions

1. Scroll to the footer at the very bottom of the page.
2. **Click the small paw icon (`🐾`) 3 times in quick succession** (or press `Ctrl+Shift+A` on your keyboard).
3. When the passcode keypad appears, enter:
   ```
   4505
   ```
4. You will gain access to the **Admin Dashboard** to view all submitted names, messages, and uploaded photos!

---

## 🛠️ Built With

- **Three.js** (WebGL 3D Rendering)
- **HTML5 & CSS3** (Glassmorphism & Responsive Layouts)
- **Web Audio API** (Polyphonic Music & Sound Synthesizers)
- **IndexedDB & LocalStorage** (Client-side Data & Image Persistence)
- **Canvas Confetti** (Celebratory Particle Explosions)

---

Enjoy celebrating with cute dancing cats and egg-cellent smiles! 🎉🐱🥚
