'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/dashboard/Toast';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'In Progress',
  preview_ready: 'Preview Ready',
  revision: 'Under Revision',
  completed: 'Completed',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function NotificationListener({ userId }: { userId: string }) {
  const { addToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    // Listen for order status changes
    const ordersChannel = supabase
      .channel('order-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${userId}`,
        },
        (payload) => {
          const oldStatus = (payload.old as { status?: string }).status;
          const newStatus = (payload.new as { status?: string }).status;
          const businessName = (payload.new as { business_name?: string }).business_name;

          if (oldStatus && newStatus && oldStatus !== newStatus) {
            const label = STATUS_LABELS[newStatus] || newStatus;
            addToast({
              type: newStatus === 'cancelled' ? 'error' : 'success',
              title: `Order status: ${label}`,
              description: businessName
                ? `"${businessName}" has been updated.`
                : 'Your order status has changed.',
            });
          }
        },
      )
      .subscribe();

    // Listen for new messages on user's orders
    const messagesChannel = supabase
      .channel('new-messages-notify')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_messages',
        },
        async (payload) => {
          const msg = payload.new as { sender_id?: string; order_id?: string; body?: string };
          // Only notify for messages from others
          if (msg.sender_id === userId) return;

          // Check if this order belongs to the user
          const { data: order } = await supabase
            .from('orders')
            .select('business_name')
            .eq('id', msg.order_id)
            .eq('customer_id', userId)
            .single();

          if (order) {
            addToast({
              type: 'message',
              title: 'New message',
              description: order.business_name
                ? `New message on "${order.business_name}"`
                : 'You have a new message on your order.',
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [userId]);

  return null;
}
