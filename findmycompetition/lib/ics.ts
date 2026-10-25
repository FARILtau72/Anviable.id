interface ICSEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  url?: string;
  location?: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatICSDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateICS(event: ICSEvent): string {
  const now = new Date();
  const uid = `${now.getTime()}-${Math.random().toString(36).slice(2)}@naviable.id`;
  const start = formatICSDate(event.startDate);
  const end = formatICSDate(event.endDate ?? event.startDate);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//naviable.id//naviable.id//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description.substring(0, 500))}`,
  ];

  if (event.url) lines.push(`URL:${event.url}`);
  if (event.location) lines.push(`LOCATION:${escapeICS(event.location)}`);

  lines.push("BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:Reminder: ${escapeICS(event.title)}`, "END:VALARM");
  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

export function downloadICS(event: ICSEvent): void {
  const content = generateICS(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(event: ICSEvent): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.startDate)}/${fmt(event.endDate ?? event.startDate)}`,
    details: event.description.substring(0, 500),
  });
  if (event.url) params.set("details", `${event.description.substring(0, 400)}\n\nLink: ${event.url}`);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
