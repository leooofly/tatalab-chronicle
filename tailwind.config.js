module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        primary: "#2563eb",
        cyanwash: "#ecfeff",
        lilac: "#eef2ff",
        blush: "#fdf2f8",
        mint: "#ecfdf5"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(15, 23, 42, 0.08)",
        float: "0 10px 30px rgba(37, 99, 235, 0.14)"
      },
      animation: {
        blob: "blob 10s infinite",
        fadeUp: "fadeUp 0.8s ease-out forwards"
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(28px, -44px) scale(1.08)' },
          '66%': { transform: 'translate(-18px, 18px) scale(0.94)' },
          '100%': { transform: 'translate(0, 0) scale(1)' }
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
