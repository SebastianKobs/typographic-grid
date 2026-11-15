// What CSS can't know or hand over, taken from the layout: how many lines each heading wraps to,
// and for figures beside a text block, its heading's white above, cap height and baseline position.

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

// Figures beside a text block copy its heading's white above, cap height and baseline position,
// so their top edge is the heading's capitals and their height counts from its first baseline.
function alignFiguresToHeadings() {
  for (const block of document.querySelectorAll(".text-block")) {
    const heading = block.firstElementChild;
    if (!heading.matches(".heading")) continue;
    const style = getComputedStyle(heading);
    const capHeight = parseFloat(style.getPropertyValue("--cap-height"));
    // where its first baseline falls between two full lines, as laid out: 0 or a half line
    // (measured: Firefox computes the same value as a registered property as 0)
    const half = parseFloat(getComputedStyle(block).lineHeight) / 2;
    const firstBaseline = heading.getBoundingClientRect().top + capHeight - block.parentElement.getBoundingClientRect().top;
    const shift = (Math.round(firstBaseline / half) % 2) * half;
    for (const figure of figuresBeside(block)) {
      figure.style.setProperty("--beside-white", style.marginTop);
      figure.style.setProperty("--beside-cap", `${capHeight}px`);
      figure.style.setProperty("--beside-shift", `${shift}px`);
    }
  }
}

// drop each float from its line box's top to the capitals of the paragraph's first line
function dropFloatsToCapitals() {
  for (const float of document.querySelectorAll(".float-left")) {
    const lineBoxTop = float.getBoundingClientRect().top - parseFloat(getComputedStyle(float).top);
    const capitals = float.parentElement.getBoundingClientRect().top;
    float.style.setProperty("--float-drop", `${capitals - lineBoxTop}px`);
  }
}
dropFloatsToCapitals();

// a box whose field would end on a half line: the field takes the half line, so the page keeps its full lines;
// in page order, each box measured after the ones above it have taken theirs
function roundBoxesToFullLines() {
  for (const box of document.querySelectorAll(".box")) {
    const half = parseFloat(getComputedStyle(box).lineHeight) / 2;
    const areaTop = box.closest(".type-area").getBoundingClientRect().top;
    const tail = parseFloat(box.style.getPropertyValue("--box-tail")) || 0;
    // the field's bottom without the half line it may already take, from the first full line of the page
    const bottom = box.getBoundingClientRect().bottom - parseFloat(getComputedStyle(box, "::before").bottom) - tail - areaTop;
    box.style.setProperty("--box-tail", `${(Math.round(bottom / half) % 2) * half}px`);
  }
}
roundBoxesToFullLines();

// a heading resizes when the font loads or it rewraps: count again, then realign the figures
const headingLines = new ResizeObserver((entries) => {
  for (const entry of entries) countLines(entry.target);
  alignFiguresToHeadings();
  dropFloatsToCapitals();
  roundBoxesToFullLines();
});
for (const heading of document.querySelectorAll(".heading, .quote")) headingLines.observe(heading);
