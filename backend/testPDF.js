const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tickets/test.pdf');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(filePath));

doc.fontSize(20).text("Test PDF", { align: "center" });
doc.end();

console.log(`✅ PDF de prueba generado en: ${filePath}`);