import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Enforce the design contract across every theme, including responsive rules.
// Borders, focus strokes, tracking, textures, intrinsic image sizes and fluid
// percentages are optical/technical values, rather than layout-scale values.
const styles = join(import.meta.dirname, "../src/styles");
const failures = [];
const properties =
  /^(?:font-size|line-height|(?:(?:min-|max-)?(?:width|height))|(?:padding|margin)(?:-.+)?|(?:row-|column-)?gap|grid-template-(?:columns|rows)|grid-auto-(?:columns|rows)|flex-basis|scroll-margin(?:-.+)?)$/;
let declarations = 0;
for (const file of readdirSync(styles).filter((name) =>
  name.endsWith(".css"),
)) {
  const css = readFileSync(join(styles, file), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  for (const [, property, value] of css.matchAll(
    /(?<=[;{])\s*([\w-]+)\s*:\s*([^;{}]+);/gm,
  )) {
    const token = /^(?:--space-|--text-|--entry-gap|--entry-band-height)/.test(
      property,
    );
    if (!properties.test(property) && !token) continue;
    declarations++;
    for (const match of value.matchAll(/(-?\d*\.?\d+)px\b/g)) {
      const pixels = Math.abs(Number(match[1]));
      if (property === "--text-welcome" && pixels === 20) continue;
      if (/^(width|height)$/.test(property) && pixels <= 3) continue;
      if (pixels % 8 !== 0)
        failures.push(`${file}: ${property}: ${value.trim()}`);
    }
    if (
      property === "font-size" &&
      !/^var\(--text-(?:\d+|welcome)\)$/.test(value.trim())
    ) {
      failures.push(
        `${file}: typography must use a scale token: ${value.trim()}`,
      );
    }
  }
}
function scanIcons(dir) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    if (name.isDirectory()) scanIcons(path);
    else if (name.name.endsWith(".jsx")) {
      for (const [, size] of readFileSync(path, "utf8").matchAll(
        /size=\{(\d+)\}/g,
      )) {
        if (Number(size) % 8 !== 0) failures.push(`${path}: icon size ${size}`);
      }
    }
  }
}
scanIcons(join(import.meta.dirname, "../src"));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `8-point scale: ${declarations} declarations and JSX icon sizes checked. Welcome instruction: explicit 20px exception.`,
  );
}
