import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
    palette: {
        background: {
            default: "#fff",
        },
        text: {
            primary: "rgb(27, 31, 35)",
        },
        primary: {
            main: "rgb(3, 102, 214)",
        },
    },
});

export default theme;
