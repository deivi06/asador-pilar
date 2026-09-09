import { MessageCircle } from 'lucide-react';
import { useApp } from '../../state/AppContext';

export default function WhatsAppFab() {
  const { businessInfo } = useApp();
  const number = businessInfo.phone.replace(/\s/g, '');
  const link = `https://wa.me/34${number}?text=${encodeURIComponent('Hola, quiero hacer un pedido')}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-600 sm:bottom-6 sm:right-6"
    >
      <MessageCircle size={26} />
    </a>
  );
}
