# 🕉️ The Truth: Legend of Hanuman

![Three.js](https://img.shields.io/badge/Three.js-r150-black?style=for-the-badge&logo=three.js)
![HTML5](https://img.shields.io/badge/HTML5-Audio-orange?style=for-the-badge&logo=html5)
![JavaScript](https://img.shields.io/badge/Vanilla%20JS-ES6+-yellow?style=for-the-badge&logo=javascript)

An immersive, 3D parallax-scrolling web experience that narrates the divine journey of Hanuman. This project utilizes **Three.js** to create depth-based storytelling panels, where users scroll through a 3D environment accompanied by atmospheric gold dust particles, cinematic typography, and context-aware audio narration.

## ✨ Key Features

* **3D Parallax Scrolling:** Uses Three.js `PlaneGeometry` to stack image layers (Background, Mid-ground, Foreground) at different Z-depths, creating a realistic depth effect upon scrolling.
* **Dynamic Audio Engine:**
    * **Background Ambience:** HTML5 Audio player (hidden) for reliable, looping background music with volume normalization.
    * **Spatial Narration:** Three.js `AudioLoader` triggers specific voiceovers (`panelX.mp3`) based on the camera's vertical position.
    * **Autoplay Handling:** Includes a "Begin Legend" user interaction gate to ensure audio plays correctly across all modern browsers.
* **Visual Effects:** Custom shader-like "Gold Dust" particle system (`PointsMaterial`) that floats and reacts to scroll movement.
* **Cinematic Typography:** Sentence-by-sentence text reveals with blur-in and fade-up animations.
* **Responsive Viewport:** Auto-scaling logic to maintain aspect ratios across different monitor sizes.

## 📂 Project Structure

```text
TRUTH/
├── index.html          # Main entry point (HTML5 Audio & UI)
├── style.css           # CSS for Typography, Loader, and UI overlays
├── script.js           # Three.js logic, Asset Loading, Scroll Physics
└── assets/
    ├── audio/          # Narrations (panel1-11.mp3) & Music (bgmusic.mp3)
    └── panels/         # Layered PNGs (panelX_bg, panelX_mid, panelX_fg)