// Images zoom on click
const zoomDefault = mediumZoom("article img", { background: "#24292e", scrollOffset: 0, margin: 30 });

// Anchors for headers
anchors.options = {
    placement: "right",
    // visible: "always",
    icon: "»"
};
anchors.add("article h2, article h3");

// Add a CSS class to the parents of the terminal ones
var terminals = document.getElementsByClassName("language-terminal")
for(var i = 0; i < terminals.length; i++) {
    terminals[i].parentElement.className = "terminal";
}
