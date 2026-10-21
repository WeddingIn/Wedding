/**
 * Indian Traditional Wedding Invitation - Interactive Core Engine
 */

// Central Configuration Object - Easily updated with client details
const WEDDING_CONFIG = {
  groom: {
    name: "Sumanth S M",
    title: "Groom (ವರ)",
    parents: "Together with Family & Relatives",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
  },
  bride: {
    name: "Amrutha S",
    title: "Bride (ವಧು)",
    parents: "Together with Family & Relatives",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  },
  weddingDate: "2026-11-22T09:30:00+05:30", // Auspicious Muhurtham: 22 Nov 2026 9:30 AM
  auspiciousMuhurthamText: "Sunday, 22nd November 2026 | 9:30 AM – 10:15 AM",
  venue: {
    name: "Sri Taralabalu Samudaya Bhavana",
    kannadaName: "ಶ್ರೀ ತರಳಬಾಳು ಸಮುದಾಯ ಭವನ",
    address: "Hospet Rd, Harapanahalli - T, Vijayanagar - D - 583131",
    googleMapsUrl: "https://maps.google.com/?q=Taralabalu+Conventional+Hall+Harapanahalli"
  },
  events: [
    {
      title: "Engagement & Arathakshathe",
      kannadaTitle: "ನಿಶ್ಚಿತಾರ್ಥ ಮತ್ತು ಆರತಕ್ಷತೆ",
      icon: "💍",
      date: "Saturday, 21st November 2026",
      time: "07:30 PM Onwards",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli",
      dressCode: "Traditional Festive Attire",
      description: "An auspicious evening of joyous celebrations, welcoming the newly united families with Arathakshathe rituals."
    },
    {
      title: "Lagna Muhurtham",
      kannadaTitle: "ಮಾಂಗಲ್ಯ ಧಾರಣೆ ಮತ್ತು ಸಪ್ತಪದಿ",
      icon: "🔥",
      date: "Sunday, 22nd November 2026",
      time: "09:30 AM to 10:15 AM",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli",
      dressCode: "Traditional Silk Attire / Dhotis & Sarees",
      description: "The divine Mangalya Dharana solemnizing the eternal sacred union of Sumanth & Amrutha."
    },
    {
      title: "Reception & Wedding Feast",
      kannadaTitle: "ಆರತಕ್ಷತೆ ಮತ್ತು ಮದುವೆ ಭೋಜನ",
      icon: "🍽️",
      date: "Sunday, 22nd November 2026",
      time: "12:00 PM Onwards",
      venue: "Sri Taralabalu Samudaya Bhavana, Harapanahalli",
      dressCode: "Festive Glam / Ethnic Wear",
      description: "Celebrate with the newlyweds followed by grand celebratory wedding feast (ಮದುವೆ ಊಟ)."
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
});

// ========================================================
// ENVELOPE OPENING INTERACTION
// ========================================================
function initEnvelope() {
  const envelopeScreen = document.getElementById("envelope-screen");
  const sealBtn = document.getElementById("wax-seal-btn");
  const envelopeWrapper = document.getElementById("envelope-wrapper");

  function openCard() {
    if (!envelopeScreen.classList.contains("opened")) {
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
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
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

  // Initial ambient petals
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

      // Draw petal
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);

      ctx.beginPath();
      // Draw organic petal shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size);
      ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.restore();

      // Reset when falling beyond canvas
      if (p.y > canvas.height + 20) {
        petals[i] = createPetal(false);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}

function createPetal(randomY = false) {
  // Traditional rose and marigold colors
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
    speedY: Math.random() * 1.6 + 0.8,
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

// User trigger for blessing shower
function showerPetals(count = 50) {
  if (!canvas) return;
  for (let i = 0; i < count; i++) {
    const p = createPetal(false);
    p.y = Math.random() * (canvas.height * 0.4); // burst near upper half
    p.speedY = Math.random() * 3.5 + 2;
    petals.push(p);
  }

  // Remove excess petals after 6 seconds to keep performance silky smooth
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
        console.log("Audio autoplay prevented:", err);
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
      // Browsers often require explicit user interaction on media element
    });
  }
}

// ========================================================
// BLESSINGS & GUESTBOOK
// ========================================================
const DEFAULT_BLESSINGS = [
  {
    name: "Uncle Ramesh & Family",
    text: "Hearty congratulations to Sumanth & Amrutha! Wishing you both a lifetime of happiness, peace, and eternal love."
  },
  {
    name: "Friends & Well-wishers",
    text: "So happy for Sumanth and Amrutha! May this sacred union bring endless joy and prosperity."
  },
  {
    name: "Relatives Parivaar",
    text: "ಶ್ರೀ ತರಳಬಾಳು ಜಗದ್ಗುರುಗಳ ಆಶೀರ್ವಾದದೊಂದಿಗೆ ಸುಮಂತ್ ಮತ್ತು ಅಮೃತ ಅವರಿಗೆ ಸುಖ-ಶಾಂತಿ, ನೆಮ್ಮದಿ ಸದಾ ಇರಲಿ ಎಂದು ಹಾರೈಸುತ್ತೇವೆ."
  }
];

function initGuestbook() {
  const form = document.getElementById("blessing-form");
  const list = document.getElementById("wishes-list");

  let savedWishes = [];
  try {
    const stored = localStorage.getItem("wedding_blessings");
    savedWishes = stored ? JSON.parse(stored) : DEFAULT_BLESSINGS;
  } catch (e) {
    savedWishes = DEFAULT_BLESSINGS;
  }

  function renderWishes() {
    if (!list) return;
    list.innerHTML = savedWishes.map(item => `
      <div class="wish-item">
        <div class="wish-author">${escapeHtml(item.name)}</div>
        <div class="wish-text">${escapeHtml(item.text)}</div>
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
          localStorage.setItem("wedding_blessings", JSON.stringify(savedWishes));
        } catch (e) {}

        renderWishes();
        showerPetals(40);
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
