import { getProjects } from '@/lib/services';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    id: p.id,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
