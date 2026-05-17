import { redirect } from 'next/navigation';

export default async function AdminIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.locale}/admin/dashboard`);
}
