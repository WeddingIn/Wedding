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
  initSwipeAndKeyNav();
});

// ========================================================
// STEP-BY-STEP REVEAL CONTROLLER
// ========================================================
let currentStep = 1;
const totalSteps = 4;

function goToStep(stepNum) {
  if (stepNum < 1 || stepNum > totalSteps) return;
  currentStep = stepNum;

  // Update Progress Tabs
  const tabs = document.querySelectorAll(".step-tab, .couture-nav-tab");
  tabs.forEach(tab => {
    const s = parseInt(tab.getAttribute("data-step"));
    if (s === currentStep) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Update Step Panels
  const steps = document.querySelectorAll(".invitation-step, .couture-step");
  steps.forEach((step, idx) => {
    if (idx + 1 === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  // Smooth scroll to top of card on step change
  const card = document.querySelector(".royal-card, .couture-card");
  if (card && window.scrollY > 150) {
    const topOffset = card.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: topOffset, behavior: "smooth" });
  }

  // Petal burst celebration on reaching blessings step
  if (currentStep === 4) {
    showerPetals(40);
  }
}

// Keyboard arrow and mobile swipe navigation
function initSwipeAndKeyNav() {
  document.addEventListener("keydown", (e) => {
    const envelopeScreen = document.getElementById("envelope-screen");
    if (!envelopeScreen || !envelopeScreen.classList.contains("opened")) return;

    if (e.key === "ArrowRight") {
      goToStep(currentStep + 1);
    } else if (e.key === "ArrowLeft") {
      goToStep(currentStep - 1);
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const card = document.querySelector(".royal-card");

  if (card) {
    card.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    card.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 55;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff < 0 && currentStep < totalSteps) {
        // Swiped Left -> Next Step
        goToStep(currentStep + 1);
      } else if (diff > 0 && currentStep > 1) {
        // Swiped Right -> Previous Step
        goToStep(currentStep - 1);
      }
    }
  }
}

// ========================================================
// ENVELOPE OPENING INTERACTION
// ========================================================
function initEnvelope() {
  const envelopeScreen = document.getElementById("envelope-screen");
  const sealBtn = document.getElementById("wax-seal-btn");
  const envelopeWrapper = document.getElementById("envelope-wrapper");

  function openCard() {
    if (!envelopeScreen.classList.contains("unveiled") && !envelopeScreen.classList.contains("opened")) {
      envelopeScreen.classList.add("unveiled");
      envelopeScreen.classList.add("opened");
      showerPetals(60);
      playAudioIfAllowed();
    }
  }

  if (sealBtn) sealBtn.addEventListener("click", openCard);
  if (envelopeWrapper) envelopeWrapper.addEventListener("click", openCard);
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

  // Initial ambient floating petals
  for (let i = 0; i < 28; i++) {
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
    size: Math.random() * 9 + 8,
    speedY: Math.random() * 1.5 + 0.8,
    speedX: Math.random() * 1.2 + 0.4,
    angle: Math.random() * Math.PI * 2,
    angularSpeed: Math.random() * 0.02 + 0.01,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.03,
    scale: Math.random() * 0.5 + 0.7,
    opacity: Math.random() * 0.35 + 0.65,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function showerPetals(count = 50) {
  if (!canvas) return;
  for (let i = 0; i < count; i++) {
    const p = createPetal(false);
    p.y = Math.random() * (canvas.height * 0.4);
    p.speedY = Math.random() * 3.5 + 2;
    petals.push(p);
  }

  setTimeout(() => {
    if (petals.length > 35) {
      petals.splice(35, petals.length - 35);
    }
  }, 6000);
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

  musicBtn.addEventListener("click", () => {
    if (isAudioPlaying) {
      audioInstance.pause();
      musicBtn.innerHTML = "🔇";
      isAudioPlaying = false;
    } else {
      audioInstance.play().then(() => {
        musicBtn.innerHTML = "🎵";
        isAudioPlaying = true;
      }).catch(err => {
        console.log("Audio play prevented:", err);
      });
    }
  });
}

function playAudioIfAllowed() {
  const musicBtn = document.getElementById("music-toggle-btn");
  if (audioInstance && !isAudioPlaying) {
    audioInstance.play().then(() => {
      isAudioPlaying = true;
      if (musicBtn) musicBtn.innerHTML = "🎵";
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
    name: "Uncle Ramesh & Family",
    text: "Wishing Sumanth & Amrutha a lifetime of everlasting love, happiness, and prosperity! Heartiest congratulations."
  },
  {
    name: "Friends & Well-wishers",
    text: "Warmest congratulations to the wonderful couple! May your journey ahead be blessed with joy and beautiful moments."
  },
  {
    name: "Family Parivaar",
    text: "May the divine blessings always guide you and fill your home with laughter, peace, and togetherness."
  }
];

function initGuestbook() {
  const form = document.getElementById("blessing-form");
  const list = document.getElementById("wishes-list");

  let savedWishes = [];
  try {
    const stored = localStorage.getItem("wedding_blessings_en");
    savedWishes = stored ? JSON.parse(stored) : DEFAULT_BLESSINGS;
  } catch (e) {
    savedWishes = DEFAULT_BLESSINGS;
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
          localStorage.setItem("wedding_blessings_en", JSON.stringify(savedWishes));
        } catch (e) {}

        renderWishes();
        showerPetals(45);
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
