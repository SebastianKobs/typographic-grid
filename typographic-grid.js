// What CSS can't know or hand over, taken from the layout: how many lines each heading wraps to,
// and for figures beside a text block, its heading's margin above, cap height and baseline position.

function countLines(heading) {
  const range = document.createRange();
  range.selectNodeContents(heading);
  const lineTops = new Set([...range.getClientRects()].filter((rect) => rect.height > 0).map((rect) => Math.round(rect.top)));
  heading.style.setProperty("--lines", lineTops.size);
}

// the side figures next to an element in the source, before and after it
function figuresBeside(element) {
  const figures = [];
  for (let previous = element.previousElementSibling; previous?.matches(".figure-side"); previous = previous.previousElementSibling) figures.push(previous);
  for (let next = element.nextElementSibling; next?.matches(".figure-side"); next = next.nextElementSibling) figures.push(next);
  return figures;
}

// Figures beside a text block copy its heading's margin above, cap height and baseline position,
// so their top edge is the heading's capitals and their height counts from its first baseline.
function alignFiguresToHeadings() {
  for (const block of document.querySelectorAll(".text-block")) {
    const heading = block.firstElementChild;
    if (!heading.matches(".heading")) continue;
    const style = getComputedStyle(heading);
    const capHeight = parseFloat(style.getPropertyValue("--cap-height"));
    // where its first baseline falls between two full lines, as laid out: 0 or a half baseline
    // (measured: Firefox computes the same value as a registered property as 0)
    const half = parseFloat(getComputedStyle(block).lineHeight) / 2;
    const firstBaseline = heading.getBoundingClientRect().top + capHeight - block.parentElement.getBoundingClientRect().top;
    const shift = (Math.round(firstBaseline / half) % 2) * half;
    for (const figure of figuresBeside(block)) {
      figure.style.setProperty("--beside-margin", style.marginTop);
      figure.style.setProperty("--beside-cap", `${capHeight}px`);
      figure.style.setProperty("--beside-shift", `${shift}px`);
    }
  }
}

// drop each float (a picture or a drop cap) from its line box's top to the capitals of the paragraph's first line
function dropFloatsToCapitals() {
  for (const float of document.querySelectorAll(".float-left, .dropcap")) {
    const lineBoxTop = float.getBoundingClientRect().top - parseFloat(getComputedStyle(float).top);
    const capitals = float.parentElement.getBoundingClientRect().top;
    float.style.setProperty("--float-drop", `${capitals - lineBoxTop}px`);
  }
}
dropFloatsToCapitals();

// a box whose field would end on a half baseline: the field takes the half baseline, so the page keeps its full lines;
// in page order, each box measured after the ones above it have taken theirs
function roundBoxesToFullLines() {
  for (const box of document.querySelectorAll(".box")) {
    const half = parseFloat(getComputedStyle(box).lineHeight) / 2;
    const areaTop = box.closest(".type-area").getBoundingClientRect().top;
    const tail = parseFloat(box.style.getPropertyValue("--box-tail")) || 0;
    // the field's bottom without the half baseline it may already take, from the first full line of the page
    const bottom = box.getBoundingClientRect().bottom - parseFloat(getComputedStyle(box, "::before").bottom) - tail - areaTop;
    box.style.setProperty("--box-tail", `${(Math.round(bottom / half) % 2) * half}px`);
  }
}
roundBoxesToFullLines();

// a drop cap's letter is as wide as the font makes it: the text beside it moves to the next half unit (an en space),
// at least half a unit after the letter
function alignDropcapsToUnits() {
  for (const dropcap of document.querySelectorAll(".dropcap")) {
    const enSpace = parseFloat(getComputedStyle(dropcap.parentElement).fontSize) / 2;
    const width = dropcap.getBoundingClientRect().width;
    const textStart = Math.ceil((width + enSpace) / enSpace) * enSpace;
    dropcap.style.setProperty("--dropcap-gap", `${textStart - width}px`);
  }
}
alignDropcapsToUnits();

// a hatch is laid from the type area's top-left corner: each hatched field gets its offset from there,
// a box's field being its ::before, a figure's its image at the figure's corner
function alignHatchesToGrid() {
  for (const hatched of document.querySelectorAll(".fill-hatch, .fill-hatch-red, .fill-hatch-tint")) {
    const area = hatched.closest(".type-area").getBoundingClientRect();
    const rect = hatched.getBoundingClientRect();
    const fieldTop = hatched.matches(".box") ? rect.top + parseFloat(getComputedStyle(hatched, "::before").top) : rect.top;
    hatched.style.setProperty("--hatch-x", `${area.left - rect.left}px`);
    hatched.style.setProperty("--hatch-y", `${area.top - fieldTop}px`);
  }
}
alignHatchesToGrid();

// text turned a quarter (fx.css): its box the body's cap height and whole lines long, as a picture is deep
function roundTurnedTextToLines() {
  for (const turned of document.querySelectorAll(".text-up, .text-down")) {
    const area = getComputedStyle(turned.closest(".type-area"));
    const line = parseFloat(area.lineHeight);
    const cap = parseFloat(area.getPropertyValue("--body-cap"));
    turned.style.removeProperty("--turned-length");
    const length = turned.getBoundingClientRect().height;
    turned.style.setProperty("--turned-length", `${cap + Math.ceil((length - cap) / line) * line}px`);
  }
}
roundTurnedTextToLines();

// a heading resizes when the font loads or it rewraps, the type area when the grid steps to fewer columns:
// count again, then realign the figures
const headingLines = new ResizeObserver((entries) => {
  for (const entry of entries) if (entry.target.matches(".heading, .quote")) countLines(entry.target);
  alignFiguresToHeadings();
  dropFloatsToCapitals();
  roundBoxesToFullLines();
  alignDropcapsToUnits();
  roundTurnedTextToLines();
  alignHatchesToGrid();
});
for (const heading of document.querySelectorAll(".heading, .quote")) headingLines.observe(heading);
headingLines.observe(document.querySelector(".type-area"));
