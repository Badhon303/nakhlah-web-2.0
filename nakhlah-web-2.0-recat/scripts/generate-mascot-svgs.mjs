/**
 * Generates standalone animated (CSS) SVG files for every FreshDateMascot mood.
 * Mirrors the geometry/animation of components/nakhlah/DateMascot.jsx.
 *
 * Run: node scripts/generate-mascot-svgs.mjs
 * Output: public/mascots/<mood>.svg
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/mascots");

// Inline the thinking hand: strip XML prolog + outer <svg> wrapper, keep inner paths.
const HAND_RAW = readFileSync(
  resolve(__dirname, "../public/thinking-hand-2.svg"),
  "utf8",
);
const HAND_INNER = HAND_RAW.replace(/<\?xml[^>]*\?>/i, "")
  .replace(/<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "")
  .trim();

const LIMB_FILL = "#E8B25A";
const LIMB_STROKE = "#8A4E1C";

const capsule = (bx, by, deg, len, r) => {
  const t = (deg * Math.PI) / 180;
  const dx = Math.cos(t);
  const dy = Math.sin(t);
  const nx = -dy * r;
  const ny = dx * r;
  const tx = bx + dx * len;
  const ty = by + dy * len;
  const p = (v) => v.toFixed(2);
  return (
    `M${p(bx + nx)} ${p(by + ny)} ` +
    `L${p(tx + nx)} ${p(ty + ny)} ` +
    `A${r} ${r} 0 0 0 ${p(tx - nx)} ${p(ty - ny)} ` +
    `L${p(bx - nx)} ${p(by - ny)} ` +
    `A${r} ${r} 0 0 0 ${p(bx + nx)} ${p(by + ny)} Z`
  );
};

const WAVE_PIECES = [
  "M-1.99 -1.35 Q-1.4 6.39 -5.6 11.8 A2 2 0 0 0 -2.4 14.2 Q2.4 7.61 1.99 -1.65 Z",
  "M-3.8 -3.2 a3.8 3.6 0 1 0 7.6 0 a3.8 3.6 0 1 0 -7.6 0 Z",
  capsule(-3.2, -1.8, -152, 3.8, 1.15),
  capsule(-2.7, -5, -107, 4.3, 1.05),
  capsule(-0.9, -5.7, -95, 5, 1.1),
  capsule(0.9, -5.6, -83, 4.5, 1.05),
  capsule(2.6, -4.9, -70, 3.4, 0.9),
];

const mergedLimb = () =>
  WAVE_PIECES.map(
    (d) =>
      `<path d="${d}" fill="${LIMB_FILL}" stroke="${LIMB_STROKE}" stroke-width="0.8" stroke-linejoin="round"/>`,
  ).join("") +
  WAVE_PIECES.map((d) => `<path d="${d}" fill="${LIMB_FILL}"/>`).join("");

const waveLimb = (x, y, flip = false, rotate = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -1 : 1} 1)">${mergedLimb()}</g>`;

const bothWaving = waveLimb(5.5, 36.5, true) + waveLimb(58.5, 36.5);
const drooping = waveLimb(6, 62, false, 180) + waveLimb(58, 62, true, 180);
const thinkingHand = `<svg x="20" y="58" width="20" height="22.4" viewBox="0 0 281 309" preserveAspectRatio="xMidYMid meet" overflow="visible">${HAND_INNER}</svg>`;

const getArms = (mood) => {
  switch (mood) {
    case "happy":
    case "encouraging":
    case "excited":
      return bothWaving;
    case "sad":
      return drooping;
    case "thinking":
      return thinkingHand;
    default:
      return "";
  }
};

const eyebrows = (mood) => {
  switch (mood) {
    case "happy":
    case "excited":
    case "celebrating":
      return `<path d="M19 32 Q24 29 29 31" stroke="#3E2412" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M35 31 Q40 29 45 32" stroke="#3E2412" stroke-width="1.6" stroke-linecap="round" fill="none"/>`;
    case "thinking":
      return `<path d="M19 33 Q24 30 29 32" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M35 30 Q40 27 45 30" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
    case "sad":
      return `<path d="M19 32 Q24 35 29 34" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M35 34 Q40 35 45 32" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
    case "surprised":
      return `<path d="M19 30 Q24 27 29 29" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M35 29 Q40 27 45 30" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
    case "focused":
      return `<path d="M19 34 L29 32.5" stroke="#3E2412" stroke-width="2" stroke-linecap="round"/><path d="M35 32.5 L45 34" stroke="#3E2412" stroke-width="2" stroke-linecap="round"/>`;
    case "proud":
    case "encouraging":
      return `<path d="M19 32 Q24 29.5 29 31" stroke="#3E2412" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M35 31 Q40 29.5 45 32" stroke="#3E2412" stroke-width="1.6" stroke-linecap="round" fill="none"/>`;
    case "confident":
      return `<path d="M19 31 Q24 28 29 30" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M35 34 Q40 33.5 45 34.5" stroke="#3E2412" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
    default:
      return "";
  }
};

const eyes = (mood) => {
  switch (mood) {
    case "happy":
    case "celebrating":
      return `<path d="M19 43 Q24 37.5 29 43" stroke="#3E2412" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M35 43 Q40 37.5 45 43" stroke="#3E2412" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
    case "confident":
      return `<ellipse cx="24" cy="42" rx="5" ry="6" fill="white"/><ellipse cx="40" cy="42.8" rx="5" ry="5.2" fill="white"/><circle cx="25" cy="42.5" r="2.8" fill="#3E2412"/><circle cx="41" cy="43" r="2.8" fill="#3E2412"/><circle cx="26" cy="41" r="1.2" fill="white"/><circle cx="42" cy="41.5" r="1.2" fill="white"/>`;
    case "sleeping":
      return `<path d="M19 42 Q24 46 29 42" stroke="#3E2412" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M35 42 Q40 46 45 42" stroke="#3E2412" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M21 45 L22 47" stroke="#3E2412" stroke-width="0.9" stroke-linecap="round"/><path d="M27 45 L26 47" stroke="#3E2412" stroke-width="0.9" stroke-linecap="round"/><path d="M37 45 L38 47" stroke="#3E2412" stroke-width="0.9" stroke-linecap="round"/><path d="M43 45 L42 47" stroke="#3E2412" stroke-width="0.9" stroke-linecap="round"/>`;
    case "cool":
      return "";
    case "excited":
      return `<ellipse class="blink" cx="24" cy="42" rx="5.5" ry="6.5" fill="white"/><ellipse class="blink" cx="40" cy="42" rx="5.5" ry="6.5" fill="white"/><circle class="pupilBob" cx="25" cy="43" r="3" fill="#3E2412"/><circle class="pupilBob" cx="41" cy="43" r="3" fill="#3E2412"/><circle cx="26" cy="41" r="1.3" fill="white"/><circle cx="42" cy="41" r="1.3" fill="white"/>`;
    case "surprised":
      return `<circle cx="24" cy="42" r="6.5" fill="white"/><circle cx="40" cy="42" r="6.5" fill="white"/><circle cx="24" cy="42" r="3.2" fill="#3E2412"/><circle cx="40" cy="42" r="3.2" fill="#3E2412"/><circle cx="25.2" cy="40.5" r="1.2" fill="white"/><circle cx="41.2" cy="40.5" r="1.2" fill="white"/>`;
    case "thinking":
      return `<ellipse cx="24" cy="42" rx="5" ry="6" fill="white"/><ellipse cx="40" cy="42" rx="5" ry="6" fill="white"/><circle class="look" cx="25.5" cy="40" r="2.6" fill="#3E2412"/><circle class="look" cx="41.5" cy="40" r="2.6" fill="#3E2412"/>`;
    case "sad":
      return `<ellipse cx="24" cy="43" rx="4.8" ry="5.5" fill="white"/><ellipse cx="40" cy="43" rx="4.8" ry="5.5" fill="white"/><circle cx="24" cy="44.5" r="2.6" fill="#3E2412"/><circle cx="40" cy="44.5" r="2.6" fill="#3E2412"/><circle cx="25" cy="43.5" r="1" fill="white"/><circle cx="41" cy="43.5" r="1" fill="white"/><path class="tear" d="M18 47 Q17 50 18 52 Q19 53.5 20 52 Q21 50 20 47.5 Q19 46 18 47Z" fill="#7DD3FC"/>`;
    case "focused":
      return `<ellipse cx="24" cy="42" rx="5" ry="4.5" fill="white"/><ellipse cx="40" cy="42" rx="5" ry="4.5" fill="white"/><circle cx="25" cy="42" r="2.7" fill="#3E2412"/><circle cx="41" cy="42" r="2.7" fill="#3E2412"/><circle cx="26" cy="41" r="1" fill="white"/><circle cx="42" cy="41" r="1" fill="white"/>`;
    case "proud":
    case "encouraging":
    default:
      return `<ellipse class="blink" cx="24" cy="42" rx="5" ry="6" fill="white"/><ellipse class="blink" cx="40" cy="42" rx="5" ry="6" fill="white"/><circle class="blink" cx="25" cy="42.5" r="2.8" fill="#3E2412"/><circle class="blink" cx="41" cy="42.5" r="2.8" fill="#3E2412"/><circle cx="26" cy="41" r="1.2" fill="white"/><circle cx="42" cy="41" r="1.2" fill="white"/>`;
  }
};

const mouth = (mood) => {
  switch (mood) {
    case "excited":
    case "celebrating":
      return `<path d="M24 57 Q32 58 40 57 Q40 67 32 67 Q24 67 24 57Z" fill="#3E2412"/><path d="M26 57.5 Q32 58.5 38 57.5 L38 60 Q32 61 26 60Z" fill="white"/><ellipse cx="32" cy="64.5" rx="3.5" ry="2" fill="#FF8A80"/>`;
    case "cool":
      return `<path d="M26 60 Q33 63.5 39 58.5" stroke="#3E2412" stroke-width="2.3" stroke-linecap="round" fill="none"/>`;
    case "proud":
      return `<path d="M25 58 Q32 64 39 58" stroke="#3E2412" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M27.5 59.4 Q32 62.5 36.5 59.4 L36 60.8 Q32 63 28 60.8Z" fill="white"/>`;
    case "thinking":
      return `<path d="M27 61 Q30 59.5 34 61.5" stroke="#3E2412" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
    case "confident":
      return `<path d="M27 61.5 Q32 63 36 59.5" stroke="#3E2412" stroke-width="2.3" stroke-linecap="round" fill="none"/>`;
    case "sad":
      return `<path d="M26 63 Q32 58 38 63" stroke="#3E2412" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
    case "surprised":
      return `<ellipse cx="32" cy="61" rx="4" ry="5" fill="#3E2412"/>`;
    case "sleeping":
      return `<ellipse class="breathe" cx="32" cy="61" rx="2.5" ry="3" fill="#3E2412"/>`;
    case "focused":
      return `<path d="M27 61 L37 61" stroke="#3E2412" stroke-width="2.4" stroke-linecap="round"/>`;
    case "encouraging":
      return `<path d="M24 57 Q32 66 40 57 Q32 60 24 57Z" fill="#3E2412"/><path d="M26.5 58 Q32 60 37.5 58 L37 60 Q32 62 27 60Z" fill="white"/>`;
    default:
      return `<path d="M25 58 Q32 65 39 58" stroke="#3E2412" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M28 60.2 Q32 63 36 60.2 L35.5 61.6 Q32 64 28.5 61.6Z" fill="white"/>`;
  }
};

const blush = (mood) => {
  if (mood === "sad" || mood === "focused") return "";
  const opacity = mood === "sleeping" ? 0.35 : 0.55;
  return `<ellipse cx="14" cy="50" rx="4" ry="2.3" fill="#F9A8D4" opacity="${opacity}"/><ellipse cx="50" cy="50" rx="4" ry="2.3" fill="#F9A8D4" opacity="${opacity}"/>`;
};

const accessory = (mood) => {
  switch (mood) {
    case "cool":
      return `<g><rect x="16" y="37" width="15" height="10" rx="4" fill="#1a1a2e"/><rect x="33" y="37" width="15" height="10" rx="4" fill="#1a1a2e"/><rect x="29" y="40" width="6" height="2.5" fill="#1a1a2e"/><line x1="16" y1="41" x2="9" y2="39" stroke="#1a1a2e" stroke-width="2.2"/><line x1="48" y1="41" x2="55" y2="39" stroke="#1a1a2e" stroke-width="2.2"/><rect x="18.5" y="39" width="5" height="2" rx="1" fill="rgba(255,255,255,0.25)"/><rect x="35.5" y="39" width="4" height="1.5" rx="0.75" fill="rgba(255,255,255,0.15)"/></g>`;
    case "proud":
      return `<g><path d="M14 22 L19 10 L24 18 L29 8 L32 16 L35 8 L40 18 L45 10 L50 22 L50 28 L14 28 Z" fill="#FFD700"/><rect x="14" y="26" width="36" height="4" rx="1.5" fill="#DAA520"/><circle cx="21" cy="16" r="2" fill="#E11D48"/><circle cx="32" cy="11" r="2.2" fill="#3B82F6"/><circle cx="43" cy="16" r="2" fill="#10B981"/><ellipse class="shimmer" cx="32" cy="7" rx="4" ry="1.5" fill="rgba(255,255,255,0.35)"/></g>`;
    case "excited":
      return `<g><path d="M39 16.5 L49 21.5 L51 3.5 Z" fill="#34D399" stroke="#059669" stroke-width="0.6" stroke-linejoin="round"/><path d="M41.5 13.5 L50 17.8" stroke="#FBBF24" stroke-width="2"/><path d="M44.8 8.6 L50.6 11.5" stroke="#FBBF24" stroke-width="1.6"/><circle cx="51.2" cy="3" r="1.7" fill="#F97316"/><path class="spin" d="M8 26 L11 23 L14 26 L11 29 Z" fill="#FFD700"/><path class="spinr" d="M52 22 L55 19 L58 22 L55 25 Z" fill="#FF6B6B"/><circle class="p1" cx="10" cy="58" r="1.5" fill="#34D399"/><circle class="p2" cx="56" cy="62" r="1.5" fill="#818CF8"/></g>`;
    case "celebrating":
      return `<g><g><path d="M39 16.5 L49 21.5 L51 3.5 Z" fill="#34D399" stroke="#059669" stroke-width="0.6" stroke-linejoin="round"/><path d="M41.5 13.5 L50 17.8" stroke="#FBBF24" stroke-width="2"/><path d="M44.8 8.6 L50.6 11.5" stroke="#FBBF24" stroke-width="1.6"/><circle cx="51.2" cy="3" r="1.7" fill="#F97316"/></g><rect class="fall" x="8" y="20" width="3" height="3" rx="0.5" fill="#F472B6"/><rect class="fallr" x="54" y="16" width="3" height="3" rx="0.5" fill="#60A5FA"/><circle class="cfall1" cx="14" cy="14" r="1.6" fill="#FBBF24"/><circle class="cfall2" cx="50" cy="10" r="1.6" fill="#34D399"/><path class="cspin1" d="M6 40 L7.5 37 L9 40 L7.5 43 Z" fill="#FFD700"/><path class="cspin2" d="M55 44 L56.5 41 L58 44 L56.5 47 Z" fill="#F472B6"/></g>`;
    case "thinking":
      return `<g class="qbob"><text x="50" y="24" fill="#8B5A2B" font-size="14" font-weight="bold" font-family="Arial, sans-serif">?</text></g>`;
    case "sad":
      return `<path class="tear2" d="M46.5 44.5 C47.9 46.9 47.9 48.6 46.5 49.4 C45.1 48.6 45.1 46.9 46.5 44.5 Z" fill="#7EC8F7" stroke="#5BA8DC" stroke-width="0.4"/>`;
    case "happy":
      return `<g class="pulse" stroke="#F5B940" stroke-width="1.5" stroke-linecap="round"><path d="M6 20 L3.5 16.5"/><path d="M10 16.5 L8.8 12.5"/><path d="M3.5 26 L0.8 24.5"/><path d="M58 20 L60.5 16.5"/><path d="M54 16.5 L55.2 12.5"/><path d="M60.5 26 L63.2 24.5"/></g>`;
    case "sleeping":
      return `<g class="rise"><text x="48" y="30" fill="#B0AFAF" font-size="10" font-weight="bold">Z</text><text x="54" y="22" fill="#C8C7C7" font-size="7" font-weight="bold">z</text><text x="58" y="16" fill="#DEDDDD" font-size="5" font-weight="bold">z</text></g>`;
    case "focused":
      return `<g><circle cx="24" cy="42" r="7" fill="none" stroke="#1a1a2e" stroke-width="1.8"/><circle cx="40" cy="42" r="7" fill="none" stroke="#1a1a2e" stroke-width="1.8"/><path d="M31 42 L33 42" stroke="#1a1a2e" stroke-width="1.8"/><line x1="17" y1="42" x2="10" y2="40" stroke="#1a1a2e" stroke-width="1.8"/><line x1="47" y1="42" x2="54" y2="40" stroke="#1a1a2e" stroke-width="1.8"/><ellipse cx="22" cy="40" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.2)"/><ellipse cx="38" cy="40" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.15)"/></g>`;
    case "confident":
      return `<g><path class="spk1" d="M8 24 L9.8 20.5 L11.6 24 L9.8 27.5 Z" fill="#FFD700"/><path class="spk2" d="M54 32 L55.5 29 L57 32 L55.5 35 Z" fill="#FBBF24"/><circle class="dot" cx="12" cy="34" r="1.2" fill="#FFD700"/></g>`;
    case "encouraging":
      return `<g><path class="spk1" d="M9 30 L10.5 26.5 L12 30 L10.5 33.5 Z" fill="#FBBF24"/><path class="spk2" d="M52 26 L53.5 22.5 L55 26 L53.5 29.5 Z" fill="#FBBF24"/></g>`;
    default:
      return "";
  }
};

const bodyClass = (mood) => {
  switch (mood) {
    case "happy":
      return "b-happy";
    case "excited":
    case "celebrating":
      return "b-scale";
    case "sleeping":
      return "b-sleep";
    case "sad":
      return "b-sad";
    case "thinking":
    case "focused":
      return "b-think";
    case "encouraging":
      return "b-enc";
    default:
      return "b-def";
  }
};

const STYLE = `
.floatY{animation:floatY 3s ease-in-out infinite}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.floatR{animation:floatR 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes floatR{0%{transform:rotate(0)}33%{transform:rotate(1.2deg)}66%{transform:rotate(-1.2deg)}100%{transform:rotate(0)}}
.b-happy{animation:bHappy 2s ease-in-out infinite}
@keyframes bHappy{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.b-scale{animation:bScale .6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes bScale{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
.b-sleep{animation:bSleep 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes bSleep{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
.b-sad{animation:bSad 3s ease-in-out infinite}
@keyframes bSad{0%,100%{transform:translateY(0)}50%{transform:translateY(1.5px)}}
.b-think{animation:bThink 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes bThink{0%{transform:rotate(0)}25%{transform:rotate(1deg)}50%{transform:rotate(0)}75%{transform:rotate(-1deg)}100%{transform:rotate(0)}}
.b-enc{animation:bEnc 1.5s ease-in-out infinite}
@keyframes bEnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}
.b-def{animation:bDef 2.5s ease-in-out infinite}
@keyframes bDef{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.blink{animation:blink 4s infinite;transform-box:fill-box;transform-origin:center}
@keyframes blink{0%,42%{transform:scaleY(1)}45%{transform:scaleY(.1)}48%,100%{transform:scaleY(1)}}
.pupilBob{animation:pupilBob .6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes pupilBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
.look{animation:look 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes look{0%,100%{transform:translateX(0)}25%{transform:translateX(1.5px)}50%{transform:translateX(0)}75%{transform:translateX(-1.5px)}}
.tear{animation:tear 1.6s ease-in infinite;transform-box:fill-box;transform-origin:center}
@keyframes tear{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(6px);opacity:0}}
.tear2{animation:tear2 1.6s ease-in infinite;transform-box:fill-box;transform-origin:center}
@keyframes tear2{0%{transform:translateY(0);opacity:.95}100%{transform:translateY(3.5px);opacity:0}}
.breathe{animation:breathe 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.7)}}
.shimmer{animation:shimmer 2s ease-in-out infinite}
@keyframes shimmer{0%,100%{opacity:.2}50%{opacity:.5}}
.spin{animation:spin 2s linear infinite;transform-box:fill-box;transform-origin:center}
@keyframes spin{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(1.2)}100%{transform:rotate(360deg) scale(1)}}
.spinr{animation:spinr 2.5s linear infinite;transform-box:fill-box;transform-origin:center}
@keyframes spinr{0%{transform:rotate(0) scale(1)}50%{transform:rotate(-180deg) scale(1.3)}100%{transform:rotate(-360deg) scale(1)}}
.p1{animation:p1 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes p1{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-4px);opacity:.5}}
.p2{animation:p2 2.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes p2{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-5px);opacity:.5}}
.qbob{animation:qbob 2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes qbob{0%,100%{transform:translateY(0);opacity:.65}50%{transform:translateY(-2px);opacity:1}}
.pulse{animation:pulse 1.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
.rise{animation:rise 2s ease-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes rise{0%{transform:translateY(-2px);opacity:1}100%{transform:translateY(-8px);opacity:0}}
.spk1{animation:spk 1.5s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes spk{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.25);opacity:1}}
.spk2{animation:spk2 1.8s ease-in-out .4s infinite;transform-box:fill-box;transform-origin:center}
@keyframes spk2{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.3);opacity:1}}
.dot{animation:dot 1.2s ease-in-out .2s infinite}
@keyframes dot{0%,100%{opacity:.4}50%{opacity:1}}
.fall{animation:fall 2s linear infinite;transform-box:fill-box;transform-origin:center}
@keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(60px) rotate(360deg);opacity:0}}
.fallr{animation:fallr 2.4s linear .3s infinite;transform-box:fill-box;transform-origin:center}
@keyframes fallr{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(65px) rotate(-360deg);opacity:0}}
.cfall1{animation:cfall1 1.8s linear .6s infinite}
@keyframes cfall1{0%{transform:translateY(0);opacity:1}100%{transform:translateY(55px);opacity:0}}
.cfall2{animation:cfall2 2.2s linear .9s infinite}
@keyframes cfall2{0%{transform:translateY(0);opacity:1}100%{transform:translateY(60px);opacity:0}}
.cspin1{animation:cspin1 1.5s linear infinite;transform-box:fill-box;transform-origin:center}
@keyframes cspin1{0%{transform:scale(.8) rotate(0)}50%{transform:scale(1.3) rotate(90deg)}100%{transform:scale(.8) rotate(180deg)}}
.cspin2{animation:cspin2 1.7s linear infinite;transform-box:fill-box;transform-origin:center}
@keyframes cspin2{0%{transform:scale(.8) rotate(0)}50%{transform:scale(1.3) rotate(-90deg)}100%{transform:scale(.8) rotate(-180deg)}}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
`;

const DEFS = `<defs>
<linearGradient id="bodyBottom" x1="32" y1="19" x2="32" y2="92" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#B4762E"/><stop offset="45%" stop-color="#A9642A"/><stop offset="100%" stop-color="#8A4E1C"/></linearGradient>
<linearGradient id="bodyTop" x1="32" y1="19" x2="32" y2="69" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#F2C878"/><stop offset="60%" stop-color="#EBB860"/><stop offset="100%" stop-color="#DFA84E"/></linearGradient>
<linearGradient id="bodyOutline" x1="32" y1="19" x2="32" y2="92" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#C99A4A"/><stop offset="100%" stop-color="#6E3D14"/></linearGradient>
<linearGradient id="calyxTop" x1="32" y1="15" x2="32" y2="29" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#F2C979"/><stop offset="55%" stop-color="#E7B45C"/><stop offset="100%" stop-color="#D9A047"/></linearGradient>
<linearGradient id="stemGradient" x1="30.6" y1="12" x2="35.3" y2="12" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#F4CE5A"/><stop offset="55%" stop-color="#E4B840"/><stop offset="100%" stop-color="#C08E22"/></linearGradient>
</defs>`;

const BODY = `
<path d="M6 42 C6 27 17 16 32 16 C47 16 58 27 58 42 C58.5 46 58.5 51 58 56 C57 66 52 75 44 79 C40 81 36 81.5 32 81.5 C28 81.5 24 81 20 79 C12 75 7 66 6 56 C5.5 51 5.5 46 6 42Z" fill="url(#bodyBottom)" stroke="url(#bodyOutline)" stroke-width="1.6"/>
<path d="M6 42 C6 27 17 16 32 16 C47 16 58 27 58 42 C58.3 48 58.3 55 58 60 C50 63 42 65 32 65 C22 65 14 63 6 60 C5.7 55 5.7 48 6 42Z" fill="url(#bodyTop)"/>
<path d="M6 60 Q14 64 22 63 Q28 62 32 64 Q38 66 44 63 Q52 61 58 60" stroke="#B4762E" stroke-width="1.2" fill="none" opacity="0.35"/>
<ellipse cx="24" cy="36" rx="9" ry="6" fill="rgba(255,255,255,0.22)"/>
<ellipse cx="42" cy="32" rx="4" ry="3" fill="rgba(255,255,255,0.15)"/>
<path d="M16 68 Q20 73 18 78" stroke="#7A4415" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.35"/>
<path d="M46 68 Q44 72 46 76" stroke="#7A4415" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.3"/>
<path d="M27 76 Q32 79 37 76" stroke="#7A4415" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.3"/>
<g>
<path d="M16 22 C19 17.5 25 15 32 15 C39 15 45 17.5 48 22 Q46 25.6 44 24.2 Q42 27.4 40 25.8 Q38 28.7 36 26.8 Q34 29.4 32 27.1 Q30 29.4 28 26.8 Q26 28.7 24 25.8 Q22 27.4 20 24.2 Q18 25.6 16 22 Z" fill="url(#calyxTop)" stroke="#8F5F23" stroke-width="0.8" stroke-linejoin="round"/>
<path d="M46.5 21.4 Q46 23.9 44 22.5 Q42 25.7 40 24.1 Q38 27 36 25.1 Q34 27.7 32 25.4 Q30 27.7 28 25.1 Q26 27 24 24.1 Q22 25.7 20 22.5 Q18 23.9 17.5 21.4" stroke="#B07F35" stroke-width="0.45" opacity="0.7" fill="none" stroke-linecap="round"/>
<ellipse cx="32.4" cy="17.4" rx="2" ry="0.75" fill="#8A5F16" opacity="0.3"/>
<path d="M30.6 17.6 C30.7 14 31.3 10.6 32.4 7.9 L35.3 8.5 C34.7 11.2 34.3 14.4 34.2 17.6 Z" fill="url(#stemGradient)" stroke="#8A5E14" stroke-width="0.5" stroke-linejoin="round"/>
<path d="M31.5 16.8 C31.6 13.6 32 10.8 32.9 8.6" stroke="rgba(255,246,210,0.6)" stroke-width="0.5" fill="none" stroke-linecap="round"/>
<ellipse cx="33.85" cy="8.2" rx="1.55" ry="0.6" transform="rotate(12 33.85 8.2)" fill="#F6DE9C" stroke="#8A5E14" stroke-width="0.45"/>
<ellipse cx="31.4" cy="17" rx="0.55" ry="0.4" fill="#6E4A12" opacity="0.65"/>
</g>`;

const buildSvg = (mood) => {
  const face =
    `<g transform="translate(0 1.6)">${eyebrows(mood)}</g>` +
    eyes(mood) +
    accessory(mood) +
    blush(mood) +
    `<g transform="translate(0 -1.6)">${mouth(mood)}</g>` +
    getArms(mood);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 92" width="128" height="166" role="img" aria-label="${mood} date mascot">
<style>${STYLE}</style>
${DEFS}
<ellipse cx="32" cy="88" rx="19" ry="3" fill="rgba(0,0,0,0.1)"/>
<g class="floatY"><g class="floatR"><g class="${bodyClass(mood)}">
${BODY}
${face}
</g></g></g>
</svg>
`;
};

const MOODS = [
  "happy",
  "excited",
  "celebrating",
  "sleeping",
  "sad",
  "thinking",
  "focused",
  "encouraging",
  "proud",
  "confident",
  "surprised",
  "cool",
  "default",
];

mkdirSync(OUT_DIR, { recursive: true });
for (const mood of MOODS) {
  const file = resolve(OUT_DIR, `${mood}.svg`);
  writeFileSync(file, buildSvg(mood), "utf8");
  console.log(`wrote ${file}`);
}
console.log(`Done. ${MOODS.length} files.`);
