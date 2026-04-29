# Realtime Collaborative Whiteboard

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)

**Real-time collaborative whiteboard with multi-user support**

[Report Bug](https://github.com/Ashish1896/Realtime-Collaborative-Whiteboard/issues) | [Request Feature](https://github.com/Ashish1896/Realtime-Collaborative-Whiteboard/issues)

</div>

---

## About The Project

A real-time collaborative whiteboard application built with **Next.js** and **Socket.io** that enables multiple users to draw, collaborate, and brainstorm together in real-time. Forked from [IEE-PatchFest/Realtime-Collaborative-Whiteboard](https://github.com/IEE-PatchFest/Realtime-Collaborative-Whiteboard) with additional features.

### My Contributions (Beyond Upstream)

- **Mouse Wheel Zoom** - Pinch-to-zoom style zooming with mouse wheel
- **Pan Support** - Click and drag to pan around the canvas
- **useRoom Hook** - Custom React hook for managing room state and socket connections
- **ViewportManager** - Advanced canvas viewport management for smooth panning/zooming
- **Enhanced Canvas Tools** - Improved drawing experience with better tool handling

### Key Features

- **Real-time Collaboration** - Multiple users can draw simultaneously using Socket.io
- **Room-based System** - Create and join rooms for private collaboration sessions
- **Drawing Tools** - Pen, shapes, text, and eraser tools
- **Zoom & Pan** - Smooth canvas navigation with mouse wheel zoom and drag-to-pan
- **Responsive Design** - Works on desktop and tablet with TailwindCSS
- **Room Hook** - Custom `useRoom` hook for clean state management

### Built With

- [Next.js 16](https://nextjs.org)
- [React 19](https://react.dev)
- [Socket.io](https://socket.io)
- [TailwindCSS 4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ashish1896/Realtime-Collaborative-Whiteboard.git
cd Realtime-Collaborative-Whiteboard
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm run start
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
Realtime-Collaborative-Whiteboard/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── hooks/            # Custom React hooks (useRoom)
├── public/           # Static assets
├── utils/            # Utility functions (ViewportManager)
└── package.json
```

---

## Roadmap

- [ ] Add color picker with custom colors
- [ ] Implement undo/redo functionality
- [ ] Add image upload to canvas
- [ ] Support for freehand drawing with pressure sensitivity
- [ ] Add chat feature within rooms
- [ ] Export canvas as image/PDF
- [ ] Add user cursors (see others drawing in real-time)
- [ ] Implement room password protection
- [ ] Add shape library (arrows, rectangles, circles)
- [ ] Mobile touch support for drawing

See the [open issues](https://github.com/Ashish1896/Realtime-Collaborative-Whiteboard/issues) for a full list of proposed features.

---

## Contributing

Contributions are what make the open source community amazing! Any contributions are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See `CONTRIBUTION_ROADMAP.md` for detailed contribution guidelines.

---

## License

Distributed under the MIT License.

---

## Acknowledgments

- Original project by [IEE-PatchFest](https://github.com/IEE-PatchFest/Realtime-Collaborative-Whiteboard)
- Built as part of IEEE PatchFest hackathon

---

## Contact

**Ashish Kumar Sahoo** - [@Ashish1896](https://github.com/Ashish1896)

Project Link: [https://github.com/Ashish1896/Realtime-Collaborative-Whiteboard](https://github.com/Ashish1896/Realtime-Collaborative-Whiteboard)

---

<div align="center">

If you like this project, please ⭐ star this repository!

**Built with ❤️ in Bhubaneswar, India**

</div>
