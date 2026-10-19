import DashboardWorkspace from '../DashboardWorkspace';

export default function DashboardTabRoute({ params }) {
  return <DashboardWorkspace initialTab={params?.tab} />;
}
