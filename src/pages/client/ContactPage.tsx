import { useState, type FormEvent } from 'react';
import { Check, MapPin, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useApp } from '../../state/AppContext';

export default function ContactPage() {
  const { businessInfo } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase
      .from('contact_messages')
      .insert({ name: name.trim(), phone: phone.trim(), message: message.trim() });

    if (error) {
      setStatus('error');
      return;
    }
    setStatus('sent');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:max-w-2xl lg:max-w-5xl lg:py-16">
      <h1 className="text-center text-3xl font-extrabold uppercase tracking-wide text-brasa-900 sm:text-4xl">
        Contacto
      </h1>
      <p className="mx-auto mt-2 max-w-md text-center text-brasa-500">
        ¿Tienes alguna pregunta o quieres hacernos un encargo especial? Escríbenos o llámanos.
      </p>

      <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-8">
        <div>
          <div className="card space-y-3 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pimenton-50 text-pimenton-500">
                <MapPin size={18} />
              </div>
              <p className="font-semibold text-brasa-800">{businessInfo.address}</p>
            </div>
            <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pimenton-50 text-pimenton-500">
                <Phone size={18} />
              </div>
              <span className="font-semibold text-brasa-800">{businessInfo.phone}</span>
            </a>
            <a href={`tel:${businessInfo.whatsapp.replace(/\s/g, '')}`} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pimenton-50 text-pimenton-500">
                <Phone size={18} />
              </div>
              <span className="font-semibold text-brasa-800">{businessInfo.whatsapp}</span>
            </a>
          </div>

          <a
            href={businessInfo.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="card relative mt-4 block h-48 overflow-hidden lg:h-64"
          >
            <iframe
              title="Ubicación de Asador Pilar en Google Maps"
              src={`https://maps.google.com/maps?q=${businessInfo.lat},${businessInfo.lng}&z=16&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              tabIndex={-1}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brasa-800 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                <MapPin size={13} className="text-pimenton-400" />
                Abrir en Google Maps
              </span>
            </div>
          </a>
        </div>

        <div className="card mt-4 p-5 lg:mt-0">
          {status === 'sent' ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check size={26} strokeWidth={3} />
              </div>
              <p className="mt-3 font-bold text-brasa-800">¡Mensaje enviado!</p>
              <p className="mt-1 text-sm text-brasa-500">Te responderemos lo antes posible.</p>
              <button onClick={() => setStatus('idle')} className="btn-secondary mt-5">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Nombre *</label>
                <input
                  required
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="label-field">Teléfono *</label>
                <input
                  required
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="600 000 000"
                />
              </div>
              <div>
                <label className="label-field">Mensaje *</label>
                <textarea
                  required
                  rows={4}
                  className="input-field"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                />
              </div>

              {status === 'error' && (
                <p className="text-sm font-semibold text-red-500">
                  No se pudo enviar el mensaje. Inténtalo de nuevo en unos segundos.
                </p>
              )}

              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
                {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
