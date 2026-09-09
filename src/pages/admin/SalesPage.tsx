import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../state/AppContext';
import { formatPrice } from '../../utils/format';
import KpiCard from '../../components/admin/KpiCard';
import PageHeader from '../../components/admin/PageHeader';

const periods = ['Últimos 30 días', 'Este mes', 'Este trimestre'] as const;

const channelColors = ['#D42B00', '#33353E'];
const categoryColors = ['#D42B00', '#E14E28', '#F5A588', '#6B6E7A'];

export default function SalesPage() {
  const { orders: allOrders } = useApp();
  const [period, setPeriod] = useState<(typeof periods)[number]>('Últimos 30 días');
  const orders = allOrders.filter((o) => o.status !== 'cancelado');

  const salesTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const avgTicket = orders.length ? salesTotal / orders.length : 0;

  const dailyEvolution = useMemo(() => {
    const points = 14;
    return Array.from({ length: points }, (_, i) => {
      const factor = 0.5 + ((i * 53) % 60) / 100;
      return { day: `${i + 1}`, ventas: Math.round(salesTotal * factor * 100) / 100 };
    });
  }, [salesTotal]);

  const channelData = useMemo(() => {
    const web = orders.filter((o) => o.origin === 'web').length;
    const tel = orders.filter((o) => o.origin === 'telefono').length;
    const total = web + tel || 1;
    return [
      { name: 'Web App', value: Math.round((web / total) * 1000) / 10 },
      { name: 'Teléfono', value: Math.round((tel / total) * 1000) / 10 },
    ];
  }, [orders]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      for (const line of o.items) {
        map.set(line.name, (map.get(line.name) ?? 0) + line.quantity);
      }
    }
    return map;
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number; web: number }>();
    for (const o of orders) {
      for (const line of o.items) {
        const current = map.get(line.productId) ?? { name: line.name, qty: 0, revenue: 0, web: 0 };
        current.qty += line.quantity;
        current.revenue += line.price * line.quantity;
        if (o.origin === 'web') current.web += line.quantity;
        map.set(line.productId, current);
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);
  }, [orders]);

  const topProduct = topProducts[0];

  return (
    <div>
      <PageHeader
        title="Estadísticas"
        subtitle="Rendimiento del negocio e informes de ventas diarias"
        action={
          <div className="flex rounded-lg border border-ink-200 bg-white p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  period === p ? 'bg-rojo-500 text-white' : 'text-ink-500 hover:bg-ink-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Ventas del período" value={formatPrice(salesTotal)} trend={{ direction: 'up', label: '+18%' }} />
        <KpiCard label="Pedidos totales" value={String(orders.length)} trend={{ direction: 'up', label: '+11%' }} />
        <KpiCard label="Ticket medio" value={formatPrice(avgTicket)} trend={{ direction: 'up', label: '+5.2%' }} />
        <div className="admin-card p-5">
          <p className="text-sm text-ink-400">Top producto</p>
          <p className="mt-2 truncate text-xl font-bold text-ink-700">{topProduct?.name ?? '—'}</p>
          <p className="text-xs text-ink-400">{topProduct ? `${topProduct.qty} uds. vendidas` : 'Sin ventas todavía'}</p>
        </div>
      </div>

      <div className="admin-card mt-6 p-5">
        <p className="mb-4 font-semibold text-ink-700">Evolución de ventas diarias</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E8EC" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B6E7A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6E7A' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => formatPrice(v)} contentStyle={{ borderRadius: 10, border: '1px solid #E7E8EC', fontSize: 13 }} />
              <Line type="monotone" dataKey="ventas" stroke="#D42B00" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <p className="mb-2 font-semibold text-ink-700">Canales de venta</p>
          <div className="flex items-center gap-6">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {channelData.map((_, i) => (
                      <Cell key={i} fill={channelColors[i % channelColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm">
              {channelData.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channelColors[i % channelColors.length] }} />
                  <span className="text-ink-600">{c.name}</span>
                  <span className="font-semibold text-ink-700">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card p-5">
          <p className="mb-2 font-semibold text-ink-700">Productos por unidades vendidas</p>
          <div className="space-y-2.5">
            {Array.from(categoryData.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([name, qty], i) => {
                const max = Math.max(...Array.from(categoryData.values()), 1);
                return (
                  <div key={name} className="flex items-center gap-3 text-sm">
                    <span className="w-28 truncate text-ink-600">{name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(qty / max) * 100}%`, backgroundColor: categoryColors[i % categoryColors.length] }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-ink-700">{qty}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="admin-card mt-6 overflow-hidden">
        <p className="p-5 pb-0 font-semibold text-ink-700">Ranking top 10 productos</p>
        <div className="scrollbar-thin mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-ink-100 text-xs text-ink-400">
              <tr>
                <th className="px-5 py-2.5 font-medium">#</th>
                <th className="px-5 py-2.5 font-medium">Producto</th>
                <th className="px-5 py-2.5 font-medium">Ventas (uds.)</th>
                <th className="px-5 py-2.5 font-medium">Ingresos</th>
                <th className="px-5 py-2.5 font-medium">% Web</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-ink-400">
                    Todavía no hay ventas registradas.
                  </td>
                </tr>
              ) : (
                topProducts.map((p, i) => (
                  <tr key={p.name} className="hover:bg-ink-50">
                    <td className="px-5 py-3 text-ink-400">{i + 1}</td>
                    <td className="px-5 py-3 font-semibold text-ink-700">{p.name}</td>
                    <td className="px-5 py-3 text-ink-600">{p.qty}</td>
                    <td className="px-5 py-3 font-semibold text-ink-700">{formatPrice(p.revenue)}</td>
                    <td className="px-5 py-3 text-ink-500">{Math.round((p.web / p.qty) * 100)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
