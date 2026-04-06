import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import DashboardNav from '@/components/dashboard/DashboardNav';
import DashboardProviders from '@/components/dashboard/DashboardProviders';
import DraftOrderSubmitter from '@/components/dashboard/DraftOrderSubmitter';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <DashboardProviders userId={user.id}>
      <DraftOrderSubmitter />
      <div className="min-h-screen bg-surface-950">
        <DashboardNav
          user={user}
          profile={profile}
        />
        <main className="lg:pl-60">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </DashboardProviders>
  );
}
