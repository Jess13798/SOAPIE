const { sql, dbConfig } = require('./database');
const fs = require('fs');
async function run() {
  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.query(`
        SELECT COLUMN_NAME, DATA_TYPE, NUMERIC_PRECISION, NUMERIC_SCALE, CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'NotaEnfermeriaSignosVitales'
      `);
      fs.writeFileSync('out2.json', JSON.stringify(result.recordset, null, 2));
  } catch (e) {
      console.error(e);
  }
  process.exit(0);
}
run();
