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
      title: "Engagement & Welcoming",
      date: "Saturday, November 21, 2026",
      time: "07:30 PM Onwards",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli"
    },
    {
      title: "Wedding Muhurtham",
      date: "Sunday, November 22, 2026",
      time: "09:30 AM to 10:15 AM",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli"
    },
    {
      title: "Reception & Feast",
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
    if (isOpening) return;
    isOpening = true;

    // 1. Play background music on user gesture
    try {
      playAudioIfAllowed();
    } catch (err) {
      console.warn("Audio:", err);
    }

    // 2. Trigger slow-mo 3D temple doors swinging open with inner sanctum glow
    document.body.classList.add("door-opening");
    envelopeScreen.classList.add("opening");

    // 3. Seamlessly reveal main card as the radiant light peaks
    setTimeout(() => {
      envelopeScreen.classList.add("unveiled");
      envelopeScreen.classList.add("opened");
      try {
        if (typeof showerPetals === "function") {
          showerPetals(35);
        }
      } catch (err) {}
    }, 2000);
  }

  // Expose globally as safe fallback
  window.openTempleDoor = openDoor;

  const tapEvents = ["click", "pointerdown", "touchstart"];
  const rig = document.querySelector(".door-zoom-rig");
  tapEvents.forEach(evt => {
    envelopeScreen.addEventListener(evt, openDoor, { passive: true });
    if (rig) rig.addEventListener(evt, openDoor, { passive: true });
    if (sealBtn) sealBtn.addEventListener(evt, openDoor, { passive: true });
    if (envelopeWrapper) envelopeWrapper.addEventListener(evt, openDoor, { passive: true });
    if (cardContainer) cardContainer.addEventListener(evt, openDoor, { passive: true });
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
    petals.push(createPetal(true));
  }

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

      if (p.y > canvas.height + 20) {
        petals[i] = createPetal(false);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}

function createPetal(randomY = false) {
  const colors = [
    "#e63946", // Royal Red Rose
    "#ff4d6d", // Soft Pink Rose
    "#c9184a", // Deep Crimson
    "#ffb703", // Marigold Orange
    "#fb8500", // Deep Saffron
    "#ffd166"  // Golden Petal
  ];

  return {
    x: Math.random() * (canvas ? canvas.width : window.innerWidth),
    y: randomY ? Math.random() * (canvas ? canvas.height : window.innerHeight) : -20,
    size: Math.random() * 6 + 5,
    speedY: Math.random() * 0.75 + 0.3,
    speedX: Math.random() * 0.6 + 0.2,
    angle: Math.random() * Math.PI * 2,
    angularSpeed: Math.random() * 0.01 + 0.003,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.015,
    scale: Math.random() * 0.3 + 0.55,
    opacity: Math.random() * 0.25 + 0.2,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function showerPetals(count = 18) {
  if (!canvas) return;
  for (let i = 0; i < count; i++) {
    const p = createPetal(false);
    p.y = Math.random() * (canvas.height * 0.3);
    p.speedY = Math.random() * 1.8 + 0.9;
    petals.push(p);
  }

  setTimeout(() => {
    if (petals.length > 12) {
      petals.splice(12, petals.length - 12);
    }
  }, 3500);
}

// ========================================================
// BACKGROUND MUSIC / AUDIO HANDLER
// ========================================================
let audioInstance = null;
let isAudioPlaying = false;

function initAudio() {
  const musicBtn = document.getElementById("music-toggle-btn");
  audioInstance = document.getElementById("wedding-bg-music");

  if (!musicBtn || !audioInstance) return;

  function updateMusicBtn(playing) {
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

  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isAudioPlaying) {
      audioInstance.pause();
      isAudioPlaying = false;
      updateMusicBtn(false);
    } else {
      audioInstance.play().then(() => {
        isAudioPlaying = true;
        updateMusicBtn(true);
      }).catch(err => {
        console.log("Audio play prevented:", err);
      });
    }
  });

  // Listen for audio events
  audioInstance.addEventListener("play", () => {
    isAudioPlaying = true;
    updateMusicBtn(true);
  });
  audioInstance.addEventListener("pause", () => {
    isAudioPlaying = false;
    updateMusicBtn(false);
  });

  // Start on first user interaction anywhere on the page
  const startOnFirstGesture = () => {
    playAudioIfAllowed();
    document.removeEventListener("click", startOnFirstGesture);
    document.removeEventListener("touchstart", startOnFirstGesture);
    document.removeEventListener("keydown", startOnFirstGesture);
  };
  document.addEventListener("click", startOnFirstGesture, { once: true });
  document.addEventListener("touchstart", startOnFirstGesture, { once: true });
  document.addEventListener("keydown", startOnFirstGesture, { once: true });
}

function playAudioIfAllowed() {
  if (audioInstance && !isAudioPlaying) {
    audioInstance.play().then(() => {
      isAudioPlaying = true;
      const musicBtn = document.getElementById("music-toggle-btn");
      if (musicBtn) {
        musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
        musicBtn.classList.add("playing");
      }
    }).catch(() => {
      // Browsers often require explicit user interaction
    });
  }
}

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
function onProcessionTap(e) {
  if (e) e.stopPropagation();
  const actor = document.getElementById("royal-procession-actor") || document.getElementById("baby-elephant-actor");
  if (!actor) return;

  // Shower fragrant rose & golden petals
  if (typeof showerPetals === "function") {
    showerPetals(35);
  }

  // Trigger happy bounce jump
  actor.classList.remove("happy-jump");
  void actor.offsetWidth; // Force CSS reflow
  actor.classList.add("happy-jump");

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
  }, 1900);
}

// Global fallback accessors
window.onProcessionTap = onProcessionTap;
window.onBabyElephantTap = onProcessionTap;

