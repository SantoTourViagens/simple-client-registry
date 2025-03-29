
/**
 * Exports data to Excel format (.xls)
 * @param data Array of objects to export
 * @param filename Filename without extension
 */
export const exportToExcel = (data: any[], filename: string) => {
  console.log("Iniciando exportação em formato Excel com codificação UTF-8");
  
  // Create HTML content for Excel
  const headers = Object.keys(data[0] || {});
  
  // Create an HTML table with Excel compatibility
  let htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${filename}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table, td, th {
          border: 1px solid black;
          border-collapse: collapse;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add data rows
  data.forEach(row => {
    htmlContent += "<tr>";
    headers.forEach(header => {
      let cellValue = row[header]?.toString() || "";
      
      // Log original value for debugging
      if (cellValue.match(/[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/)) {
        console.log(`Valor original: '${cellValue}'`);
      }
      
      // Escape HTML characters
      cellValue = cellValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      
      htmlContent += `<td>${cellValue}</td>`;
    });
    htmlContent += "</tr>";
  });
  
  // Close HTML table
  htmlContent += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create a blob with UTF-8 encoding specified
  const blob = new Blob(["\uFEFF" + htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  
  // Create and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Attempt to open Excel automatically after download
  setTimeout(() => {
    const opened = attemptOpenExcel(url);
    console.log(opened ? "Excel aberto automaticamente" : "Excel não pôde ser aberto automaticamente");
  }, 1000);
  
  console.log("Exportação para Excel concluída com codificação UTF-8");
};

/**
 * Attempt to open Excel with the given file URL
 * @param url URL of the file to open
 * @returns boolean indicating success
 */
const attemptOpenExcel = (url: string) => {
  try {
    const excelUrl = `ms-excel:ofe|u|${url}`;
    window.location.href = excelUrl;
    console.log("Tentativa de abrir Excel automaticamente");
    return true;
  } catch (error) {
    console.error("Falha ao tentar abrir Excel:", error);
    return false;
  }
};

/**
 * Formats print view for A4 size with 1cm margins and no header/footer
 */
export const setupPrintStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      @page {
        size: A4;
        margin: 1cm;
      }
      body {
        margin: 0;
      }
      .print\\:m-\\[1cm\\] {
        margin: 1cm;
      }
      .no-print,
      header,
      footer,
      nav {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
};
