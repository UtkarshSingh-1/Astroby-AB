import ServiceDetail from '@/app-pages/ServiceDetail';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceDetail slug={slug} />;
}
