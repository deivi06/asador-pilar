import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '../../state/AdminAuthContext';

export default function LoginPage() {
  const { user, isManager, loading, signIn, signOut } = useAdminAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <p className="text-sm text-ink-300">Cargando…</p>
      </div>
    );
  }

  if (user && isManager) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  // Cuenta válida pero sin rol de gerente: no mostramos el formulario, solo el aviso.
  if (user && !isManager) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
          <ShieldAlert className="mx-auto text-red-500" size={32} />
          <p className="mt-3 font-bold text-ink-700">Acceso restringido</p>
          <p className="mt-1 text-sm text-ink-400">
            Tu cuenta no tiene permisos de gerente. Habla con la administración del asador si crees
            que es un error.
          </p>
          <button onClick={signOut} className="admin-btn-secondary mt-5 w-full">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) setError('Email o contraseña incorrectos.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo-asador-pilar.jpg" alt="Asador Pilar" className="h-14 w-14 rounded-full object-cover" />
          <p className="mt-3 font-bold text-ink-700">ASADOR PILAR</p>
          <p className="text-xs text-ink-400">Acceso solo para gerentes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
              <input
                type="email"
                required
                autoFocus
                className="admin-input pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Contraseña</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
              <input
                type="password"
                required
                className="admin-input pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

          <button type="submit" disabled={submitting} className="admin-btn-primary w-full">
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
