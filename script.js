// Default Fallback Photos
let photos = Array.from({ length: 15 }, (_, i) => `https://picsum.photos/600/800?random=${i + 1}`);
let currentSlide = 0;
let autoplay = true;
let progressTimer;
let progressVal = 0;

// Sci-Fi Audio Synthesizer (Web Audio API)
function playSciFiSound(freq = 600, type = 'sine') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

// Step Navigation System
function goToStep(stepNumber) {
  playSciFiSound(700, 'sawtooth');
  document.querySelectorAll('.story-step').forEach(step => step.classList.remove('active'));
  const target = document.getElementById(`step-${stepNumber}`);
  if (target) target.classList.add('active');

  if (stepNumber === 3) renderDeck();
  if (stepNumber === 4) updateSlide();
}

// Step 1: Core Unboxing
function openGift() {
  playSciFiSound(900, 'triangle');
  triggerConfetti();
  const music = document.getElementById('bg-music');
  if (music && music.src) music.play().catch(() => {});
  goToStep(2);
}

// Media Upload Handlers (Fixed Async Order with Promises)
function handlePhotoUpload(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const readPromises = files.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (evt) => resolve(evt.target.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readPromises).then(results => {
    photos = results;
    currentSlide = 0;
    renderDeck();
    updateSlide();
    playSciFiSound(1200);
  });
}

function handleAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const music = document.getElementById('bg-music');
  if (music) {
    music.src = URL.createObjectURL(file);
    music.play();
  }
}

// 3D Matrix Shuffle Deck
function renderDeck() {
  const deck = document.getElementById('deck');
  if (!deck) return;
  deck.innerHTML = '';
  const total = Math.min(photos.length, 8);
  
  for (let i = 0; i < total; i++) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.style.backgroundImage = `url(${photos[i]})`;
    card.style.top = `${i * -4}px`;
    card.style.transform = `rotate(${(i % 4 - 1.5) * 5}deg) translateZ(${-i * 15}px) scale(${1 - i * 0.03})`;
    card.style.zIndex = photos.length - i;
    deck.appendChild(card);
  }
}

function shuffleDeck() {
  const deck = document.getElementById('deck');
  if (!deck || !deck.firstElementChild) return;
  playSciFiSound(500, 'square');
  
  const topCard = deck.firstElementChild;
  topCard.style.transform = 'translateY(-200px) rotate(25deg) scale(0.8)';
  topCard.style.opacity = '0';
  
  setTimeout(() => {
    photos.push(photos.shift());
    renderDeck();
  }, 350);
}

// Viewport Slideshow Engine
function updateSlide() {
  const img = document.getElementById('slide-image');
  if (!img || !photos.length) return;
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = photos[currentSlide];
    img.style.opacity = '1';
  }, 200);
  resetProgress();
}

function nextSlide() {
  playSciFiSound(800);
  currentSlide = (currentSlide + 1) % photos.length;
  updateSlide();
}

function prevSlide() {
  playSciFiSound(400);
  currentSlide = (currentSlide - 1 + photos.length) % photos.length;
  updateSlide();
}

function resetProgress() {
  clearInterval(progressTimer);
  progressVal = 0;
  const pBar = document.getElementById('progress-bar');
  if (!pBar) return;
  
  progressTimer = setInterval(() => {
    if (!autoplay) return;
    progressVal += 2;
    pBar.style.width = `${progressVal}%`;
    if (progressVal >= 100) nextSlide();
  }, 60);
}

function toggleAutoplay() {
  playSciFiSound(600);
  autoplay = !autoplay;
  const btn = document.getElementById('play-btn');
  if (btn) btn.innerText = autoplay ? '❚❚ PAUSE' : '▶ PLAY';
}

// Laser Canvas Confetti System (Safely Initialized)
let canvas, ctx;
let particles = [];

window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(updateConfetti);
  }
});

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

function triggerConfetti() {
  if (!canvas) return;
  const colors = ['#00f0ff', '#ff0055', '#00ff88', '#7000ff'];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16 - 4,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100
    });
  }
}

function updateConfetti() {
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life -= 1;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      if (p.life <= 0) particles.splice(i, 1);
    }
  }
  requestAnimationFrame(updateConfetti);
}
