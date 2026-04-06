import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import OrdersList from '@/components/dashboard/OrdersList';

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  return <OrdersList orders={orders ?? []} />;
}
