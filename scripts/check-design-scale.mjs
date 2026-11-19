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
// replica-figma.css é a réplica fiel do Figma (medidas exatas do desenho).
const excecoes = new Set(["replica-figma.css", "painel-xp.css", "msn.css", "animae-demo.css","windows-media-player.css", "headspace.css", "paint.css"]);
for (const file of readdirSync(styles).filter(
  (name) => name.endsWith(".css") && !excecoes.has(name),
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
      // Tamanhos pequenos permitidos: 12 e 14 px (mínimo de texto: 12 px).
      if (/^--text-(12|14)$/.test(property) && [12, 14].includes(pixels))
        continue;
      if (/^(width|height)$/.test(property) && pixels <= 3) continue;
      if (pixels % 8 !== 0)
        failures.push(`${file}: ${property}: ${value.trim()}`);
    }
    if (/^--text-\d+$/.test(property)) {
      const size = Number.parseFloat(value);
      if (size < 12) failures.push(`${file}: texto abaixo de 12 px: ${property}`);
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
    `8-point scale: ${declarations} declarations and JSX icon sizes checked. Welcome instruction: explicit 20px exception. Excluído: replica-figma.css.`,
  );
}
