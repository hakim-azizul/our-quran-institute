'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', background: '#005F73' }} />
  )
});

export default function HomePage() {
  return <App />;
}

