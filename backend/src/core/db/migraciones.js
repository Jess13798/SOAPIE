// Migraciones de esquema al arranque.
//
// Lee todos los `backend/sql/*.sql` en orden (numérico: 001, 002, ...) registra
// en `dbo.__migraciones` las que ya aplicó y ejecuta solo las nuevas. Así el
// sistema mantiene su esquema sin depender de un `cmd` manual.
//
// Requisitos de cada `.sql` de la carpeta:
//   - ser idempotente (IF OBJECT_ID / WHERE NOT EXISTS) para poder reintentar,
//   - opcionalmente usar `GO` como separador de lotes (aquí se parte).
//
// Si la base no está disponible o el login no puede crear tablas, se registra
// el error y el servidor sigue funcionando (no se cae).

const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const { getPool } = require('../../../dbHelper');

const CARPETA_SQL = path.join(__dirname, '../../../sql');

function listarMigraciones() {
    return fs
        .readdirSync(CARPETA_SQL)
        .filter((nombre) => /\.sql$/i.test(nombre))
        .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
}

// Separa un archivo en lotes por las líneas `GO` (que el driver no entiende).
function separarLotes(contenido) {
    return contenido
        .split(/^[ \t]*GO[ \t]*;?[ \t]*$/gim)
        .map((lote) => lote.trim())
        .filter(Boolean);
}

async function asegurarTablaControl(pool) {
    await pool.request().batch(`
        IF OBJECT_ID(N'dbo.__migraciones', N'U') IS NULL
        BEGIN
            CREATE TABLE dbo.__migraciones (
                Nombre     NVARCHAR(260) NOT NULL,
                AplicadaEn DATETIME NOT NULL
                    CONSTRAINT DF___migraciones_AplicadaEn DEFAULT (GETDATE()),
                CONSTRAINT PK___migraciones PRIMARY KEY (Nombre)
            );
        END
    `);
}

async function obtenerAplicadas(pool) {
    const resultado = await pool.request().query('SELECT Nombre FROM dbo.__migraciones');
    return new Set((resultado.recordset || []).map((fila) => fila.Nombre));
}

async function registrarAplicada(pool, nombre) {
    const request = pool.request();
    request.input('Nombre', sql.NVarChar(260), nombre);
    await request.query('INSERT INTO dbo.__migraciones (Nombre) VALUES (@Nombre)');
}

// Aplica las migraciones pendientes. Devuelve cuántas aplicó.
async function aplicarMigraciones({ log = console } = {}) {
    const pool = await getPool();
    await asegurarTablaControl(pool);
    const aplicadas = await obtenerAplicadas(pool);

    let aplicadasAhora = 0;

    for (const archivo of listarMigraciones()) {
        if (aplicadas.has(archivo)) continue;

        const contenido = fs.readFileSync(path.join(CARPETA_SQL, archivo), 'utf8');

        for (const lote of separarLotes(contenido)) {
            await pool.request().batch(lote);
        }

        await registrarAplicada(pool, archivo);
        aplicadasAhora += 1;
        log.log(`[migraciones] aplicada: ${archivo}`);
    }

    if (aplicadasAhora === 0) {
        log.log('[migraciones] esquema al día.');
    }

    return aplicadasAhora;
}

// Punto de entrada para `index.js`: nunca lanza, para no tumbar el servidor.
async function ejecutarMigracionesAlArrancar() {
    try {
        return await aplicarMigraciones();
    } catch (error) {
        console.error('[migraciones] error:', error.message);
        console.error('[migraciones] el servidor continúa; revisa permisos o los .sql de backend/sql.');
        return 0;
    }
}

module.exports = {
    aplicarMigraciones,
    ejecutarMigracionesAlArrancar,
    listarMigraciones,
    separarLotes,
};
