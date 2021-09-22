// const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
    mode: "jit",
    important: true,
    purge: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class", // false or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                dark: "#222",
                link: "#0366d6",
                "link-dark": "#0089c7",
            },
            typography: {
                DEFAULT: {
                    css: {
                        "code::before": false,
                        "code::after": false,
                        "blockquote p:first-of-type::before": false,
                        "blockquote p:last-of-type::after": false,
                        blockquote: {
                            color: "rgba(35, 28, 51, 0.66)",
                            fontWeight: 300,
                        },
                        p: {
                            padding: "10px 1px",
                            margin: "1px",
                        },
                        a: {
                            color: "#0366d6",
                            textDecoration: "none",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                        },
                        img: {
                            marginLeft: "auto",
                            marginRight: "auto",
                        },
                        table: {
                            maxWidth: "100%",
                            display: "inline-block",
                            overflow: "auto",
                        },
                        pre: {
                            padding: 0,
                            color: "unset",
                            backgroundColor: "unset",
                        },
                    },
                },
            },
        },
    },
    variants: {
        extend: {
            borderStyle: ["responsive", "hover"],
            borderWidth: ["responsive", "hover"],
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
