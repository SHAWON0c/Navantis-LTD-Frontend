import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventSeed = [
  { id: 1, title: "Sales Review", date: "2026-03-18", time: "10:30 AM", location: "Board Room" },
  { id: 2, title: "Depot Sync", date: "2026-03-21", time: "02:00 PM", location: "Online" },
  { id: 3, title: "Inventory Audit", date: "2026-03-25", time: "11:00 AM", location: "Warehouse" },
  { id: 4, title: "HR Briefing", date: "2026-03-29", time: "04:00 PM", location: "HQ" },
];

const toISODate = (year, month, day) => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

export default function CompanyCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthLabel = useMemo(
    () =>
      currentDate.toLocaleDateString([], {
        month: "long",
        year: "numeric",
      }),
    [currentDate]
  );

  const { year, month, firstDay, daysInMonth } = useMemo(() => {
    const yearValue = currentDate.getFullYear();
    const monthValue = currentDate.getMonth();
    const firstDayValue = new Date(yearValue, monthValue, 1).getDay();
    const daysInMonthValue = new Date(yearValue, monthValue + 1, 0).getDate();

    return {
      year: yearValue,
      month: monthValue,
      firstDay: firstDayValue,
      daysInMonth: daysInMonthValue,
    };
  }, [currentDate]);

  const cells = useMemo(() => {
    const leading = Array.from({ length: firstDay }, (_, idx) => ({ key: `lead-${idx}`, day: null }));
    const days = Array.from({ length: daysInMonth }, (_, idx) => ({
      key: `day-${idx + 1}`,
      day: idx + 1,
      iso: toISODate(year, month, idx + 1),
    }));

    return [...leading, ...days];
  }, [daysInMonth, firstDay, month, year]);

  const today = new Date();
  const todayIso = toISODate(today.getFullYear(), today.getMonth(), today.getDate());

  const eventsForMonth = eventSeed.filter((item) => {
    const date = new Date(item.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const eventMap = eventsForMonth.reduce((acc, item) => {
    acc[item.date] = acc[item.date] ? [...acc[item.date], item] : [item];
    return acc;
  }, {});

  const goPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Company Calendar</h1>
              <p className="mt-1 text-sm text-gray-500">Track schedules, meetings, and events.</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              <CalendarDays size={16} />
              {new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr,320px]">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrevMonth}
                className="rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-700 hover:bg-gray-100"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{monthLabel}</h2>
              <button
                type="button"
                onClick={goNextMonth}
                className="rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-700 hover:bg-gray-100"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
              {weekdayLabels.map((label) => (
                <div key={label} className="rounded-md bg-gray-50 py-2">
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {cells.map((cell) => {
                if (!cell.day) {
                  return <div key={cell.key} className="h-24 rounded-md border border-transparent" />;
                }

                const isToday = cell.iso === todayIso;
                const events = eventMap[cell.iso] || [];

                return (
                  <div
                    key={cell.key}
                    className={`h-24 rounded-md border p-2 text-left ${
                      isToday
                        ? "border-primary-300 bg-primary-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${isToday ? "text-primary-700" : "text-gray-700"}`}>
                      {cell.day}
                    </p>
                    <div className="mt-1 space-y-1">
                      {events.slice(0, 2).map((event) => (
                        <p
                          key={event.id}
                          className="truncate rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-700"
                          title={event.title}
                        >
                          {event.title}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            <p className="mb-3 mt-1 text-sm text-gray-500">This month overview</p>

            <div className="space-y-3">
              {eventsForMonth.length ? (
                eventsForMonth.map((event) => (
                  <div key={event.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <p className="flex items-center gap-1">
                        <Clock3 size={13} /> {new Date(event.date).toLocaleDateString()} - {event.time}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin size={13} /> {event.location}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No events scheduled for this month.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
