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

test('listarMigraciones devuelve .sql ordenados', () => {
    const archivos = listarMigraciones();
    assert.ok(archivos.length >= 2);
    assert.ok(archivos.every((n) => n.toLowerCase().endsWith('.sql')));
    assert.deepEqual(
        archivos,
        [...archivos].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
    );
    assert.ok(archivos.includes('001-crear-tablas-notas.sql'));
    assert.ok(archivos.includes('006-kardex.sql'));
    assert.ok(archivos.includes('nota-enfermeria-plan-servicio.sql'));
    assert.ok(
        archivos.indexOf('001-crear-tablas-notas.sql')
        < archivos.indexOf('nota-enfermeria-plan-servicio.sql'),
        'la tabla de servicios planificados debe crearse después de NotaEnfermeria',
    );
    assert.ok(!archivos.includes('002-crear-tabla-auditoria-camas.sql'));
    assert.ok(!archivos.includes('003-crear-tabla-auditoria-detalle.sql'));
});

test('separarLotes parte el 001 real (que usa GO)', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const ruta = path.join(__dirname, '..', 'sql', '001-crear-tablas-notas.sql');
    const lotes = separarLotes(fs.readFileSync(ruta, 'utf8'));
    assert.ok(lotes.length >= 2);
    assert.ok(lotes.every((lote) => !/^[ \t]*GO[ \t]*;?[ \t]*$/im.test(lote)));
});

test('el esquema de notas persiste la puntuación Wong-Baker como campo nullable validado', () => {
    const sql = fs.readFileSync(
        path.join(__dirname, '..', 'sql', '001-crear-tablas-notas.sql'),
        'utf8',
    );
    assert.match(sql, /WongBakerScore\s+TINYINT\s+NULL/i);
    assert.match(sql, /CHECK\s*\(WongBakerScore IS NULL OR WongBakerScore IN \(0, 2, 4, 6, 8, 10\)\)/i);
    assert.match(sql, /COL_LENGTH\(N'dbo\.NotaEnfermeria', N'WongBakerScore'\)/i);
});

test('el esquema de notas crea una relación para los servicios planificados', () => {
    const sql = fs.readFileSync(
        path.join(__dirname, '..', 'sql', '001-crear-tablas-notas.sql'),
        'utf8',
    );
    assert.match(sql, /CREATE TABLE dbo\.NotaEnfermeriaPlanServicio/i);
    assert.match(sql, /FOREIGN KEY \(IdNotaEnfermeria\)[\s\S]*?REFERENCES dbo\.NotaEnfermeria/i);
    assert.match(sql, /FOREIGN KEY \(IdProducto\)[\s\S]*?REFERENCES dbo\.FactCatalogoServicios \(IdProducto\)/i);
    assert.match(sql, /CodigoServicio VARCHAR\(20\) NOT NULL/i);
    assert.match(sql, /NombreServicio VARCHAR\(255\) NOT NULL/i);
});

test('la migración incremental crea la relación de servicios planificados para bases existentes', () => {
    const sql = fs.readFileSync(
        path.join(__dirname, '..', 'sql', 'nota-enfermeria-plan-servicio.sql'),
        'utf8',
    );
    assert.match(sql, /IF OBJECT_ID\(N'dbo\.NotaEnfermeriaPlanServicio', N'U'\) IS NULL/i);
    assert.match(sql, /REFERENCES dbo\.NotaEnfermeria \(IdNotaEnfermeria\)/i);
    assert.match(sql, /REFERENCES dbo\.FactCatalogoServicios \(IdProducto\)/i);
});
