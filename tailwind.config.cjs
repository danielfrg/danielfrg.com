const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class", // false or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        mywhite: "#CECDC3",
        myorange: "#ff4f18",
        dark: "#1D1D1D",
        black: "#141517",
        lightgrey: "#ececec",
        yellow: "#ffb200",
        lightblue: "rgb(115, 130, 171)",
        linkline: "rgb(50, 59, 83)",
        lapalabragreen: "#44a047",
      },
      typography: {
        DEFAULT: {
          css: {
            // color: "rgb(191, 198, 217)",
            // fontSize: rem(18),
            // a: {
            //   color: "rgb(115, 130, 171)",
            //   textDecoration: "underline",
            //   fontWeight: "normal",
            //   textDecorationColor: "rgb(50, 59, 83)",
            //   "&:hover": {
            //     color: "#FFFFFF",
            //   },
            // },
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
