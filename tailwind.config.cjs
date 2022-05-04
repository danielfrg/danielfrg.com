module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}"],
    darkMode: "class", // false or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                dark: "#1D1D1D",
                black: "#303336",
                link: "#0078e9",
                lightgray: "#f5f5f7",
            },
            typography: {
                DEFAULT: {
                    css: {
                        // p: {
                        //     padding: "10px 1px",
                        //     margin: "1px",
                        // },
                        a: {
                            color: "#0078e9",
                            textDecoration: "none",
                            "&:hover": {
                                textDecoration: "underline",
                                textDecorationColor: "#0078e9",
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
                        "code::before": false,
                        "code::after": false,
                        "blockquote p:first-of-type::before": false,
                        "blockquote p:last-of-type::after": false,
                        blockquote: {
                            color: "rgba(35, 28, 51, 0.66)",
                            fontWeight: 300,
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
