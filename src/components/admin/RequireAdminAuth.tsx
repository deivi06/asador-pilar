import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../state/AdminAuthContext';

export default function RequireAdminAuth() {
  const { user, isManager, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <p className="text-sm text-ink-400">Cargando…</p>
      </div>
    );
  }

  // Sin sesión, o con sesión pero sin rol de gerente: ambos casos se resuelven en
  // la pantalla de login (que distingue "inicia sesión" de "acceso restringido").
  if (!user || !isManager) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
