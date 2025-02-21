const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}"],
  darkMode: "class", // false or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        dark: "#18181B",
        text: "#d4d4d8",
        myblue: "#60a5fa",
        myorange: "#ff4f18",
        lightgrey: "#ececec",
        yellow: "#ffb200",
        lightblue: "rgb(115, 130, 171)",
        linkline: "rgb(50, 59, 83)",
        lapalabragreen: "#44a047",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#d4d4d8",
            fontSize: "1em",
            a: {
              color: "#60a5fa",
              textDecoration: "none",
              fontWeight: "normal",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            "h1, h2, h3, h4, h5, h6": {
              fontWeight: "normal", // or '400' - this removes the bold styling
            },
            // img: {
            //   marginLeft: "auto",
            //   marginRight: "auto",
            // },
            // pre: {
            //   fontSize: rem(16),
            //   borderRadius: "0",
            // },
            // blockquote: {
            //   fontStyle: "italic",
            //   color: "#6b7280",
            // },
          },
        },
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
      borderStyle: ["responsive", "hover"],
      borderWidth: ["responsive", "hover"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
