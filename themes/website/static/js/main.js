// Add a `terminal` class to the parents of the `language-terminal` elements
var terminals = document.getElementsByClassName("language-terminal")
for(var i = 0; i < terminals.length; i++) {
    terminals[i].parentElement.className = "terminal";
}

// Images zoom on click
const zoomDefault = mediumZoom("article img", { background: "#24292e", scrollOffset: 0, margin: 30 });

// Anchors for headers
anchors.options = {
    placement: "right",
    // visible: "always",
    icon: "»"
};
anchors.add("article h2, article h3");
