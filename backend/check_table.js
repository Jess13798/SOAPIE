// Script de diagnóstico: exporta el esquema de una tabla a JSON.
// Uso: node check_table.js
const { query, closePool } = require('./dbHelper');
const fs = require('fs');

async function run() {
  try {
      const result = await query(`
        SELECT COLUMN_NAME, DATA_TYPE, NUMERIC_PRECISION, NUMERIC_SCALE, CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'NotaEnfermeriaSignosVitales'
      `);
      fs.writeFileSync('out2.json', JSON.stringify(result.recordset, null, 2));
      console.log('Esquema exportado a out2.json');
  } catch (e) {
      console.error(e);
  }
  await closePool();
  process.exit(0);
}
run();
