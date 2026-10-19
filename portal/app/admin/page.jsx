import AdminWorkspace from './AdminWorkspace';

export default function AdminPage({ searchParams }) {
  const tab = searchParams?.tab || 'analytics';
  return <AdminWorkspace initialTab={tab} />;
}
