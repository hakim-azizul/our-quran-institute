import DashboardWorkspace from '../dashboard/DashboardWorkspace';

export default function TeacherPage({ searchParams }) {
  const tab = searchParams?.tab || 'teacherdashboard';
  return <DashboardWorkspace initialTab={tab} />;
}
