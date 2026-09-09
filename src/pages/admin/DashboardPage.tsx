import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../../state/AppContext';
import { formatPrice, formatOrderCode } from '../../utils/format';
import KpiCard from '../../components/admin/KpiCard';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import OriginTag from '../../components/admin/OriginTag';

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

const todayLabel = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function DashboardPage() {
  const { orders, products } = useApp();

  const todaysOrders = orders.filter((o) => isToday(o.createdAt));
  const salesToday = todaysOrders
    .filter((o) => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === 'pendiente').length;
  const outOfStock = products.filter((p) => p.stock <= 0 || !p.active);

  const weekData = buildWeekData(salesToday);

  return (
    <div>
      <PageHeader
        title="Bienvenido, Pilar"
        subtitle={todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)}
        action={
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SISTEMA ACTIVO
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Pedidos hoy" value={String(todaysOrders.length)} trend={{ direction: 'up', label: '+12%' }} />
        <KpiCard label="Ventas hoy" value={formatPrice(salesToday)} trend={{ direction: 'up', label: '+8.5%' }} />
        <KpiCard
          label="Pedidos pendientes"
          value={String(pending)}
          tag={pending > 5 ? { label: 'ATENCIÓN', tone: 'warning' } : undefined}
        />
        <KpiCard
          label="Productos agotados"
          value={String(outOfStock.length)}
          tag={outOfStock.length > 0 ? { label: 'CRÍTICO', tone: 'critical' } : undefined}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <p className="mb-4 font-semibold text-ink-700">Ventas última semana</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E8EC" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B6E7A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B6E7A' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => formatPrice(v)}
                  contentStyle={{ borderRadius: 10, border: '1px solid #E7E8EC', fontSize: 13 }}
                />
                <Bar dataKey="ventas" fill="#D42B00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-ink-700">Últimos pedidos</p>
            <Link to="/admin/pedidos" className="text-xs font-semibold text-rojo-500 hover:underline">
              Ver todos los pedidos
            </Link>
          </div>
          <div className="divide-y divide-ink-100">
            {orders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-700">
                    #{formatOrderCode(o.id)} · {o.customerName}
                  </p>
                  <p className="text-xs text-ink-400">{o.pickupTime} recogida</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <OriginTag origin={o.origin} />
                  <span className="w-16 text-right font-semibold text-ink-700">{formatPrice(o.total)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildWeekData(salesToday: number) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  return days.map((day, i) => {
    if (i === todayIdx) return { day, ventas: Math.round(salesToday * 100) / 100 };
    const factor = 0.55 + ((i * 37) % 50) / 100;
    return { day, ventas: Math.round(salesToday * factor * 100) / 100 };
  });
}
