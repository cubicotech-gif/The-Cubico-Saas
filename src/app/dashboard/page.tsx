import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import DashboardShell from '@/components/DashboardShell';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardShell
      user={user}
      profile={profile}
      orders={orders ?? []}
    />
  );
}
