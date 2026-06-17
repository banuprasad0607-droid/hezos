import { j as jspdf_node_minExports } from "../_libs/jspdf.mjs";
function cleanCSVCell(val) {
  if (val === null || val === void 0) return "";
  let stringified = String(val).replace(/"/g, '""');
  if (["=", "+", "-", "@"].some((prefix) => stringified.startsWith(prefix))) {
    stringified = `'${stringified}`;
  }
  return `"${stringified}"`;
}
function exportToCSV(filename, headers, rows) {
  const headerLine = headers.map(cleanCSVCell).join(",");
  const rowLines = rows.map((r) => r.map(cleanCSVCell).join(","));
  const csvContent = [headerLine, ...rowLines].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function exportToExcel(filename, headers, rows) {
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  html += `<head><meta charset="utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet 1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>`;
  html += `<body><table><thead><tr>`;
  headers.forEach((h) => {
    html += `<th style="background-color: #3c68d9; color: #ffffff; font-weight: bold; border: 1px solid #000000;">${h}</th>`;
  });
  html += `</tr></thead><tbody>`;
  rows.forEach((r) => {
    html += `<tr>`;
    r.forEach((cell) => {
      const cleanVal = cell === null || cell === void 0 ? "" : String(cell);
      html += `<td style="border: 1px solid #cccccc;">${cleanVal}</td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function exportToPDF(filename, title, headers, rows) {
  const doc = new jspdf_node_minExports.jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(60, 104, 217);
  doc.text(title, 14, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${/* @__PURE__ */ new Date().toLocaleDateString()}`, 14, 26);
  const startX = 14;
  let startY = 32;
  const colWidth = Math.floor(182 / headers.length);
  const rowHeight = 8;
  const pageHeight = 280;
  doc.setFillColor(60, 104, 217);
  doc.rect(startX, startY, colWidth * headers.length, rowHeight, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  headers.forEach((h, i) => {
    const truncatedHeader = String(h).substring(0, Math.floor(colWidth / 2));
    doc.text(truncatedHeader, startX + i * colWidth + 2, startY + 5);
  });
  startY += rowHeight;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(22, 22, 22);
  rows.forEach((row, rowIndex) => {
    if (startY + rowHeight > pageHeight) {
      doc.addPage();
      startY = 20;
    }
    if (rowIndex % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(startX, startY, colWidth * headers.length, rowHeight, "F");
    }
    row.forEach((cell, cellIndex) => {
      const cellVal = cell === null || cell === void 0 ? "" : String(cell);
      const cleanVal = cellVal.substring(0, Math.floor(colWidth / 1.8));
      doc.text(cleanVal, startX + cellIndex * colWidth + 2, startY + 5);
    });
    startY += rowHeight;
  });
  doc.save(`${filename}.pdf`);
}
export { exportToExcel as a, exportToPDF as b, exportToCSV as e };
