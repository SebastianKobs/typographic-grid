# Typographic grid

A web page where every part sits on one grid: text, headings, pictures, rules, boxes, notes, quotes, lists, tables, links, code, icons, drop caps, badges and form elements. No distance comes from the eye; each one is computed from the size and the line height of the text.

**Demo:** https://sebastiankobs.github.io/typographic-grid/ (reference: https://sebastiankobs.github.io/typographic-grid/reference.html)

## The grid

- **Unit:** the size of the text (16px).
- **Columns:** Karl Gerstner's 12-column grid. A column is 3 units, a gutter 2 units; the text width is 7 columns, the 5 columns on the right hold pictures, notes and quotes.
- **Line:** the distance from one baseline to the next (1.5 units, 24px). Every baseline of the text is on a grid line; headings, pull quotes and fields step in half baselines.
- **Cap line:** the top of the capital letters. Every text block is trimmed with `text-box: trim-both cap alphabetic`, so a block runs from its first cap line to its last baseline, and the margin between two blocks is the space the eye sees.
- **Margins:** one empty line between paragraphs (2 lines − the cap height). A heading has a larger margin above than below, near 5 : 3 half baselines (two Fibonacci numbers); a rule the other way round.
- **Pictures:** a number of columns wide; the top edge on a cap line, the depth whole lines, cropped to the nearest ratio.
- **Boxes:** padding of one column on the right and one unit less on the left; the background starts and stops on grid lines, adding half a baseline when the content ends between two.

The "Grid" checkbox at the bottom right shows the columns and the grid lines over the page; the "Fluid" and "Steps" checkboxes above it (from a 1176px and a 1240px window) let the text grow with the window, to compare the two ways. They come from `tools.css` and `tools.js`, which a page in production leaves out.

Change `--font-size` or `--line-height` in `:root` and every distance follows. The page is tuned for 16px / 1.5; at other settings Chromium can drift by a fraction of a pixel.

## Narrow screens

The grid steps down by whole columns; columns and gutters keep their widths, the page margins take what is left.

| Viewport | Columns | Type area |
|---|---|---|
| 992px or more | 12 | 928px |
| 592–991px | 7 | 528px |
| 432–591px | 5 | 368px |
| below 432px (down to 320px) | 4 | 288px |

- From 7 columns down, side figures and margin notes follow their paragraph; a note anchored to a word goes inline, in italic and in parentheses.
- A pull quote moves into the page margin only as far as its columns and a gutter fit there.
- From 5 columns down, a picture inside a paragraph is at most 2 columns wide, tables size their columns by content with a unit between them, fields and buttons side by side wrap, and a box with no field or button is padded by two units at the sides, the marks of a list in a box hang in its padding, and a box with `outline-narrow` is a dashed outline instead of a field.

The breakpoints are for 16px text: a media query can't read `--font-size`.

## Text size on wide screens

The text is 16px by default. On wide screens it can grow, and every distance grows with it, as a page printed larger: the line length in characters stays the same. Two ways, each switched on by a class on `html`:

- **Steps,** `class="text-steps"`: 20px from a 1240px window, 24px from 1488px, the sizes whose line and half baseline are whole pixels.
- **Fluid,** `class="text-fluid"`: the unit is a 72nd of the window, so the type area (58 units) keeps a column and two gutters of page margin on each side; from 16px at a 1152px window to 24px at 1728px, in steps of a third of a pixel. Those steps keep the line and the half baseline on whole quarter pixels, which Chromium (1/64px) and Firefox (1/60px) both lay out exactly; in between, the rounding of each line adds up down a long page.

| Viewport | Steps | Fluid |
|---|---|---|
| below 1176px | 16px | 16px |
| 1176–1239px | 16px | 16⅓–17px |
| 1240–1487px | 20px | 17–20⅓px |
| 1488–1727px | 24px | 20⅔–23⅔px |
| 1728px or more | 24px | 24px |

Fluid wins where a page has both classes. The reader switches each with its checkbox, "Steps" or "Fluid", one at a time (ticking one unticks the other); where a page has the checkbox, it decides (give it `checked` to start on). Their inputs have `autocomplete="off"`, as Firefox would otherwise restore them on a reload.

Pulled quotes and stacks take their room in the page margin from the window, so they fit at every size.

## Files

| File | Content |
|---|---|
| `index.html` | The showcase: an article about Swiss typography (Müller-Brockmann, Gerstner, Ruder) laid out on the grid, with its posters, a table and a form. |
| `reference.html` | The reference page. Its text explains each element, in ASD-STE100 Simplified Technical English. |
| `typographic-grid/theme.css` | The colours, as tokens on `:root`. Swap it for another theme. |
| `typographic-grid/grid.css` | The grid and its elements: the base on `:root`, then each element, then utility classes. |
| `typographic-grid/fx.css` | Effects laid on the grid, such as the hatch. |
| `typographic-grid/grid.js` | What CSS cannot know: how many lines a heading wraps to, where a float's line box starts, the width of a drop cap's letter, the half baseline a box may need at its bottom, and where a hatch starts. |
| `typographic-grid/tools.css` | Tools for looking at the grid: the grid shown over the page and over each composition, and the floating checkboxes (Grid, Fluid, Steps). Not needed in production: leave it out, with the checkboxes' `label` elements. |
| `typographic-grid/tools.js` | Keeps the Fluid and Steps checkboxes one at a time. Not needed in production. |
| `.github/workflows/pages.yml` | Deploys the page to GitHub Pages on each push to `main`, with the commit in the URLs of the stylesheets and the script, so a browser loads a new version at once. |

## Classes

Classes are named for their effect, for example:

- Layout: `col-start-n`, `col-span-n`, `aspect-w-h`, `pull-left-n`, `pull-right-n`, `figure-hanging`, `figure-stack`, `hang-up`, `side-by-side-on-7`, `hide-unpulled`, `hang-always`, `hide-below-12`, `hide-below-7`, `col-span-n-on-7`, `keep-start`, `narrow-col-1`, `narrow-col-rest`, `size-down-on-4`, `size-phi-1-on-5`, `text-steps`, `text-fluid` (on `html`), `shift-left-n`, `shift-right-n` (n = 1–3 units, also `-on-12`, `-on-7`, `-on-5`, `-on-4`); in a style: `--depth` (a colour area's depth in lines), `--lines-above` (a heading, paragraph or hanging figure set lower by whole lines)
- Headings: `size-phi-n` (golden-section sizes, up to `size-phi-6`), `ratio-a-b` (margins below : above, in half baselines), `rule-left`
- Text: `size-small` and `small` (a step down the √2 scale, `--small-size` from `--small-ratio`, on the body's lines)
- Colour: `fill-red`, `fill-ink`, `fill-tint`, `fill-gutter`, `fill-hatch`, `fill-hatch-red`, `fill-hatch-tint`, `hatch-falling`, `text-up`, `text-down`, `composition` (`composition-word`, `composition-bar`, `composition-rule`, `composition-text`, `composition-steep`, `turn-1-2`, `turn-rise-1-2`, `polar` (`composition-arc`, `on-ray`; `--cx`, `--cy`, `--polar-turn`; on an arc `--r`, `--h`, `--a`, `--span`, and `--cut-below` to end it straight on a grid line), `hang-round`; in a style: `--x`, `--y`, `--w`, `--h`, and `--shift-x`, `--shift-w` for a visual shift off the grid), `overprint`, `see-through` (`--see-through`), `text-light`, `text-ink`, `text-right`, `weight-semibold`, `text-red`, `text-grey`, `text-mid`, `outline-ink`, `outline-red`, `outline-tint`
- Elements: `paragraph`, `heading`, `quote`, `figure`, `float-left`, `box` (`outline-narrow`), `note`, `rule`, `list`, `table` (`row-gap-1`, `row-gap-2`), `code`, `icon` (`icon-arrow-right`, `icon-arrow-down`, `icon-plus`, `icon-after`), `dropcap`, `badge`, `menu`, `field`, `fields`, `choice`, `choices`, `button`, `buttons`

## Browsers

Tested in Chromium 153 and Firefox 155. It needs `text-box`, `font-size-adjust: cap-height`, `round()`, `mod()`, `:has()`, registered custom properties (`@property`), container style queries (`@container style()`, for what is pulled into the page margin) and anchor positioning (for the menu on fewer columns). Safari on the iPhone is checked by eye; Safari on the desktop and the iPad is untested.

## License

GPL-3.0, see `LICENSE`.
