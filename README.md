# UZZ 🌕 — The Cosmic Digital Sanctuary for Your Love Story

UZZ is a high-end, immersive digital space designed for couples to capture, celebrate, and preserve their journey together. Built with a **Full Moon Cosmic** aesthetic, it transforms your memories into a starlit constellation.

![Full Moon Banner](https://images.unsplash.com/photo-1532693322450-2cb580d10a7a?q=80&w=1200&auto=format&fit=crop)

## 🌌 The Cosmic Experience

UZZ is not just a journal; it's an immersive experience designed to be calm, futuristic, and emotionally captivating.

### ✨ Core Features
- **🌕 Centric Full Moon Hero**: A glowing lunar centerpiece that anchors your digital sanctuary.
- **✨ Parallax StarField**: Multi-layered celestial backgrounds that react to your interactions.
- **🛤️ Constellation Timeline**: A vertical journey where your memories become glowing star nodes connected by cosmic lines.
- **🧪 Premium Glassmorphism**: A dark-first UI with deep space tones, subtle glows, and blurred layers for true depth.
- **📱 PWA Ready**: Install UZZ on your device for a seamless, native-like experience with a custom Full Moon icon.

### 🔭 New Cosmic Additions
- **📅 Celestial Calendar**: Track upcoming astronomical events like Full Moons, Meteor Showers, and Eclipses right from your dashboard.
- **☁️ Nebula Mood Tracker**: An animated nebula that changes color based on your shared emotional frequency, derived from your memories.
- **🗺️ Star Map Gallery**: A dedicated 3D-space visualization where every memory is a star in your private constellation.

## 🛠️ Tech Stack: The Engine of the Cosmos

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 16.1.6](https://nextjs.org/) (App Router) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Vanilla CSS |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) (GPU-accelerated) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| **Real-time** | [Web Push Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) |

## 🚀 Getting Started

1. **Clone the stars**:
   ```bash
   git clone [repository-url]
   cd UZZ
   ```

2. **Fuel the engine**:
   ```bash
   npm install
   ```

3. **Set your coordinates** (`.env.local`):
   Create a `.env.local` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Launch into orbit**:
   ```bash
   npm run dev
   ```

## 📜 Project Structure

```text
├── app/                  # The core cosmic routes
│   ├── memories/         # Constellation timeline
│   ├── dashboard/        # Central hub (Bento Grid)
│   ├── starmap/          # Interactive constellation map [NEW]
│   └── layout.js         # Cosmic wrapper
├── components/           # Stardust UI units
│   ├── StarField.js      # Parallax engine
│   ├── NebulaMood.js     # Animated mood visual [NEW]
│   ├── CelestialCalendar.js # Astronomical tracker [NEW]
│   ├── SOSWidget.js      # Emergency ping system
│   └── Navbar.js         # Floating glass nav
├── public/               # Static assets & App Icon
└── models/               # Data architecture (Mongoose)
```

---

**Made with love, stardust, and code.** 🥂🌕
