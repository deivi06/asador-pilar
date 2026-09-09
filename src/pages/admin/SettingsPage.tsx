import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import PageHeader from '../../components/admin/PageHeader';

export default function SettingsPage() {
  const { businessInfo, dispatch } = useApp();
  const [form, setForm] = useState(businessInfo);
  const [saved, setSaved] = useState(false);

  // `businessInfo` arranca con un valor de repuesto hasta que llega la fila real
  // de Supabase; cuando llega, se sincroniza el formulario para no pisarla luego.
  useEffect(() => setForm(businessInfo), [businessInfo]);

  const save = () => {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', info: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Datos generales del negocio" />

      <div className="admin-card max-w-xl space-y-4 p-5">
        <div>
          <label className="admin-label">Nombre del negocio</label>
          <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Frase / eslogan</label>
          <input className="admin-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Dirección</label>
          <input className="admin-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Teléfono</label>
          <input className="admin-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">WhatsApp</label>
          <input
            className="admin-input"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Instagram (opcional)</label>
          <input
            className="admin-input"
            value={form.instagram ?? ''}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
        </div>
        <button className="admin-btn-primary" onClick={save}>
          <Save size={16} /> Guardar cambios
        </button>
        {saved && <p className="text-sm font-semibold text-emerald-600">Cambios guardados ✓</p>}
      </div>
    </div>
  );
}
