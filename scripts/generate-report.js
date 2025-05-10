import { fs, path } from 'zx';

export function saveTableToHTML(tableData) {
  const buildDir = 'build';
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true }); // Fix: Added recursive flag
  }

  const htmlContent = `
<html>
  <head>
    <title>Results Table</title>
    <style>
      table { font-family: Arial, sans-serif; border-collapse: collapse; width: 100%; }
      th { background-color: #f2f2f2; border: 1px solid #dddddd; text-align: left; padding: 8px; }
      td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
    </style>
  </head>
  <body>
    <h2>Results Table</h2>
    <table>
      <thead>
        <tr>
          ${Object.keys(tableData[0]).map(key => `<th>${key}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${tableData.map(row => `
          <tr>
            ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  </body>
</html>
  `;

  const outputPath = path.join(buildDir, 'index.html');
  fs.writeFileSync(outputPath, htmlContent);
}
