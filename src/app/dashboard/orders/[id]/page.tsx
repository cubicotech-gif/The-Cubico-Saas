import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import OrderDetail from '@/components/dashboard/OrderDetail';

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .eq('customer_id', user.id)
    .single();

  if (!order) notFound();

  return <OrderDetail order={order} currentUserId={user.id} />;
}
