import { useApp } from '../../state/AppContext';

export default function SchedulePage() {
  const { schedules } = useApp();

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:max-w-xl lg:py-16">
      <h1 className="text-center text-3xl font-extrabold uppercase tracking-wide text-brasa-900 sm:text-4xl">
        Horario
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-brasa-500">
        Estos son los días y horas en los que puedes recoger tu pedido.
      </p>

      <div className="card mt-8 divide-y divide-brasa-100">
        {schedules.map((s) => (
          <div key={s.day} className="flex items-center justify-between px-5 py-4">
            <span className="font-semibold text-brasa-700">{s.day}</span>
            <span className={`font-bold ${s.open ? 'text-pimenton-600' : 'text-brasa-300'}`}>
              {s.open ? `${s.openTime} - ${s.closeTime}` : 'Cerrado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
