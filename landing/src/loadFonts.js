import cormorant400 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2?url';
import cormorant600 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2?url';
import cormorant700 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2?url';
import dmSans400 from '@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2?url';
import dmSans500 from '@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2?url';
import dmSans700 from '@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2?url';
import amiri400 from '@fontsource/amiri/files/amiri-arabic-400-normal.woff2?url';
import amiri700 from '@fontsource/amiri/files/amiri-arabic-700-normal.woff2?url';

async function loadOne(family, url, weight = '400', style = 'normal') {
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const buf = await res.arrayBuffer();
    const font = new FontFace(family, buf, { weight, style });
    await font.load();
    document.fonts.add(font);
  } catch (e) {
    console.warn(`Font load fallback for ${family} (${weight}):`, e);
  }
}

let loadedPromise = null;

export function initFonts() {
  if (!loadedPromise) {
    loadedPromise = Promise.all([
      loadOne('Cormorant Garamond', cormorant400, '400'),
      loadOne('Cormorant Garamond', cormorant600, '600'),
      loadOne('Cormorant Garamond', cormorant700, '700'),
      loadOne('DM Sans', dmSans400, '400'),
      loadOne('DM Sans', dmSans500, '500'),
      loadOne('DM Sans', dmSans700, '700'),
      loadOne('Amiri', amiri400, '400'),
      loadOne('Amiri', amiri700, '700'),
    ]);
  }
  return loadedPromise;
}

// Auto-trigger font initialization immediately upon module import
if (typeof window !== 'undefined') {
  initFonts();
}
