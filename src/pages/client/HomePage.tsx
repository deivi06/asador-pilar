import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../../state/AppContext';

export default function HomePage() {
  const { schedules, businessInfo } = useApp();
  const telHref = `tel:${businessInfo.phone.replace(/\s/g, '')}`;

  return (
    <div>
      {/* Hero — full-bleed brasa banner with the logo stamped over a big watermark */}
      <div className="relative flex h-[26rem] flex-col items-center justify-center overflow-hidden text-center text-white sm:h-[30rem] lg:h-[34rem]">
        <img
          src="/pollos-asados.webp"
          alt="Pollos asándose a la brasa en Asador Pilar"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brasa-900/80 via-brasa-900/70 to-brasa-900/90" />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-extrabold uppercase leading-none text-white/[0.06]"
          style={{ fontSize: 'clamp(5rem, 22vw, 13rem)' }}
        >
          Asador Pilar
        </span>

        <div className="relative flex flex-col items-center px-5">
          <img
            src="/logo-asador-pilar.jpg"
            alt="Asador Pilar"
            className="h-24 w-24 rounded-full border-4 border-oro-300/80 object-cover shadow-stamp sm:h-28 sm:w-28"
          />
          <h1 className="mt-5 text-3xl font-extrabold uppercase tracking-wide drop-shadow-sm sm:text-4xl lg:text-6xl">
            Asador Pilar
          </h1>
          <p className="mt-2 max-w-md text-sm text-oro-100 sm:text-base lg:text-lg">
            Tu asador de confianza en {businessInfo.city} desde siempre
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-oro-200 sm:text-sm">
            <Star size={13} className="fill-oro-300 text-oro-300" />
            {businessInfo.rating} · {businessInfo.ratingCount} reseñas en Google
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={telHref} className="inline-flex items-center gap-2 rounded-xl bg-pimenton-600 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-pimenton-700">
              <Phone size={18} /> Llámanos
            </a>
            <Link
              to="/carta"
              className="inline-flex items-center gap-2 rounded-xl bg-oro-300 px-6 py-3.5 font-bold text-brasa-900 shadow-lg transition hover:bg-oro-200"
            >
              Ver carta <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-4 sm:max-w-2xl lg:max-w-6xl lg:px-6 lg:py-10">
        {/* Info row — stacked cards on mobile, three columns on desktop */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Address */}
          <div className="card flex items-center gap-3 p-4 lg:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pimenton-50 text-pimenton-500">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brasa-400">Dirección de recogida</p>
              <p className="font-semibold text-brasa-800">{businessInfo.address}</p>
              <a href={telHref} className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-pimenton-600">
                <Phone size={13} /> {businessInfo.phone}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="card mt-4 p-4 lg:mt-0 lg:p-5">
            <p className="mb-3 flex items-center gap-2 font-bold text-brasa-800">
              <Clock size={18} className="text-pimenton-500" /> Horarios del Asador
            </p>
            <div className="space-y-1.5 text-sm">
              {schedules.map((s) => (
                <div key={s.day} className="flex items-center justify-between">
                  <span className="text-brasa-500">{s.day}</span>
                  <span className="font-bold text-pimenton-600">
                    {s.open ? `${s.openTime} - ${s.closeTime}` : 'Cerrado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real map */}
          <a
            href={businessInfo.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="card relative mt-4 block h-32 overflow-hidden lg:mt-0 lg:h-auto lg:min-h-[11rem]"
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

        <Link to="/carta" className="btn-primary mt-5 w-full lg:hidden">
          Ver nuestra carta <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
