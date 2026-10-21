# 🪔 Royal Indian Traditional Wedding Invitation

An interactive, responsive Indian traditional wedding invitation card web page with animations, sound effects, royal envelope reveal, and live countdown.

---

## ✨ Features

- 💌 **Interactive Royal Envelope Opening**: Guests tap the Shubh Vivah wax seal to open the card with petal bursts.
- 🌸 **Live Rose & Marigold Petal Shower**: Canvas-powered physics simulation with interactive *"Shower Blessings"* button.
- 🎵 **Traditional Background Music / Shehnai**: Floating audio player with play/pause toggle.
- ⏳ **Auspicious Muhurtham Countdown**: Real-time days, hours, minutes, and seconds counter.
- 🗓️ **Events Timeline**: Interactive cards for Haldi, Mehendi, Sangeet, Muhurtham & Reception with **1-click Add to Google Calendar**.
- 📍 **Interactive Venue & Directions**: Direct link to open Google Maps navigation.
- ✍️ **Guest Blessings & Ashirwad Wall**: Real-time guestbook form allowing friends and family to leave personal wishes.
- 📱 **Mobile Optimized**: Designed specifically for wedding guests viewing on mobile devices and WhatsApp sharing.

---

## 🚀 How to Run Locally

Simply open `index.html` in any web browser:

```bash
# macOS
open index.html

# or serve with Python
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🎨 Easy Customization

All wedding details can be configured directly in [`js/script.js`](js/script.js) inside the `WEDDING_CONFIG` object:

```javascript
const WEDDING_CONFIG = {
  groom: {
    name: "Arjun",
    parents: "S/o Smt. Sunita & Shri Rajesh Sharma",
    ...
  },
  bride: {
    name: "Pooja",
    parents: "D/o Smt. Rekha & Shri Mahendra Verma",
    ...
  },
  weddingDate: "2026-12-10T10:30:00+05:30",
  venue: { ... },
  events: [ ... ]
};
```
