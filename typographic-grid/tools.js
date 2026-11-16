// Tools for looking at the grid, not for a page in production (with tools.css): leave it out, and a page loses only them.

// the reader's text-size checkboxes exclude each other: ticking Steps unticks Fluid and the other way round
// (CSS reads a checkbox's state, but can't change it)
function excludeEachOther(toggles) {
  for (const toggle of toggles) {
    toggle.addEventListener("change", () => {
      if (!toggle.checked) return;
      for (const other of toggles) if (other !== toggle) other.checked = false;
    });
  }
}
excludeEachOther([...document.querySelectorAll(".steps-toggle input, .fluid-toggle input")]);
