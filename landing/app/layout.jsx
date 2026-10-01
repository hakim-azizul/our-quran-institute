import '../src/index.css';

export const metadata = {
  title: 'Our Quran Institute — A Complete Online Islamic Learning Journey',
  description: 'A complete online Islamic learning journey. Master Quran memorization (Hifz), Tajweed, Quranic Arabic, and authentic Islamic Studies with certified scholars from Al-Azhar. 1-on-1 private lessons across 42+ countries with connected Sanad certification.',
  icons: {
    icon: '/assets/logo_badge.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
