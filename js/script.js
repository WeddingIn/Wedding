/**
 * Royal Wedding Invitation - Core Interactive Engine
 * Sumanth S M & Amrutha S | English Edition
 */

// Central Configuration Object
const WEDDING_CONFIG = {
  groom: {
    name: "Sumanth S M",
    title: "Groom",
    parents: "Together with Family & Relatives"
  },
  bride: {
    name: "Amrutha S",
    title: "Bride",
    parents: "Together with Family & Relatives"
  },
  weddingDate: "2026-11-22T09:30:00+05:30", // Auspicious Muhurtham: Nov 22, 2026 at 9:30 AM
  venue: {
    name: "Sri Taralabalu Samudaya Bhavana",
    address: "Hospet Rd, Harapanahalli - T, Vijayanagar - D - 583131, Karnataka",
    googleMapsUrl: "https://maps.google.com/?q=Taralabalu+Conventional+Hall+Harapanahalli"
  },
  events: [
    {
      title: "Ceremonial Reception",
      date: "Saturday, November 21, 2026",
      time: "7:30 PM Onwards",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli"
    },
    {
      title: "Wedding Muhurtham",
      date: "Sunday, November 22, 2026",
      time: "9:30 AM – 10:15 AM",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli"
    },
    {
      title: "Wedding Reception & Feast",
      date: "Sunday, November 22, 2026",
      time: "12:00 PM Onwards",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli"
    }
  ]
};

// ========================================================
// INITIALIZATION ON DOM READY
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  initPetalCanvas();
  initCountdown();
  initAudio();
  initEnvelope();
  initGuestbook();
  initScrollReveal();
  initActiveNavTracker();
  initAutoScroll();
  initBirdsInteraction();
});

// ========================================================
// SCROLL-TRIGGERED REVEAL & NAVIGATION HIGHLIGHTER
// ========================================================
function initScrollReveal() {
  const sections = document.querySelectorAll(".scroll-reveal-section");
  if (!sections.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    sections.forEach(sec => observer.observe(sec));
  } else {
    sections.forEach(sec => sec.classList.add("revealed"));
  }
}

function initActiveNavTracker() {
  const navPills = document.querySelectorAll(".couture-nav-pill");
  const sections = document.querySelectorAll(".scroll-reveal-section");
  if (!navPills.length || !sections.length) return;

  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.pageYOffset >= sectionTop) {
        currentId = section.getAttribute("id");
      }
    });

    navPills.forEach(pill => {
      const href = pill.getAttribute("href");
      if (href === `#${currentId}`) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }, { passive: true });
}

// ========================================================
// TRADITIONAL TEMPLE DOOR OPENING INTERACTION
// ========================================================
function initEnvelope() {
  const envelopeScreen = document.getElementById("envelope-screen");
  const cardContainer = document.getElementById("card-container");
  const sealBtn = document.getElementById("wax-seal-btn");
  const envelopeWrapper = document.getElementById("envelope-wrapper");

  if (!envelopeScreen) return;

  let isOpening = false;

  function openDoor(e) {
    // 1. Always attempt background music on every gesture (pointerdown, touchend, click)
    try {
      playAudioIfAllowed();
    } catch (err) {
      console.warn("Audio:", err);
    }

    if (isOpening) return;
    isOpening = true;

    // 2. Trigger slow-mo 3D temple doors swinging open with bright flash & couple portrait
    document.body.classList.add("door-opening");
    envelopeScreen.classList.add("opening");

    // 3. Lighting shines, then standing couple pic visible, then land on main page at 2.5s door timeout
    setTimeout(() => {
      envelopeScreen.classList.add("unveiled");
      envelopeScreen.classList.add("opened");
      try {
        if (typeof showerPetals === "function") {
          showerPetals(45);
        }
      } catch (err) {}
      if (typeof window.stopAutoScroll === "function") {
        window.stopAutoScroll(true);
      }
    }, 2500);
  }

  // Expose globally as safe fallback
  window.openTempleDoor = openDoor;

  // Single cleanly bound touch/click trigger on the door gate (pointerdown, touchend, click)
  ["pointerdown", "touchend", "click"].forEach(evt => {
    envelopeScreen.addEventListener(evt, openDoor, { passive: true });
  });
}

// ========================================================
// COUNTDOWN TIMER
// ========================================================
function initCountdown() {
  const targetDate = new Date(WEDDING_CONFIG.weddingDate).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    if (dEl) dEl.innerText = String(days).padStart(2, '0');
    if (hEl) hEl.innerText = String(hours).padStart(2, '0');
    if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
    if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ========================================================
// PETAL SHOWER & CANVAS PHYSICS
// ========================================================
let petals = [];
let canvas, ctx;
let animationFrameId;

function initPetalCanvas() {
  canvas = document.getElementById("petals-canvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Subtle ambient floating petals (calm, minimal, elegant)
  for (let i = 0; i < 8; i++) {
    petals.push(createPetal(true, false));
  }

  let frameTick = 0;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * p.speedX;
      p.angle += p.angularSpeed;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size);
      ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.restore();

      if (p.y > canvas.height + 25) {
        if (p.isShower) {
          // Gracefully dispose shower petals when they finish falling past the screen
          petals.splice(i, 1);
          i--;
        } else {
          // Continuous looping ambient petals
          petals[i] = createPetal(false, false);
        }
      }
    }

    // Check if elephant procession is passing over the shower blessing button on that side
    frameTick++;
    if (frameTick % 5 === 0) {
      updateProcessionButtonOverlap();
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}

function createPetal(randomY = false, isShower = false) {
  const colors = [
    "#e63946", // Royal Red Rose
    "#ff4d6d", // Soft Pink Rose
    "#c9184a", // Deep Crimson
    "#ffb703", // Marigold Orange
    "#fb8500", // Deep Saffron
    "#ffd166"  // Golden Petal
  ];

  const w = canvas ? canvas.width : window.innerWidth;
  const h = canvas ? canvas.height : window.innerHeight;

  return {
    isShower: isShower,
    x: Math.random() * w,
    y: randomY ? Math.random() * h : (isShower ? Math.random() * -120 - 15 : -25),
    size: Math.random() * 6 + 5,
    speedY: isShower ? (Math.random() * 1.6 + 1.2) : (Math.random() * 0.75 + 0.3),
    speedX: Math.random() * 0.6 + 0.25,
    angle: Math.random() * Math.PI * 2,
    angularSpeed: Math.random() * 0.015 + 0.005,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    scale: Math.random() * 0.3 + 0.6,
    opacity: isShower ? (Math.random() * 0.3 + 0.55) : (Math.random() * 0.25 + 0.2),
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

// Multi-click safe petal shower that never freezes or breaks on rapid clicks
function showerPetals(count = 28) {
  if (!canvas) return;

  // Tactile button click feedback
  const btn = document.querySelector(".shower-petals-btn");
  if (btn) {
    btn.classList.remove("btn-pulsing");
    void btn.offsetWidth;
    btn.classList.add("btn-pulsing");
    setTimeout(() => {
      if (btn) btn.classList.remove("btn-pulsing");
    }, 350);
  }

  // Safe cap so performance stays locked at 60fps regardless of rapid tapping
  const effectiveCount = Math.min(count, 32);
  const maxTotalPetals = 70;

  const canAdd = Math.max(0, maxTotalPetals - petals.length);
  const toAdd = Math.min(effectiveCount, canAdd);

  for (let i = 0; i < toAdd; i++) {
    petals.push(createPetal(false, true));
  }

  // If already near cap from multiple rapid clicks, refresh petals from the top
  if (toAdd < effectiveCount) {
    let refreshed = 0;
    const needed = effectiveCount - toAdd;
    for (let i = 0; i < petals.length && refreshed < needed; i++) {
      if (petals[i].isShower && petals[i].y > (canvas.height * 0.35)) {
        petals[i] = createPetal(false, true);
        refreshed++;
      }
    }
  }
}

// Hide shower blessings button smoothly when elephant procession passes on that side
function updateProcessionButtonOverlap() {
  const actor = document.getElementById("royal-procession-actor");
  const btn = document.querySelector(".shower-petals-btn");
  if (!actor || !btn) return;

  const aRect = actor.getBoundingClientRect();
  const bRect = btn.getBoundingClientRect();

  // Determine if elephant procession is passing across the button's horizontal zone on that side
  const isPassing = (aRect.right > (bRect.left - 25)) && (aRect.left < (bRect.right + 30));

  if (isPassing) {
    btn.classList.add("procession-passing");
  } else {
    btn.classList.remove("procession-passing");
  }
}

// ========================================================
// BACKGROUND MUSIC / AUDIO HANDLER (ANDROID & IOS COMPATIBLE)
// ========================================================
let audioInstance = null;
let elephantAudioInstance = null;
let birdAudioInstance = null;
let isAudioPlaying = false;
let elephantInterval = null;
let audioCtxUnlocked = false;

function updateMusicBtn(playing) {
  const musicBtn = document.getElementById("music-toggle-btn");
  if (!musicBtn) return;
  if (playing) {
    musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
    musicBtn.classList.add("playing");
    musicBtn.title = "Pause Music";
  } else {
    musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    musicBtn.classList.remove("playing");
    musicBtn.title = "Play Music";
  }
}

function unlockAudioContext() {
  if (audioCtxUnlocked) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (!window.__weddingAudioCtx) {
        window.__weddingAudioCtx = new AudioCtx();
      }
      if (window.__weddingAudioCtx.state === "suspended") {
        window.__weddingAudioCtx.resume().then(() => {
          audioCtxUnlocked = true;
        });
      } else {
        audioCtxUnlocked = true;
      }
    }
  } catch (e) {}
}

const GLOBAL_AUDIO_EVENTS = ["click", "touchend", "pointerup", "keydown"];

function onUserGestureAudioTrigger() {
  playAudioIfAllowed();
}

function attachGlobalAudioTriggers() {
  GLOBAL_AUDIO_EVENTS.forEach(evt => {
    document.addEventListener(evt, onUserGestureAudioTrigger, { passive: true });
  });
}

function removeGlobalAudioTriggers() {
  GLOBAL_AUDIO_EVENTS.forEach(evt => {
    document.removeEventListener(evt, onUserGestureAudioTrigger);
  });
}

function initAudio() {
  const musicBtn = document.getElementById("music-toggle-btn");
  audioInstance = document.getElementById("wedding-bg-music");
  elephantAudioInstance = document.getElementById("elephant-ambient-sound");
  birdAudioInstance = document.getElementById("bird-chirp-sound");

  if (audioInstance) {
    audioInstance.volume = 1.0;
  }
  if (elephantAudioInstance) {
    elephantAudioInstance.volume = 0.22;
  }
  if (birdAudioInstance) {
    birdAudioInstance.volume = 0.75;
  }

  if (!musicBtn || !audioInstance) return;

  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isAudioPlaying) {
      audioInstance.pause();
      isAudioPlaying = false;
      updateMusicBtn(false);
    } else {
      unlockAudioContext();
      audioInstance.muted = false;
      audioInstance.volume = 1.0;
      audioInstance.play().then(() => {
        isAudioPlaying = true;
        updateMusicBtn(true);
        removeGlobalAudioTriggers();
      }).catch(err => {
        console.log("Audio play prevented:", err);
      });
    }
  });

  // Listen for audio events
  audioInstance.addEventListener("play", () => {
    isAudioPlaying = true;
    updateMusicBtn(true);
    removeGlobalAudioTriggers();
  });
  audioInstance.addEventListener("pause", () => {
    isAudioPlaying = false;
    updateMusicBtn(false);
  });

  // Attach persistent interaction listeners that wait for genuine user gesture
  attachGlobalAudioTriggers();

  // Try immediate autoplay (works on desktop / permitted environments)
  playAudioIfAllowed();
}

function playAudioIfAllowed() {
  if (!audioInstance || isAudioPlaying) return;

  try {
    unlockAudioContext();
  } catch (e) {}

  audioInstance.muted = false;
  audioInstance.volume = 1.0;

  const playPromise = audioInstance.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      updateMusicBtn(true);
      removeGlobalAudioTriggers();
    }).catch(err => {
      // Pending genuine Android/iOS user gesture (e.g. touchend/click); keep triggers active
    });
  }
}

// Elephant sound ONLY plays when user clicks on the elephant
function playSoothingElephantSound(customVol = 0.22) {
  if (elephantAudioInstance) {
    elephantAudioInstance.volume = customVol;
    elephantAudioInstance.currentTime = 0;
    const playPromise = elephantAudioInstance.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        synthesizeSoothingElephantCall(customVol);
      });
    }
  } else {
    synthesizeSoothingElephantCall(customVol);
  }
}

// Melodious Cuckoo / Bird Chirp sound handler
function playBirdChirpSound(customVol = 0.75) {
  unlockAudioContext();
  if (birdAudioInstance) {
    try {
      if (birdAudioInstance.paused || birdAudioInstance.ended) {
        birdAudioInstance.volume = customVol;
        birdAudioInstance.currentTime = 0;
        const p = birdAudioInstance.play();
        if (p !== undefined) {
          p.catch(() => {
            playCloneBirdAudio(customVol);
          });
        }
      } else {
        // Fast repeated taps: clone node for overlapping chirps
        playCloneBirdAudio(customVol);
      }
    } catch (e) {
      playCloneBirdAudio(customVol);
    }
  } else {
    playCloneBirdAudio(customVol);
  }
}

function playCloneBirdAudio(vol = 0.75) {
  try {
    const src = birdAudioInstance || document.getElementById("bird-chirp-sound");
    if (src) {
      const clone = src.cloneNode(true);
      clone.volume = vol;
      clone.currentTime = 0;
      clone.play().catch(() => {});
      clone.addEventListener("ended", () => {
        try { clone.remove(); } catch (e) {}
      });
    }
  } catch (e) {}
}

// Web Audio API soothing synthesized elephant ambient call fallback
function synthesizeSoothingElephantCall(volume = 0.22) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const t = ctx.currentTime;
    const dur = 2.6;

    // Gentle master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(volume * 0.45, t + 0.8);
    masterGain.gain.linearRampToValueAtTime(volume * 0.45, t + 1.6);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    // Warm Lowpass filter (soothing, mellow tone)
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(360, t);
    filter.frequency.linearRampToValueAtTime(680, t + 0.8);
    filter.frequency.exponentialRampToValueAtTime(320, t + dur);
    filter.Q.value = 1.6;

    // Rising Pitch Oscillator: 125Hz -> 215Hz -> 185Hz
    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(125, t);
    osc1.frequency.exponentialRampToValueAtTime(215, t + 0.9);
    osc1.frequency.linearRampToValueAtTime(185, t + dur);

    // Sub-harmonic sine for deep chest resonance
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(62, t);
    osc2.frequency.exponentialRampToValueAtTime(107, t + 0.9);
    osc2.frequency.linearRampToValueAtTime(92, t + dur);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.55;

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + dur);
    osc2.stop(t + dur);
  } catch (err) {}
}

// Default walk sound cycle removed - sound only plays on user tap
function startElephantWalkSoundCycle() {}

// ========================================================
// BLESSINGS & GUESTBOOK
// ========================================================
const DEFAULT_BLESSINGS = [
  {
    name: "Family & Well-Wishers",
    text: "Wishing Sumanth & Amrutha a lifetime of everlasting love, joy, and togetherness!"
  }
];

function initGuestbook() {
  const form = document.getElementById("blessing-form");
  const list = document.getElementById("wishes-list");

  let savedWishes = [];
  try {
    const stored = localStorage.getItem("wedding_blessings_v2");
    savedWishes = stored ? JSON.parse(stored) : [...DEFAULT_BLESSINGS];
  } catch (e) {
    savedWishes = [...DEFAULT_BLESSINGS];
  }

  function renderWishes() {
    if (!list) return;
    list.innerHTML = savedWishes.map(item => `
      <div class="wish-card-item wish-item">
        <div class="wish-guest-name wish-author">${escapeHtml(item.name)}</div>
        <div class="wish-content-quote wish-text">"${escapeHtml(item.text)}"</div>
      </div>
    `).join("");
  }

  renderWishes();

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("guest-name");
      const textInput = document.getElementById("guest-message");

      const name = nameInput.value.trim();
      const text = textInput.value.trim();

      if (name && text) {
        savedWishes.unshift({ name, text });
        try {
          localStorage.setItem("wedding_blessings_v2", JSON.stringify(savedWishes));
        } catch (e) {}

        renderWishes();
        showerPetals(18);
        nameInput.value = "";
        textInput.value = "";

        const submitBtn = form.querySelector("button[type='submit']");
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "✨ Blessing Sent!";
        setTimeout(() => {
          submitBtn.innerText = originalText;
        }, 2500);
      }
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ========================================================
// ADD TO CALENDAR HELPER
// ========================================================
function addToGoogleCalendar(title, startDate, endDate, location, details) {
  const formatTime = (isoStr) => new Date(isoStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatTime(startDate)}/${formatTime(endDate)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(details)}`;
  window.open(url, "_blank");
}

// ========================================================
// ROYAL PROCESSION & ELEPHANT CHARIOT INTERACTIVE TAP BLESSING
// ========================================================
let processionJumpTimeout = null;
function onProcessionTap(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  const actor = document.getElementById("royal-procession-actor") || document.getElementById("baby-elephant-actor");
  if (!actor) return;

  // Shower fragrant rose & golden petals safely
  if (typeof showerPetals === "function") {
    showerPetals(25);
  }

  // Play gentle elephant blessing sound ONLY on user click!
  playSoothingElephantSound(0.25);

  // Trigger happy bounce jump on the inner SVG (never stopping or resetting the horizontal march!)
  actor.classList.remove("happy-jump");
  void actor.offsetWidth; // Force reflow
  actor.classList.add("happy-jump");

  if (processionJumpTimeout) clearTimeout(processionJumpTimeout);
  processionJumpTimeout = setTimeout(() => {
    actor.classList.remove("happy-jump");
  }, 700);

  // Auspicious blessing messages
  const blessingMessages = [
    "🌸 Gajaraja's Auspicious Blessings! 🐘",
    "✨ Auspicious Joy & Eternal Prosperity!",
    "💍 Warm Blessings for Sumanth & Amrutha! 🌸",
    "🪷 May Love & Harmony Forever Bloom! ✨"
  ];
  const chosenMsg = blessingMessages[Math.floor(Math.random() * blessingMessages.length)];

  // Remove existing popup if any
  const oldPopup = actor.querySelector(".elephant-blessing-popup");
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement("div");
  popup.className = "elephant-blessing-popup";
  popup.textContent = chosenMsg;
  actor.appendChild(popup);

  setTimeout(() => {
    if (popup.parentNode) popup.parentNode.removeChild(popup);
  }, 2200);
}

// Global fallback accessors
window.onProcessionTap = onProcessionTap;
window.onBabyElephantTap = onProcessionTap;

// ========================================================
// AUSPICIOUS BIRD TAP / CHIRP SOUND INTERACTION
// ========================================================
const BIRD_CHIRP_PHRASES = [
  "🎶 Ku-hoo! 🌸",
  "🎵 Chirp! 🌿",
  "✨ Koo-hoo! 🕊️",
  "🎶 🕊️ 🌸",
  "✨ Sweet Chirp! 🦜"
];

let lastBirdTapTime = 0;

function onBirdTap(e, targetEl) {
  const now = Date.now();
  if (now - lastBirdTapTime < 280) {
    return; // Debounce dual click/touchend
  }
  lastBirdTapTime = now;

  if (e && e.stopPropagation) {
    e.stopPropagation();
  }

  const bird = targetEl || (e && (e.currentTarget || (e.target && e.target.closest(".flying-bird-actor, .arch-bird-actor, #left-parrot, #right-parrot, #left-peacock, #right-peacock"))));
  if (!bird) return;

  // Play melodious bird sound instantly
  playBirdChirpSound(0.75);

  // Trigger happy flutter bounce
  bird.classList.remove("happy-flutter");
  void bird.offsetWidth; // Force reflow
  bird.classList.add("happy-flutter");

  setTimeout(() => {
    bird.classList.remove("happy-flutter");
  }, 750);

  // Shower fragrant rose & golden petals
  if (typeof showerPetals === "function") {
    showerPetals(12);
  }

  // Display floating chirp bubble
  showBirdChirpPopup(bird);
}

function showBirdChirpPopup(bird) {
  try {
    const phrase = BIRD_CHIRP_PHRASES[Math.floor(Math.random() * BIRD_CHIRP_PHRASES.length)];
    const popup = document.createElement("div");
    popup.className = "bird-chirp-popup";
    popup.textContent = phrase;

    if (bird.tagName && bird.tagName.toLowerCase() === "g") {
      // SVG arch element: position based on viewport rect
      const rect = bird.getBoundingClientRect();
      popup.style.position = "fixed";
      popup.style.left = (rect.left + rect.width / 2) + "px";
      popup.style.top = (rect.top - 8) + "px";
      popup.style.transform = "translate(-50%, -100%)";
      document.body.appendChild(popup);
      setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
      }, 1800);
    } else {
      // HTML flying bird: remove old popup inside this bird if any, append new
      const old = bird.querySelector(".bird-chirp-popup");
      if (old) old.remove();
      bird.appendChild(popup);
      setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
      }, 1800);
    }
  } catch (err) {
    console.log("Bird popup error:", err);
  }
}

function initBirdsInteraction() {
  const birds = document.querySelectorAll(".flying-bird-actor, .arch-bird-actor, #left-parrot, #right-parrot, #left-peacock, #right-peacock");
  birds.forEach((bird) => {
    bird.style.cursor = "pointer";
    bird.style.pointerEvents = "auto";

    bird.addEventListener("click", (e) => {
      onBirdTap(e, bird);
    });

    let touchMoved = false;
    bird.addEventListener("touchstart", () => {
      touchMoved = false;
    }, { passive: true });

    bird.addEventListener("touchmove", () => {
      touchMoved = true;
    }, { passive: true });

    bird.addEventListener("touchend", (e) => {
      if (!touchMoved) {
        onBirdTap(e, bird);
      }
    });
  });
}

// Global fallback accessors
window.onBirdTap = onBirdTap;
window.playBirdChirpSound = playBirdChirpSound;

// ========================================================
// ELEGANT IDLE AUTO-SCROLL ENGINE
// ========================================================
function initAutoScroll() {
  const IDLE_DELAY_MS = 3000; // 3 seconds of inactivity
  const SCROLL_SPEED_PX_PER_SEC = 48; // Gentle slow scroll (~0.8px / frame at 60fps)

  let idleTimer = null;
  let rafId = null;
  let isAutoScrolling = false;
  let lastProgrammaticScrollTime = 0;
  let lastTimestamp = null;
  let accumulatedScroll = window.pageYOffset;

  function isInvitationVisible() {
    const envelopeScreen = document.getElementById("envelope-screen");
    if (!envelopeScreen) return true;
    return envelopeScreen.classList.contains("opened") || envelopeScreen.classList.contains("unveiled");
  }

  function isAtBottom() {
    const scrollBottom = window.pageYOffset + window.innerHeight;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    return scrollBottom >= docHeight - 12;
  }

  function startAutoScroll() {
    if (isAutoScrolling || isAtBottom() || !isInvitationVisible()) return;

    isAutoScrolling = true;
    lastTimestamp = null;
    accumulatedScroll = window.pageYOffset;
    document.documentElement.style.scrollBehavior = "auto";

    function step(timestamp) {
      if (!isAutoScrolling) return;

      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }
      const deltaMs = Math.min(timestamp - lastTimestamp, 100);
      lastTimestamp = timestamp;

      if (isAtBottom()) {
        stopAutoScroll(false);
        return;
      }

      const move = (SCROLL_SPEED_PX_PER_SEC * deltaMs) / 1000;
      accumulatedScroll += move;

      lastProgrammaticScrollTime = performance.now();
      window.scrollTo(0, accumulatedScroll);

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
  }

  function stopAutoScroll(scheduleResume = true) {
    if (isAutoScrolling) {
      isAutoScrolling = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      document.documentElement.style.scrollBehavior = "";
    }

    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    if (scheduleResume && isInvitationVisible() && !isAtBottom()) {
      idleTimer = setTimeout(() => {
        startAutoScroll();
      }, IDLE_DELAY_MS);
    }
  }

  function handleUserActivity(e) {
    // If this is a scroll event generated by our auto-scroller, ignore it
    if (e && e.type === "scroll" && (performance.now() - lastProgrammaticScrollTime < 120)) {
      return;
    }
    // Update accumulated scroll to current position so resuming continues from here
    accumulatedScroll = window.pageYOffset;
    stopAutoScroll(true);
  }

  const userEvents = [
    "wheel",
    "touchstart",
    "touchmove",
    "touchend",
    "mousedown",
    "pointerdown",
    "keydown",
    "scroll"
  ];

  userEvents.forEach(evt => {
    window.addEventListener(evt, handleUserActivity, { passive: true });
  });

  function scheduleInitialStart() {
    stopAutoScroll(true);
  }

  if (isInvitationVisible()) {
    scheduleInitialStart();
  }

  const envelopeScreen = document.getElementById("envelope-screen");
  if (envelopeScreen) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          if (isInvitationVisible()) {
            scheduleInitialStart();
            observer.disconnect();
            break;
          }
        }
      }
    });
    observer.observe(envelopeScreen, { attributes: true });
  }

  window.stopAutoScroll = stopAutoScroll;
  window.startAutoScroll = startAutoScroll;
}

