import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Preload critical web fonts into document.fonts
if (typeof window !== 'undefined' && 'FontFace' in window) {
  const fontConfigs = [
    { name: 'Amiri', url: '/fonts/amiri/amiri-arabic-700-normal.woff2', weight: '700' },
    { name: 'DM Sans', url: '/fonts/dm-sans/dm-sans-latin-700-normal.woff2', weight: '700' },
    { name: 'DM Sans', url: '/fonts/dm-sans/dm-sans-latin-400-normal.woff2', weight: '400' },
    { name: 'Cormorant Garamond', url: '/fonts/cormorant-garamond/cormorant-garamond-latin-600-normal.woff2', weight: '600' }
  ];

  fontConfigs.forEach((cfg) => {
    fetch(cfg.url)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const font = new FontFace(cfg.name, buf, { weight: cfg.weight, style: 'normal' });
        return font.load();
      })
      .then((font) => {
        document.fonts.add(font);
      })
      .catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
