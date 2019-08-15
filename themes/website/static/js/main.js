// Terminal CSS
// Iterate all the items with class: `language-terminal`
var terminals = document.getElementsByClassName("language-terminal")
for(var i = 0; i < terminals.length; i++) {
    // Add a `terminal` class to the parents of the `language-terminal` elements
    // So we can add the `::before`
    var terminal_item = terminals[i];
    terminal_item.parentElement.className = "terminal";

    // Modify the text to surrond the `$` with a span, so we can make it non-selectable
    // We need this hack until this is added/fixed: https://github.com/alecthomas/chroma/issues/137
    var find = "^\\$ ";
    var re = new RegExp(find, "gm");
    var str = terminal_item.innerHTML;
    str = str.replace(re, "<span class=\"dollar-sign\">$</span>");
    terminal_item.innerHTML = str;
}

// Images zoom on click
const zoomDefault = mediumZoom("article img", { background: "#1a1a1a", scrollOffset: 0, margin: 30 });

// Anchors for headers
anchors.options = {
    placement: "right",
    // visible: "always",
    icon: "»"
};
anchors.add("h2:not(.no-anchor), article h3");
