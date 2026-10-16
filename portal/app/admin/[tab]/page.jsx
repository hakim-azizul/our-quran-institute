import AdminWorkspace from '../AdminWorkspace';

export default function AdminTabRoute({ params }) {
  return <AdminWorkspace initialTab={params?.tab} />;
}
