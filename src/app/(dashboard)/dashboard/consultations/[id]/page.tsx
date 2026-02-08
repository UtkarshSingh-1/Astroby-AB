import ConsultationDetail from '@/app-pages/dashboard/user/ConsultationDetail';

const ConsultationDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ConsultationDetail consultationId={id} />;
};

export default ConsultationDetailPage;
