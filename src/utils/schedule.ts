import type { DaySchedule } from '../types';

const ALL_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_ABBR: Record<string, string> = {
  Lunes: 'Lun',
  Martes: 'Mar',
  Miércoles: 'Mié',
  Jueves: 'Jue',
  Viernes: 'Vie',
  Sábado: 'Sáb',
  Domingo: 'Dom',
};

// Short "Mié - Dom · 9:00 a 16:00" style summary for the site header, derived
// from the real opening schedule rather than a hardcoded string.
export function scheduleSummary(schedules: DaySchedule[]): string {
  const open = ALL_DAYS.map((d) => schedules.find((s) => s.day === d)).filter(
    (s): s is DaySchedule => !!s && s.open
  );
  if (open.length === 0) return 'Cerrado esta semana';

  const first = open[0];
  const last = open[open.length - 1];
  const range = first.day === last.day ? DAY_ABBR[first.day] : `${DAY_ABBR[first.day]} - ${DAY_ABBR[last.day]}`;
  return `${range} · ${first.openTime} a ${first.closeTime}`;
}

// Full-name version for the footer: "Miércoles a Domingo" + "9:00 - 16:00".
export function scheduleRangeLabel(schedules: DaySchedule[]): { days: string; hours: string } {
  const open = ALL_DAYS.map((d) => schedules.find((s) => s.day === d)).filter(
    (s): s is DaySchedule => !!s && s.open
  );
  if (open.length === 0) return { days: 'Cerrado esta semana', hours: '' };

  const first = open[0];
  const last = open[open.length - 1];
  const days = first.day === last.day ? first.day : `${first.day} a ${last.day}`;
  return { days, hours: `${first.openTime} - ${first.closeTime}` };
}
