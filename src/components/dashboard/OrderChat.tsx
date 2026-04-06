'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, Paperclip, Image as ImageIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  body: string;
  attachment_url: string;
  is_read: boolean;
  created_at: string;
  sender?: { full_name: string; role: string };
}

export default function OrderChat({
  orderId,
  currentUserId,
  variant = 'customer',
}: {
  orderId: string;
  currentUserId: string;
  variant?: 'customer' | 'admin';
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachPreview, setAttachPreview] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const bg = variant === 'admin' ? 'bg-surface-800' : 'bg-[#0A1628]';
  const border = variant === 'admin' ? 'border-surface-700' : 'border-white/10';
  const cardBg = variant === 'admin' ? 'bg-surface-900' : 'bg-[#0F1D32]';
  const inputBg = variant === 'admin' ? 'bg-surface-800' : 'bg-[#0A1628]';

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel(`order-messages-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'order_messages', filter: `order_id=eq.${orderId}` },
        async (payload) => {
          const { data } = await supabase
            .from('order_messages')
            .select('*, sender:profiles!order_messages_sender_id_fkey(full_name, role)')
            .eq('id', payload.new.id)
            .single();
          if (data) {
            setMessages((prev) => prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message]);
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from('order_messages')
      .select('*, sender:profiles!order_messages_sender_id_fkey(full_name, role)')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) || []);
    setLoading(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachment(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setAttachPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAttachPreview('');
    }
    e.target.value = '';
  }

  function clearAttachment() {
    setAttachment(null);
    setAttachPreview('');
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = newMessage.trim();
    if ((!body && !attachment) || sending) return;

    setSending(true);
    setNewMessage('');

    let attachmentUrl = '';

    // Upload attachment if provided
    if (attachment) {
      const ext = attachment.name.split('.').pop();
      const path = `${orderId}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('order-assets')
        .upload(path, attachment);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('order-assets')
          .getPublicUrl(path);
        attachmentUrl = urlData.publicUrl;
      }
      clearAttachment();
    }

    const { data, error } = await supabase
      .from('order_messages')
      .insert({
        order_id: orderId,
        sender_id: currentUserId,
        body: body || (attachment ? `[Attachment: ${attachment.name}]` : ''),
        attachment_url: attachmentUrl,
      })
      .select('*, sender:profiles!order_messages_sender_id_fkey(full_name, role)')
      .single();

    if (data) {
      setMessages((prev) => prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message]);
    }
    if (error) setNewMessage(body);

    setSending(false);
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (isToday) return time;
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${time}`;
  }

  return (
    <div className={`rounded-xl border ${border} ${cardBg} overflow-hidden flex flex-col`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${border} flex items-center gap-2`}>
        <MessageSquare size={14} className="text-[#FF6B4A]" />
        <h3 className="text-sm font-display font-semibold text-white">Messages</h3>
        {messages.length > 0 && (
          <span className="text-[10px] text-surface-500 font-body">({messages.length})</span>
        )}
      </div>

      {/* Messages area */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-3 space-y-3 ${bg}`}
        style={{ maxHeight: '400px', minHeight: '200px' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="text-surface-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare size={24} className="text-surface-600 mb-2" />
            <p className="text-xs text-surface-500 font-body">
              No messages yet. Start the conversation.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            const senderName = msg.sender?.full_name || 'Unknown';
            const isStaff = msg.sender?.role === 'admin' || msg.sender?.role === 'developer';
            const hasImage = msg.attachment_url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(msg.attachment_url);

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                    isMe
                      ? 'bg-[#FF6B4A] text-white rounded-br-sm'
                      : `${variant === 'admin' ? 'bg-surface-700' : 'bg-white/5'} text-white rounded-bl-sm`
                  }`}
                >
                  {!isMe && (
                    <p className={`text-[10px] font-body font-medium mb-0.5 ${isStaff ? 'text-blue-400' : 'text-[#FF6B4A]'}`}>
                      {senderName}
                      {isStaff && <span className="ml-1 opacity-60">({msg.sender?.role})</span>}
                    </p>
                  )}

                  {/* Attachment image */}
                  {hasImage && (
                    <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="block mb-2">
                      <img
                        src={msg.attachment_url}
                        alt="Attachment"
                        className="rounded-lg max-h-48 w-auto border border-white/10"
                      />
                    </a>
                  )}

                  {/* Non-image attachment */}
                  {msg.attachment_url && !hasImage && (
                    <a
                      href={msg.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 text-xs mb-1 ${isMe ? 'text-white/80' : 'text-[#FF6B4A]'} hover:underline`}
                    >
                      <Paperclip size={11} />
                      View attachment
                    </a>
                  )}

                  <p className="text-sm font-body whitespace-pre-wrap break-words">{msg.body}</p>
                  <p className={`text-[9px] mt-1 ${isMe ? 'text-white/50' : 'text-surface-500'}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Attachment preview */}
      {attachment && (
        <div className={`px-3 pt-2 border-t ${border} flex items-center gap-2`}>
          {attachPreview ? (
            <img src={attachPreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
              <Paperclip size={14} className="text-surface-500" />
            </div>
          )}
          <span className="text-xs text-surface-400 font-body flex-1 truncate">{attachment.name}</span>
          <button onClick={clearAttachment} className="p-1 text-surface-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className={`px-3 py-3 border-t ${border} flex gap-2`}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="p-2 text-surface-500 hover:text-white transition-colors flex-shrink-0"
          title="Attach file or screenshot"
        >
          <Paperclip size={16} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 px-3.5 py-2 ${inputBg} border ${border} rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors`}
        />
        <button
          type="submit"
          disabled={(!newMessage.trim() && !attachment) || sending}
          className="px-3.5 py-2 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-40 disabled:hover:bg-[#FF6B4A] text-white rounded-lg transition-all flex items-center gap-1.5"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
    </div>
  );
}
