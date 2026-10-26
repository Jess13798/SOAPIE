// Tests del módulo de migraciones.
// No tocan la base: solo pruebas de las funciones puras (listar / separar).
process.env.DOTENV_CONFIG_QUIET = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { listarMigraciones, separarLotes } = require('../src/core/db/migraciones');

test('separarLotes parte por lineas GO y descarta lotes vacios', () => {
    const sql = [
        'CREATE TABLE x (a int);',
        'GO',
        '',
        'PRINT ' + "'hola';",
        'GO',
    ].join('\n');

    const lotes = separarLotes(sql);
    assert.equal(lotes.length, 2);
    assert.match(lotes[0], /CREATE TABLE/);
    assert.equal(lotes[1], "PRINT 'hola';");
});

test('separarLotes no parte un GO dentro de un string', () => {
    const lotes = separarLotes("SELECT 'GO' AS x;");
    assert.equal(lotes.length, 1);
});

test('listarMigraciones devuelve .sql ordenados y con la migracion de auditoria', () => {
    const archivos = listarMigraciones();
    assert.ok(archivos.length >= 2);
    assert.ok(archivos.every((n) => n.toLowerCase().endsWith('.sql')));
    assert.deepEqual(
        archivos,
        [...archivos].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
    );
    assert.ok(archivos.includes('001-crear-tablas-notas.sql'));
    assert.ok(archivos.includes('002-crear-tabla-auditoria-camas.sql'));
});

test('separarLotes parte el 001 real (que usa GO)', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const ruta = path.join(__dirname, '..', 'sql', '001-crear-tablas-notas.sql');
    const lotes = separarLotes(fs.readFileSync(ruta, 'utf8'));
    assert.ok(lotes.length >= 2);
    assert.ok(lotes.every((lote) => !/^[ \t]*GO[ \t]*;?[ \t]*$/im.test(lote)));
});
