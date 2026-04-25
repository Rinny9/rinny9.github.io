import { useState } from "react";

const EVENTS = [
  { date: "2026-05-06", label: "ER1", time: "0800–1800", location: "Lakeridge Health Ajax/Pickering", locColor: "#6EAF5E" },
  { date: "2026-05-08", label: "OR1", time: "0700–1500", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
  { date: "2026-05-11", label: "OR2", time: "0700–1500", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
  { date: "2026-05-14", label: "ER2", time: "0800–1800", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
  { date: "2026-05-15", label: "IV (2)", time: "0700–1500", location: "Lakeridge Health Ajax/Pickering", locColor: "#6EAF5E" },
  { date: "2026-05-22", label: "ICU", time: "0700–1900", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
  { date: "2026-05-25", label: "ER3", time: "0800–1800", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
  { date: "2026-05-26", label: "L&D", time: "0700–1500", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
  { date: "2026-06-01", label: "Clinical Residency", time: "TBD", location: "Lakeridge Health Ajax/Pickering", locColor: "#6EAF5E" },
  { date: "2026-06-08", label: "Base Hosp. Cert.", time: "TBD", location: "Durham College / Online", locColor: "#9B84C4" },
  { date: "2026-07-05", label: "OR3", time: "0700–1500", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
  { date: "2026-07-21", label: "OR4", time: "0700–1500", location: "Lakeridge Health Oshawa", locColor: "#6A9FD8" },
];

const LOCATIONS = [
  { name: "Lakeridge Health Oshawa", color: "#6A9FD8" },
  { name: "Lakeridge Health Ajax/Pickering", color: "#6EAF5E" },
  { name: "Durham College / Online", color: "#9B84C4" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthData(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function pad(n) { return n < 10 ? "0" + n : "" + n; }

function MonthCalendar({ year, month, monthName, hoveredEvent, setHoveredEvent }) {
  const { firstDay, daysInMonth } = getMonthData(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  if (rows.length && rows[rows.length - 1].length < 7)
    while (rows[rows.length - 1].length < 7) rows[rows.length - 1].push(null);

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700,
        color: "#1a1a2e", marginBottom: 10, letterSpacing: "-0.01em",
      }}>{monthName} {year}</h2>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1,
        background: "#d1d5db", borderRadius: 10, overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        {DAYS.map(d => (
          <div key={d} style={{
            background: "#f0f1f4", padding: "8px 0", textAlign: "center",
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 11,
            color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>{d}</div>
        ))}
        {rows.flat().map((day, i) => {
          const dateStr = day ? `${year}-${pad(month + 1)}-${pad(day)}` : null;
          const dayEvents = dateStr
            ? EVENTS.filter(e => e.date === dateStr || e.date === dateStr + "b")
            : [];
          const isWeekend = i % 7 === 0 || i % 7 === 6;

          return (
            <div key={i} style={{
              background: day ? (isWeekend ? "#f8f9fa" : "#fff") : "#f3f4f6",
              minHeight: dayEvents.length > 1 ? 108 : 85,
              padding: "5px 5px", position: "relative",
            }}>
              {day && (
                <>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 12,
                    fontWeight: dayEvents.length ? 700 : 400,
                    color: dayEvents.length ? "#1a1a2e" : "#9ca3af", marginBottom: 3,
                  }}>{day}</div>
                  {dayEvents.map((ev, ei) => (
                    <div key={ei}
                      onMouseEnter={() => setHoveredEvent(ev.date + ev.label)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      style={{
                        background: ev.locColor, borderRadius: 5, padding: "3px 6px",
                        color: "#fff", fontFamily: "'Outfit', sans-serif",
                        fontSize: 10.5, fontWeight: 600, lineHeight: 1.3,
                        marginBottom: 2, cursor: "pointer", position: "relative",
                        transition: "transform 0.1s ease, box-shadow 0.1s ease",
                        ...(hoveredEvent === ev.date + ev.label
                          ? { transform: "scale(1.04)", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
                          : {}),
                      }}
                    >
                      {ev.label}
                      <div style={{ fontWeight: 400, fontSize: 9.5, opacity: 0.92 }}>{ev.time}</div>
                      {hoveredEvent === ev.date + ev.label && (
                        <div style={{
                          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                          transform: "translateX(-50%)", background: "#1e293b",
                          color: "#f1f5f9", borderRadius: 8, padding: "10px 14px",
                          fontFamily: "'Outfit', sans-serif", fontSize: 12,
                          lineHeight: 1.5, whiteSpace: "nowrap", zIndex: 100,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.22)", pointerEvents: "none",
                        }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{ev.label}</div>
                          <div style={{ opacity: 0.8 }}>{ev.time}</div>
                          <div style={{
                            marginTop: 4, paddingTop: 4,
                            borderTop: "1px solid rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", gap: 6,
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: ev.locColor, flexShrink: 0 }} />
                            <span>{ev.location}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AcpSchedule() {
  const [showList, setShowList] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif", maxWidth: 780,
      margin: "0 auto", padding: "28px 20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.14em", color: "#6A9FD8", marginBottom: 4,
        }}>ACP Clinical Schedule — Spring/Summer 2026</div>
        <h1 style={{
          fontSize: 28, fontWeight: 800, color: "#1a1a2e",
          margin: 0, letterSpacing: "-0.03em",
        }}>Rinaldo Gjergji</h1>
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: "6px 18px", marginBottom: 22,
        padding: "12px 16px", background: "#f8f9fb", borderRadius: 8,
        border: "1px solid #e8eaed",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#6b7280", width: "100%",
          marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em",
        }}>Locations</div>
        {LOCATIONS.map(loc => (
          <div key={loc.name} style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#374151",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: loc.color }} />
            <span style={{ fontWeight: 500 }}>{loc.name}</span>
          </div>
        ))}
      </div>

      <MonthCalendar year={2026} month={4} monthName="May" hoveredEvent={hoveredEvent} setHoveredEvent={setHoveredEvent} />
      <MonthCalendar year={2026} month={5} monthName="June" hoveredEvent={hoveredEvent} setHoveredEvent={setHoveredEvent} />
      <MonthCalendar year={2026} month={6} monthName="July" hoveredEvent={hoveredEvent} setHoveredEvent={setHoveredEvent} />

      <button onClick={() => setShowList(!showList)} style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
        color: "#6A9FD8", background: "#eef4fb", border: "1px solid #bdd4ee",
        borderRadius: 8, padding: "10px 18px", cursor: "pointer", marginBottom: 16,
      }}>
        {showList ? "Hide" : "Show"} List View
      </button>

      {showList && (
        <div style={{
          background: "#fafbfc", borderRadius: 10, padding: "16px 12px",
          border: "1px solid #e5e7eb", overflowX: "auto",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                {["Date", "Rotation", "Time", "Location"].map(h => (
                  <th key={h} style={{
                    padding: "8px 10px", fontWeight: 600, color: "#6b7280",
                    fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em",
                    textAlign: "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((ev, i) => {
                const realDate = ev.date.replace("b", "");
                const d = new Date(realDate + "T12:00:00");
                const formatted = d.toLocaleDateString("en-CA", {
                  weekday: "short", month: "short", day: "numeric",
                });
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px", fontWeight: 500, color: "#1a1a2e", whiteSpace: "nowrap" }}>{formatted}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={{
                        background: ev.locColor, color: "#fff", borderRadius: 4,
                        padding: "3px 9px", fontSize: 12, fontWeight: 600,
                      }}>{ev.label}</span>
                    </td>
                    <td style={{ padding: "10px", color: "#6b7280" }}>{ev.time}</td>
                    <td style={{ padding: "10px", color: "#374151", fontWeight: 500 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: 2,
                          background: ev.locColor, display: "inline-block", flexShrink: 0,
                        }} />
                        {ev.location}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 20, fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>
        Hover over a calendar event for full details. OR shifts: ask for subsequent start times after the first day.
      </div>
    </div>
  );
}
