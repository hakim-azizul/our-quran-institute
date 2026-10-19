import DashboardWorkspace from './DashboardWorkspace';

export default function DashboardPage({ searchParams }) {
  // Support optional query params like ?tab=progress
  const tab = searchParams?.tab || null;
  return <DashboardWorkspace initialTab={tab} />;
}
