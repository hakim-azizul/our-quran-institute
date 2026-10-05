'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }} />
  )
});

export default function HomePage() {
  return <App />;
}

