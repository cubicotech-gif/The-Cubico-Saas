import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import OrdersList from '@/components/dashboard/OrdersList';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <OrdersList />;
}
