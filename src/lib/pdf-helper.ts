import html2canvas from "html2canvas";

/**
 * Converts an OKLCH color string to an RGB, RGBA, or Hex string.
 * OKLCH formula matches the W3C CSS Color Module Level 4 specifications.
 */
export function oklchToRgb(lStr: string, cStr: string, hStr: string, aStr?: string): string {
  let L = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
  let C = parseFloat(cStr);
  let H = parseFloat(hStr);
  let A = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;

  // Hue in radians
  let hRad = (H * Math.PI) / 180;
  let a = C * Math.cos(hRad);
  let b = C * Math.sin(hRad);

  // Convert to LMS color space
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  // Nonlinear to linear LMS values
  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;

  // Convert LMS linear to linear sRGB
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bVal = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Gamma correction to sRGB
  function gamma(x: number): number {
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  }

  let R = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  let G = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  let B = Math.round(Math.max(0, Math.min(1, gamma(bVal))) * 255);

  if (A === 1) {
    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  }
}

/**
 * Parses and converts OKLCH, LAB, LCH, and color() CSS declarations to hex/rgb/rgba.
 */
/**
 * Converts an OKLAB color string to an RGB, RGBA, or Hex string.
 */
export function oklabToRgb(lStr: string, aStr: string, bStr: string, alphaStr?: string): string {
  let L = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
  let a = parseFloat(aStr);
  let b = parseFloat(bStr);
  let A = alphaStr ? (alphaStr.endsWith('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr)) : 1;

  // Convert to LMS color space
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  // Nonlinear to linear LMS values
  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;

  // Convert LMS linear to linear sRGB
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bVal = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Gamma correction to sRGB
  function gamma(x: number): number {
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  }

  let R = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  let G = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  let B = Math.round(Math.max(0, Math.min(1, gamma(bVal))) * 255);

  if (A === 1) {
    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  }
}

/**
 * Parses and converts OKLCH, OKLAB, LAB, LCH, and color() CSS declarations to hex/rgb/rgba.
 */
export function sanitizeColorString(str: string): string {
  if (typeof str !== "string") return str;

  // 1) Replace oklch(...)
  let result = str.replace(/oklch\(\s*([\d.]+%?)(?:\s+|,\s*)([\d.]+)(?:\s+|,\s*)([\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g, (match, l, c, h, a) => {
    try {
      return oklchToRgb(l, c, h, a);
    } catch (e) {
      return match;
    }
  });

  // 2) Replace oklab(...) - IMPORTANT: Process before lab(...) to prevent partial matches
  result = result.replace(/oklab\(\s*([\d.]+%?)(?:\s+|,\s*)([-\d.]+)(?:\s+|,\s*)([-\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g, (match, l, a, b, alpha) => {
    try {
      return oklabToRgb(l, a, b, alpha);
    } catch (e) {
      return match;
    }
  });

  // 3) Replace lab(...) -> Fallback to neutral gray or transparent equivalent
  result = result.replace(/lab\(\s*([\d.]+%?)(?:\s+|,\s*)([-\d.]+)(?:\s+|,\s*)([-\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g, () => {
    return "#808080";
  });

  // 4) Replace lch(...) -> Fallback to neutral gray
  result = result.replace(/lch\(\s*([\d.]+%?)(?:\s+|,\s*)([\d.]+)(?:\s+|,\s*)([\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g, () => {
    return "#808080";
  });

  // 5) Replace color(color-space r g b / alpha)
  result = result.replace(/color\(\s*([\w-]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g, (match, space, r, g, b, alpha) => {
    const R = Math.round(parseFloat(r) * 255);
    const G = Math.round(parseFloat(g) * 255);
    const B = Math.round(parseFloat(b) * 255);
    const A = alpha ? parseFloat(alpha) : 1;
    if (A === 1) {
      const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
    }
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  });

  return result;
}

/**
 * A safe wrapper for html2canvas that pre-processes in-place CSSOM styles, inline styles,
 * overrides getComputedStyle, wraps contentWindow of dynamic iframes, and waits for dynamic resources to resolve before rendering.
 */
export async function safeHtml2Canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement> {
  const restoreList: Array<() => void> = [];
  const originalGetComputedStyle = window.getComputedStyle;

  // Track iframe descriptors for restoration
  const contentWindowDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
  const contentDocumentDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument');
  
  const originalContentWindow = contentWindowDescriptor?.get;
  const originalContentDocument = contentDocumentDescriptor?.get;

  // Diagnostics check 1
  if (element) {
    console.log("POSTER EXPORT DIAGNOSTICS: Poster element found.");
  } else {
    throw new Error("Poster element not found during export diagnostics.");
  }

  // Wrapper function to override getComputedStyle in win contexts
  function wrapWindow(win: Window | null): Window | null {
    if (!win || (win as any).__getComputedStyleOverridden__) return win;
    (win as any).__getComputedStyleOverridden__ = true;
    
    const orig = win.getComputedStyle;
    win.getComputedStyle = function (elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
      const style = orig.call(win, elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const val = Reflect.get(target, prop);
          if (typeof val === "string" && (val.includes("oklch") || val.includes("oklab") || val.includes("lab") || val.includes("lch") || val.includes("color("))) {
            return sanitizeColorString(val);
          }
          if (typeof val === "function") {
            return function (...args: any[]) {
              const res = val.apply(target, args);
              if (typeof res === "string" && (res.includes("oklch") || res.includes("oklab") || res.includes("lab") || res.includes("lch") || res.includes("color("))) {
                return sanitizeColorString(res);
              }
              return res;
            };
          }
          return val;
        },
      });
    };
    return win;
  }

  try {
    // 1) Override global getComputedStyle
    window.getComputedStyle = function (elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
      const style = originalGetComputedStyle.call(window, elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const val = Reflect.get(target, prop);
          if (typeof val === "string" && (val.includes("oklch") || val.includes("oklab") || val.includes("lab") || val.includes("lch") || val.includes("color("))) {
            return sanitizeColorString(val);
          }
          if (typeof val === "function") {
            return function (...args: any[]) {
              const res = val.apply(target, args);
              if (typeof res === "string" && (res.includes("oklch") || res.includes("oklab") || res.includes("lab") || res.includes("lch") || res.includes("color("))) {
                return sanitizeColorString(res);
              }
              return res;
            };
          }
          return val;
        },
      });
    };

    restoreList.push(() => {
      window.getComputedStyle = originalGetComputedStyle;
    });

    // 2) Override HTMLIFrameElement prototype property getters to intercept iframe window creation
    if (originalContentWindow) {
      Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
        configurable: true,
        get() {
          const win = originalContentWindow.call(this);
          return wrapWindow(win);
        }
      });
      restoreList.push(() => {
        Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
          configurable: true,
          get: originalContentWindow
        });
      });
    }

    if (originalContentDocument) {
      Object.defineProperty(HTMLIFrameElement.prototype, 'contentDocument', {
        configurable: true,
        get() {
          const doc = originalContentDocument.call(this);
          if (doc && doc.defaultView) {
            wrapWindow(doc.defaultView);
          }
          return doc;
        }
      });
      restoreList.push(() => {
        Object.defineProperty(HTMLIFrameElement.prototype, 'contentDocument', {
          configurable: true,
          get: originalContentDocument
        });
      });
    }

    // 3) Wait for fonts to be loaded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // 4) Wait for all images/logos inside the target container to load
    const images = Array.from(element.querySelectorAll("img"));
    const imagePromises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });
    await Promise.all(imagePromises);

    // 5) Clean same-origin CSSOM stylesheets in-place using style.cssText
    let hasCleanedCSS = false;
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;

        const processRuleList = (ruleList: CSSRuleList) => {
          for (let j = 0; j < ruleList.length; j++) {
            const rule = ruleList[j];
            if (rule instanceof CSSStyleRule) {
              const cssText = rule.style.cssText;
              if (cssText && (cssText.includes("oklch") || cssText.includes("oklab") || cssText.includes("lab") || cssText.includes("lch") || cssText.includes("color("))) {
                const cleanText = sanitizeColorString(cssText);
                rule.style.cssText = cleanText;
                hasCleanedCSS = true;
                restoreList.push(() => {
                  try {
                    rule.style.cssText = cssText;
                  } catch (e) {}
                });
              }
            } else if (rule instanceof CSSGroupingRule || (rule as any).cssRules) {
              const subRules = (rule as any).cssRules;
              if (subRules) {
                processRuleList(subRules);
              }
            }
          }
        };

        processRuleList(rules);
      } catch (e) {
        // Ignore CORS stylesheet errors
      }
    }

    // 6) Clean element inline styles in-place using style.cssText
    const elementsToWalk = [element, ...Array.from(element.querySelectorAll("*"))] as HTMLElement[];
    for (const el of elementsToWalk) {
      if (el.style) {
        const cssText = el.style.cssText;
        if (cssText && (cssText.includes("oklch") || cssText.includes("oklab") || cssText.includes("lab") || cssText.includes("lch") || cssText.includes("color("))) {
          const cleanText = sanitizeColorString(cssText);
          el.style.cssText = cleanText;
          hasCleanedCSS = true;
          restoreList.push(() => {
            try {
              el.style.cssText = cssText;
            } catch (e) {}
          });
        }
      }
    }

    // Diagnostics check 2
    console.log("POSTER EXPORT DIAGNOSTICS: CSS parsed successfully.");

    // 7) Execute html2canvas
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      ...options,
    });

    // Diagnostics check 3
    console.log("POSTER EXPORT DIAGNOSTICS: Canvas created successfully.");

    return canvas;
  } finally {
    // 8) Restore original styles in reverse order
    for (let i = restoreList.length - 1; i >= 0; i--) {
      try {
        restoreList[i]();
      } catch (e) {}
    }
  }
}

