export type ExportRow = Record<string, string | number | null | undefined>;

function csvCell(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, rows: ExportRow[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.map(csvCell).join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function printPdfReport(title: string, rows: ExportRow[]) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const table = `
    <table>
      <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${headers.map((header) => `<td>${row[header] ?? ""}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;
  const popup = window.open("", "_blank", "width=1024,height=768");
  if (!popup) return;

  popup.document.write(`
    <html lang="th">
      <head>
        <title>${title}</title>
        <style>
          body { font-family: "Noto Sans Thai", "Sarabun", Arial, sans-serif; padding: 24px; color: #0f172a; }
          h1 { font-size: 22px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background: #e0f2fe; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${table}
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}
