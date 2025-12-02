import * as THREE from 'three';

// --- CONFIGURATION ---
const TOTAL_PANELS = 11;
const PANEL_SPACING = 30; 
const SCROLL_SPEED = 0.08;
const SENTENCE_DELAY_MS = 1500; 

// Text Data
const STORY_TEXT = {
    1: `After the defeat of Ravana, Ram Rajya blossomed on earth. Peace reigned.<br><br>But the Devtas knew… Vishnu must return to Vaikuntha.<br><span class="speaker-name">Deva:</span>“Yamaraja… the moment has come. Vishnu must return.”<br>“I have tried, Indra… but I cannot reach Him.”`,
    2: `<br>“Hanuman stands guard over Ram like an unbreakable fortress.<br><br>Even death cannot approach.”<br><br><span class="speaker-name">Narration:</span>“The Devtas knew… destiny was waiting.<br>But the path to fulfill it was blocked by devotion itself.”`,
    3: `<span class="speaker-name">Narration:</span><br>Rama understood the silence behind the heavens… Destiny was calling.<br><br><span class="speaker-name">Indra:</span>“Prabhu… forgive me for speaking, but… I cannot perform my duty. Hanuman does not allow even death to come near You.”<br><br><span class="speaker-name">Ram:</span>“Yama… I know. Hanuman’s devotion is boundless. But every leela has its moment… and mine must now unfold.”`,
    4: `<span class="speaker-name">Narration:</span>“And so, in divine play, Rama let His ring fall into the depths of the earth…<br>guiding Hanuman toward the truth of time itself.”<br><br><span class="speaker-name">Ram:</span>“Hanuman… my ring has slipped below.<br>Bring it back, dear one.”`,
    5: ``, 
    6: `“With folded hands and unquestioning love,<br>Hanuman bowed.”`,
    7: `<span class="speaker-name">Vasuki:</span>“Welcome, Hanuman… child of the wind.<br>You have crossed realms untraveled by mortals.<br>Tell me… what do you seek in Naag Lok?”<br><br><span class="speaker-name">Hanuman:</span>“I seek my Lord’s ring… the symbol of His faith in me.”<br><br><span class="speaker-name">Vasuki:</span>“A ring you seek… but the truth you will find.”`,
    8: `“The cycle itself, Hanuman.<br>Rings within rings… stories within stories…”<br><br>“These rings are echoes of time itself.”<br><br>“You have been here before—<br>not once,<br>not twice,<br>but beyond the counting of gods.”`,
    9: `“Every age repeats. Every story returns.<br>And every time the cycle turns…<br>you come searching for the same ring.”<br><br>“An infinite loop… a divine test.”<br><br>“You are the constant.”<br>“You are the one who returns.”`,
    10: `“He saw himself across countless lives—<br>kneeling, praying, searching.”<br><br>“The world changes. Time changes.<br>But Hanuman remains.”`,
    11: `“As Hanuman held the ring, its light trembled…<br>the same light that once shone from Ram’s smile.”<br><br>“He understood:<br>Love like his does not end with lifetimes.”<br><br>“For Ram may leave the world—<br>but He has never once left Hanuman’s heart.”`
};

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.03); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- ASSET MANAGEMENT ---
const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);
const audioLoader = new THREE.AudioLoader(manager);

const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const enterBtn = document.getElementById('enter-btn');
const subtitleTextContainer = document.getElementById('subtitle-text');
const scrollIndicator = document.getElementById('scroll-indicator');

// GRAB THE HTML MUSIC PLAYER
const bgMusicPlayer = document.getElementById('bg-music-player');

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    progressBar.style.width = progress + '%';
};

manager.onLoad = () => {
    enterBtn.classList.add('visible');
    enterBtn.innerHTML = "BEGIN LEGEND";
};

// --- AUDIO SYSTEM (VOICES) ---
// We keep Three.js for the panel voices because they work fine
const listener = new THREE.AudioListener();
camera.add(listener);

const panelAudios = {}; 
const audioPanels = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11];
audioPanels.forEach(i => {
    const sound = new THREE.Audio(listener);
    audioLoader.load(`assets/audio/panel${i}.mp3`, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(1.0);
        panelAudios[i] = sound;
    });
});

// --- PARALLAX PANELS ---
const panelGroups = [];

function createPanel(index, yPos) {
    const group = new THREE.Group();
    group.position.y = -yPos; 

    // --- ZOOM SETTINGS ---
    const layers = [
        { suffix: '_bg.png', z: -4, scale: 1.6 },   
        { suffix: '_mid.png', z: -1, scale: 1.2 },  
        { suffix: '_fg.png', z: 1.5, scale: 0.85 }  
    ];

    layers.forEach(layer => {
        const path = `assets/panels/panel${index}${layer.suffix}`;
        textureLoader.load(path, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            const aspect = tex.image.width / tex.image.height;
            const height = 11; 
            const width = height * aspect;

            const geo = new THREE.PlaneGeometry(width, height);
            const mat = new THREE.MeshBasicMaterial({ 
                map: tex, 
                transparent: true,
                opacity: 0 
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.z = layer.z;
            mesh.scale.set(layer.scale, layer.scale, 1);
            group.add(mesh);
        });
    });

    scene.add(group);
    panelGroups.push({ id: index, group: group, y: -yPos });
}

for (let i = 1; i <= TOTAL_PANELS; i++) {
    createPanel(i, i * PANEL_SPACING);
}

// --- GOLD PARTICLES ---
const particleCount = 2000;
const particlesGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 60;   
    posArray[i+1] = -(Math.random() * (TOTAL_PANELS * PANEL_SPACING + 40)) + 40; 
    posArray[i+2] = (Math.random() - 0.5) * 40; 
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const canvas = document.createElement('canvas');
canvas.width = 32; canvas.height = 32;
const ctx = canvas.getContext('2d');
const grad = ctx.createRadialGradient(16,16,0,16,16,16);
grad.addColorStop(0, 'rgba(255, 230, 100, 1)'); 
grad.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = grad;
ctx.fillRect(0,0,32,32);
const particleTex = new THREE.CanvasTexture(canvas);

const particlesMat = new THREE.PointsMaterial({
    size: 0.8, 
    map: particleTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0xffdd44
});

const particleSystem = new THREE.Points(particlesGeo, particlesMat);
scene.add(particleSystem);

// --- LOGIC: SCROLL & ANIMATION ---
let currentScrollY = 0;
let targetScrollY = 0;
let currentActivePanel = -1;
let clock = new THREE.Clock();
let subtitleTimeouts = []; 

const maxScroll = (TOTAL_PANELS + 0.5) * PANEL_SPACING;

window.addEventListener('wheel', (e) => {
    targetScrollY += e.deltaY * SCROLL_SPEED;
    targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
});

let touchStart = 0;
window.addEventListener('touchstart', (e) => touchStart = e.touches[0].clientY);
window.addEventListener('touchmove', (e) => {
    const delta = touchStart - e.touches[0].clientY;
    targetScrollY += delta * 0.1;
    targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
    touchStart = e.touches[0].clientY;
});

// --- BUTTON LOGIC ---
enterBtn.addEventListener('click', () => {
    loadingScreen.style.opacity = '0';
    scrollIndicator.style.opacity = '1'; 
    setTimeout(() => loadingScreen.remove(), 1000);

    // 1. Resume Three.js Audio Context (For Voices)
    if (listener.context.state === 'suspended') {
        listener.context.resume();
    }

    // 2. Play HTML5 BG Music (Reliable Method)
    if (bgMusicPlayer) {
        bgMusicPlayer.volume = 0.4; // Set Volume Here
        bgMusicPlayer.play().catch(error => {
            console.log("Music play failed:", error);
        });
    }
});

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    currentScrollY += (targetScrollY - currentScrollY) * 0.05;
    camera.position.y = -currentScrollY;

    // Scroll Indicator Logic
    if (scrollIndicator) {
        const fade = Math.max(0, 1 - (currentScrollY / 10));
        scrollIndicator.style.opacity = fade;
        if (fade <= 0) scrollIndicator.style.display = 'none';
    }

    // Particles
    particleSystem.rotation.y += 0.002; 
    particleSystem.position.y = (-currentScrollY * 0.8) + (Math.sin(time * 0.5) * 2);

    // Panel Logic
    let activePanelIndex = -1;
    let closestDist = 9999;

    panelGroups.forEach(p => {
        const dist = Math.abs(camera.position.y - p.y);
        const opacity = Math.max(0, 1 - (dist / 15));
        p.group.children.forEach(mesh => mesh.material.opacity = opacity);

        if (dist < 10) {
            if (dist < closestDist) {
                closestDist = dist;
                activePanelIndex = p.id;
            }
        }
    });

    // Audio & Subtitles
    if (activePanelIndex !== -1 && activePanelIndex !== currentActivePanel) {
        
        if (currentActivePanel !== -1 && panelAudios[currentActivePanel] && panelAudios[currentActivePanel].isPlaying) {
            panelAudios[currentActivePanel].stop();
        }

        subtitleTextContainer.innerHTML = "";
        subtitleTimeouts.forEach(clearTimeout);
        subtitleTimeouts = [];

        if (panelAudios[activePanelIndex]) {
            panelAudios[activePanelIndex].play();
        }

        const textRaw = STORY_TEXT[activePanelIndex];
        if (textRaw) {
            let chunks = textRaw.split(/<br\s*\/?>/gi);
            chunks = chunks.filter(chunk => chunk.trim() !== "");

            const chunkElements = [];
            chunks.forEach(chunkHtml => {
                const div = document.createElement('div');
                div.classList.add('sentence-chunk');
                div.innerHTML = chunkHtml;
                subtitleTextContainer.appendChild(div);
                chunkElements.push(div);
            });

            chunkElements.forEach((el, index) => {
                const timeoutId = setTimeout(() => {
                   el.classList.add('visible');
                }, index * SENTENCE_DELAY_MS); 
                subtitleTimeouts.push(timeoutId);
            });
        }

        currentActivePanel = activePanelIndex;
    }

    if (closestDist > 12) {
        if (subtitleTextContainer.innerHTML !== "") {
             subtitleTextContainer.innerHTML = "";
             subtitleTimeouts.forEach(clearTimeout);
             subtitleTimeouts = [];
        }
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();