import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import PageHeader from '../../components/admin/PageHeader';

interface Holiday {
  id: string;
  date: string;
  event: string;
  status: string;
  closed: boolean;
}

const initialHolidays: Holiday[] = [
  { id: 'h1', date: '25 de dic', event: 'Navidad (cerrado por festivo nacional)', status: 'Cerrado', closed: true },
  { id: 'h2', date: '31 de dic', event: 'Nochevieja (servicio especial de pollos de encargo)', status: '10:00–15:00', closed: false },
];

export default function SchedulesPage() {
  const { schedules, timeSlots, orders, dispatch } = useApp();
  const [intervalo, setIntervalo] = useState(15);
  const [maxPorIntervalo, setMaxPorIntervalo] = useState(5);
  const [avisoPrevio, setAvisoPrevio] = useState(30);
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [addingHoliday, setAddingHoliday] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: '', event: '', status: '' });

  const occupancy = useMemo(() => {
    return timeSlots.map((slot) => {
      const used = orders.filter((o) => o.pickupTime === slot.time && o.status !== 'cancelado').length;
      return { ...slot, used, full: used >= slot.maxOrders };
    });
  }, [timeSlots, orders]);

  return (
    <div>
      <PageHeader title="Gestión de Horarios y Franjas" subtitle="Definición de horas de apertura y capacidad de recogida" />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="admin-card p-5">
          <p className="mb-4 font-semibold text-ink-700">Horario semanal general</p>
          <div className="space-y-1">
            {schedules.map((s) => (
              <div key={s.day} className="flex items-center justify-between gap-3 border-b border-ink-50 py-2.5 last:border-0">
                <span className="w-20 text-sm font-medium text-ink-700">{s.day}</span>
                {s.open ? (
                  <span className="flex-1 text-sm text-ink-500">
                    {s.openTime} – {s.closeTime}
                  </span>
                ) : (
                  <span className="flex-1 text-sm text-ink-300">Cerrado</span>
                )}
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={s.open}
                    onChange={() => dispatch({ type: 'UPDATE_SCHEDULE', schedule: { ...s, open: !s.open } })}
                  />
                  <span className="relative h-5 w-9 rounded-full bg-ink-200 transition peer-checked:bg-emerald-500 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-ink-100 pt-5">
            <p className="mb-3 font-semibold text-ink-700">Festivos y días especiales</p>
            <div className="divide-y divide-ink-50">
              {holidays.map((h) => (
                <div key={h.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div>
                    <p className="font-semibold text-ink-700">{h.date}</p>
                    <p className="text-xs text-ink-400">{h.event}</p>
                  </div>
                  <span className={`admin-pill border-transparent ${h.closed ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>

            {addingHoliday ? (
              <div className="mt-3 space-y-2 rounded-lg border border-ink-100 p-3">
                <input
                  className="admin-input"
                  placeholder="Fecha (ej: 6 de ene)"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                />
                <input
                  className="admin-input"
                  placeholder="Descripción del evento"
                  value={newHoliday.event}
                  onChange={(e) => setNewHoliday({ ...newHoliday, event: e.target.value })}
                />
                <input
                  className="admin-input"
                  placeholder="Estado (ej: Cerrado o 10:00–14:00)"
                  value={newHoliday.status}
                  onChange={(e) => setNewHoliday({ ...newHoliday, status: e.target.value })}
                />
                <div className="flex justify-end gap-2">
                  <button className="admin-btn-secondary" onClick={() => setAddingHoliday(false)}>
                    Cancelar
                  </button>
                  <button
                    className="admin-btn-primary"
                    onClick={() => {
                      if (!newHoliday.date || !newHoliday.event) return;
                      setHolidays((prev) => [
                        ...prev,
                        {
                          id: `h-${Date.now()}`,
                          date: newHoliday.date,
                          event: newHoliday.event,
                          status: newHoliday.status || 'Cerrado',
                          closed: /cerrado/i.test(newHoliday.status || 'Cerrado'),
                        },
                      ]);
                      setNewHoliday({ date: '', event: '', status: '' });
                      setAddingHoliday(false);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <button className="admin-btn-secondary mt-3 w-full" onClick={() => setAddingHoliday(true)}>
                <Plus size={16} /> Añadir festivo
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-5">
            <p className="mb-4 font-semibold text-ink-700">Reglas de recogida</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Intervalo de tiempo</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="admin-input w-16 text-center"
                    value={intervalo}
                    onChange={(e) => setIntervalo(Number(e.target.value))}
                  />
                  <span className="text-xs text-ink-400">min.</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Pedidos máx. por intervalo</span>
                <input
                  type="number"
                  className="admin-input w-16 text-center"
                  value={maxPorIntervalo}
                  onChange={(e) => setMaxPorIntervalo(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Tiempo de aviso previo</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="admin-input w-16 text-center"
                    value={avisoPrevio}
                    onChange={(e) => setAvisoPrevio(Number(e.target.value))}
                  />
                  <span className="text-xs text-ink-400">min.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card p-5">
            <p className="mb-4 font-semibold text-ink-700">Ocupación de franjas hoy</p>
            <div className="space-y-2.5">
              {occupancy.map((slot) => (
                <div key={slot.time} className="flex items-center gap-3 text-sm">
                  <span className="w-12 font-medium text-ink-600">{slot.time}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={`h-full rounded-full ${slot.full ? 'bg-red-400' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(100, (slot.used / slot.maxOrders) * 100)}%` }}
                    />
                  </div>
                  {slot.full ? (
                    <span className="w-16 text-right text-xs font-bold text-red-500">COMPLETO</span>
                  ) : (
                    <span className="w-16 text-right text-xs text-ink-400">
                      {slot.used}/{slot.maxOrders} ped.
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
