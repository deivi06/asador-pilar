import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'asadero-pilar-cookies-accepted';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brasa-700 bg-brasa-900 px-4 py-4 text-white shadow-[0_-4px_16px_rgba(0,0,0,0.25)] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-brasa-200 sm:text-left">
          Usamos almacenamiento técnico necesario (carrito, sesión) — no usamos cookies de
          analítica ni publicidad. Más información en nuestra{' '}
          <Link to="/politica-de-cookies" className="underline hover:text-white">
            Política de Cookies
          </Link>
          .
        </p>
        <button onClick={accept} className="btn-primary w-full shrink-0 px-6 py-2 sm:w-auto">
          Entendido
        </button>
      </div>
    </div>
  );
}
