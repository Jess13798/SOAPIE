const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { sql, dbConfig } = require('./database');

const scripts = [
    'catalogo-nanda-noc-nic.sql',
    'nota-enfermeria-core.sql',
    'nota-enfermeria-diagnostico-comentario.sql',
    'nota-enfermeria-plan-cuidado.sql',
];

const expectedTables = [
    'Catalogo_NANDA',
    'Catalogo_NOC',
    'Catalogo_NIC',
    'NANDA_Interrelacion',
    'NotaEnfermeria',
    'NotaEnfermeriaSignosVitales',
    'NotaEnfermeriaDiagnostico',
    'NotaEnfermeriaPlanNOC',
    'NotaEnfermeriaPlanNIC',
];

async function main() {
    if (!dbConfig.server || !dbConfig.database || !dbConfig.user || !dbConfig.password) {
        throw new Error(
            'Falta configurar DB_SERVER, DB_NAME, DB_USER o DB_PASSWORD en backend/.env.',
        );
    }

    console.log(`Base de datos destino: ${dbConfig.database}`);
    console.log('Se crearán las tablas de prueba y se cargarán los datos de demostración del catálogo.');
    console.log('No se borrarán tablas ni datos existentes.');

    const prompt = readline.createInterface({ input: stdin, output: stdout });
    let confirmation;
    try {
        confirmation = await prompt.question(
            `Para continuar, escribe exactamente "${dbConfig.database}": `,
        );
    } finally {
        prompt.close();
    }

    if (confirmation !== dbConfig.database) {
        console.log('Cancelado. No se realizó ningún cambio en la base de datos.');
        return;
    }

    let pool;
    try {
        pool = await sql.connect(dbConfig);

        for (const [index, filename] of scripts.entries()) {
            const filePath = path.join(__dirname, 'sql', filename);
            const script = await fs.readFile(filePath, 'utf8');

            console.log(`[${index + 1}/${scripts.length}] Ejecutando ${filename}...`);
            await pool.request().batch(script);
            console.log(`      Listo: ${filename}`);
        }

        const tableList = expectedTables.map((_, index) => `@table${index}`).join(', ');
        const request = pool.request();
        expectedTables.forEach((table, index) => {
            request.input(`table${index}`, sql.NVarChar, table);
        });

        const result = await request.query(`
            SELECT t.name AS table_name
            FROM sys.tables AS t
            INNER JOIN sys.schemas AS s ON s.schema_id = t.schema_id
            WHERE s.name = N'dbo'
              AND t.name IN (${tableList})
        `);
        const foundTables = new Set(result.recordset.map((row) => row.table_name));
        const missingTables = expectedTables.filter((table) => !foundTables.has(table));

        if (missingTables.length > 0) {
            throw new Error(
                `La ejecución terminó, pero faltan estas tablas: ${missingTables.join(', ')}.`,
            );
        }

        console.log(`Verificación correcta: las ${expectedTables.length} tablas esperadas existen.`);
        console.log('Preparación de la base de datos completada.');
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

main().catch((error) => {
    console.error(`No se pudo preparar la base de datos: ${error.message}`);
    process.exitCode = 1;
});
