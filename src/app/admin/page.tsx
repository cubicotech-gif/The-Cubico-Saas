import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import AdminPanel from '@/components/admin/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → redirect to login
  if (!user) {
    redirect('/login?next=/admin');
  }

  // Check role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Not admin → redirect to customer dashboard
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminPanel currentUserId={user.id} />;
}
