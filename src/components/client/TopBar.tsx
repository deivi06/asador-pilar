import { Clock, Phone } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { scheduleSummary } from '../../utils/schedule';

export default function TopBar() {
  const { schedules, businessInfo } = useApp();

  return (
    <div className="bg-pimenton-600 px-4 py-2 text-xs font-semibold text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1 lg:justify-between">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} /> {scheduleSummary(schedules)}
        </span>
        <span className="inline-flex items-center gap-3">
          <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-oro-100">
            <Phone size={13} /> {businessInfo.phone}
          </a>
          <a href={`tel:${businessInfo.whatsapp.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-oro-100">
            <Phone size={13} /> {businessInfo.whatsapp}
          </a>
        </span>
        <span className="hidden items-center gap-1.5 text-pimenton-50 lg:inline-flex">
          Solo recogida en local · Sin envío a domicilio
        </span>
      </div>
    </div>
  );
}
