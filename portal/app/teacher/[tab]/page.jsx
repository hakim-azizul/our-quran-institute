import DashboardWorkspace from '../../dashboard/DashboardWorkspace';

export default function TeacherTabRoute({ params }) {
  return <DashboardWorkspace initialTab={params?.tab || 'teacherdashboard'} />;
}
