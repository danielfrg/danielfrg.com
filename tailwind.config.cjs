const defaultTheme = require("tailwindcss/defaultTheme");

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}"],
  darkMode: "class", // false or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        mywhite: "rgb(229, 231, 235)",
        myorange: "#fb5607",
        mypink: "#ff006e",
        myblue: "#3a86ff",
        mygreen: "#43a047",
        dark: "#1D1D1D",
        black: "#272727",
        lightgrey: "#ececec",
        yellow: "#ffb200",
        lightblue: "rgb(115, 130, 171)",
        linkline: "rgb(50, 59, 83)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "rgb(191, 198, 217)",
            fontSize: rem(18),
            a: {
              color: "rgb(115, 130, 171)",
              textDecoration: "underline",
              fontWeight: "normal",
              textDecorationColor: "rgb(50, 59, 83)",
              "&:hover": {
                color: "#FFFFFF",
              },
            },
            img: {
              marginLeft: "auto",
              marginRight: "auto",
            },
            pre: {
              fontSize: rem(16),
              borderRadius: "0",
            },
            blockquote: {
              fontStyle: "italic",
              color: "#6b7280",
            },
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
