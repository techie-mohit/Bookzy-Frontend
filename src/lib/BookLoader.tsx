"use client";

import { motion } from "framer-motion";

export default function BookLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky-50 to-purple-50 overflow-hidden">
      {/* ✨ Soft Floating Blobs */}
      <motion.div
        className="absolute w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-sky-200/40 to-purple-200/40 blur-3xl"
        animate={{ x: [0, 60, -60, 0], y: [0, -40, 40, 0], rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-pink-200/40 to-indigo-200/40 blur-3xl"
        animate={{ x: [0, -50, 50, 0], y: [0, 40, -40, 0], rotate: [0, -360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* 🌈 Spinning Pastel Ring */}
      <motion.div
        className="relative w-44 h-44 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg, #38bdf8, #c084fc, #fb7185, #38bdf8)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 10px), black 0)",
          mask:
            "radial-gradient(farthest-side, transparent calc(100% - 10px), black 0)"
        }}
      />

      {/* 📚 Center Circle with Full-Fit Book Icon */}
      <motion.div
        className="absolute w-28 h-28 rounded-full bg-white/80 backdrop-blur-md border border-sky-300/50 flex items-center justify-center shadow-[0_0_25px_4px_rgba(168,208,255,0.4)]"
        animate={{ scale: [1, 1.06, 1], rotate: [0, -4, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          preserveAspectRatio="xMidYMid meet"
          className="w-[70%] h-[70%]"
        >
          <defs>
            <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#38bdf8" offset="0%" />
              <stop stopColor="#c084fc" offset="50%" />
              <stop stopColor="#fb7185" offset="100%" />
            </linearGradient>
          </defs>
          <path
            fill="url(#bookGradient)"
            d="M4 4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16a1 1 0 0 1-1.447.894L12 18.118l-3.553 2.776A1 1 0 0 1 7 20V4H6a2 2 0 0 1-2-2Z"
          />
        </svg>
      </motion.div>

      {/* 📝 Loading Text */}
      <motion.p
        className="mt-12 text-2xl font-extrabold bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading Books...
      </motion.p>
      <motion.p
        className="mt-2 text-sm font-medium text-gray-600"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Your next favorite read is on its way!
      </motion.p>
    </div>
  );
}
