import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { formatDateTime } from '../../utils/format';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/shared/EmptyState';

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          return;
        }
        setMessages(data ?? []);
      });
  }, []);

  return (
    <div>
      <PageHeader title="Mensajes de Contacto" subtitle="Formularios enviados desde la web" />

      {error && (
        <div className="admin-card mb-4 p-4 text-sm font-semibold text-red-500">
          No se pudieron cargar los mensajes: {error}
        </div>
      )}

      {messages === null ? (
        <p className="text-sm text-ink-400">Cargando…</p>
      ) : messages.length === 0 ? (
        <EmptyState icon={<Mail size={28} />} title="Todavía no hay mensajes de contacto" />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="admin-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink-700">{m.name}</p>
                <span className="text-xs text-ink-400">{formatDateTime(m.created_at)}</span>
              </div>
              <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="text-sm font-medium text-rojo-500">
                {m.phone}
              </a>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink-600">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
