# Typographic grid

A web page where every part sits on one grid: text, headings, pictures, rules, boxes, notes, quotes, lists, tables, links, code, icons, drop caps, badges and form elements. No distance comes from the eye; each one is computed from the size and the line height of the text.

**Demo:** https://sebastiankobs.github.io/typographic-grid/

## The grid

- **Unit:** the size of the text (16px).
- **Columns:** Karl Gerstner's 12-column grid. A column is 3 units, a gutter 2 units; the text width is 7 columns, the 5 columns on the right hold pictures, notes and quotes.
- **Line:** the distance from one baseline to the next (1.5 units, 24px). Every baseline of the text is on a grid line; headings, pull quotes and fields step in half baselines.
- **Cap line:** the top of the capital letters. Every text block is trimmed with `text-box: trim-both cap alphabetic`, so a block runs from its first cap line to its last baseline, and the margin between two blocks is the space the eye sees.
- **Margins:** one empty line between paragraphs (2 lines − the cap height). A heading has a larger margin above than below, near 5 : 3 half baselines (two Fibonacci numbers); a rule the other way round.
- **Pictures:** a number of columns wide; the top edge on a cap line, the depth whole lines, cropped to the nearest ratio.
- **Boxes:** padding of one column on the right and one unit less on the left; the background starts and stops on grid lines, adding half a baseline when the content ends between two.

Change `--font-size` or `--line-height` in `:root` and every distance follows. The page is tuned for 16px / 1.5; at other settings Chromium can drift by a fraction of a pixel.

## Files

| File | Content |
|---|---|
| `index.html` | The demo page. Its text explains each element, in ASD-STE100 Simplified Technical English. |
| `typographic-grid.css` | All styles: the base on `:root`, then each element, then utility classes. |
| `typographic-grid.js` | What CSS cannot know: how many lines a heading wraps to, where a float's line box starts, the width of a drop cap's letter, and the half baseline a box may need at its bottom. |
| `tuneable.html` | A lab version with sliders (size, line height, weights, type scale) and a grid overlay. It has its own inline CSS and is not kept in step with the main stylesheet. |

## Classes

Classes are named for their effect, for example:

- Layout: `col-start-n`, `col-span-n`, `aspect-w-h`, `pull-left-n`, `pull-right-n`
- Headings: `size-phi-n` (golden-section sizes), `ratio-a-b` (margins below : above, in half baselines), `rule-left`
- Colour: `fill-red`, `fill-ink`, `fill-tint`, `text-light`, `text-ink`
- Elements: `paragraph`, `heading`, `quote`, `figure`, `float-left`, `box`, `note`, `rule`, `list`, `table` (`row-gap-1`, `row-gap-2`), `code`, `icon` (`icon-arrow-right`, `icon-arrow-down`, `icon-plus`), `dropcap`, `badge`, `field`, `fields`, `choice`, `choices`, `button`, `buttons`

## Browsers

Tested in Chromium 153 and Firefox 155. It needs `text-box`, `font-size-adjust: cap-height`, `round()`, `mod()`, `:has()` and registered custom properties (`@property`). Safari is untested.

## License

GPL-3.0, see `LICENSE`.
