import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../state/AppContext';
import { scheduleRangeLabel } from '../../utils/schedule';

export default function Footer() {
  const { schedules, businessInfo } = useApp();
  const { days, hours } = scheduleRangeLabel(schedules);

  return (
    <footer className="bg-brasa-900 px-4 pb-24 pt-10 text-white lg:px-6 lg:pb-10">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3 sm:gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo-asador-pilar.jpg"
            alt="Asador Pilar"
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
          <div>
            <p className="font-extrabold tracking-wide">ASADOR PILAR</p>
            <p className="mt-0.5 text-sm text-brasa-300">{businessInfo.address}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-oro-300">Horario</p>
          <p className="mt-2 text-sm text-white">{days}</p>
          {hours && <p className="text-sm text-white">{hours}</p>}
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-oro-300">Síguenos</p>
          <div className="mt-2 flex items-center gap-3 sm:justify-end">
            <a href="#" aria-label="Facebook" className="text-brasa-300 transition hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="text-brasa-300 transition hover:text-white">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-3 border-t border-brasa-700 pt-5 text-center text-xs text-brasa-400">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link to="/aviso-legal" className="transition hover:text-white">Aviso Legal</Link>
          <Link to="/politica-de-privacidad" className="transition hover:text-white">Política de Privacidad</Link>
          <Link to="/politica-de-cookies" className="transition hover:text-white">Política de Cookies</Link>
        </div>
        <p>© {new Date().getFullYear()} {businessInfo.name}</p>
      </div>
    </footer>
  );
}
