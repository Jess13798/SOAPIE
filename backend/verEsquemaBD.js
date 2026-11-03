// Herramienta de solo lectura: inspecciona la base de datos y genera
// docs/esquema-bd.md con tablas, columnas, tipos, claves primarias y foráneas.
//
// Uso:  node backend/verEsquemaBD.js
//
// No modifica nada en la base de datos: únicamente consulta catálogos del sistema.

const fs = require('fs');
const path = require('path');
const { dbConfig } = require('./src/config/db');
const sql = require('mssql');

const RUTA_SALIDA = path.join(__dirname, '..', 'docs', 'esquema-bd.md');

// Tablas y vistas que la aplicación usa directamente, con una descripción breve.
// Sirve para ubicar rápido lo relevante dentro de las ~700 tablas del sistema SIGH.
const TABLAS_APP = [
    { nombre: 'Empleados', descripcion: 'Usuarios del sistema (login). La contraseña se valida con bcrypt.' },
    { nombre: 'Servicios', descripcion: 'Servicios/áreas del hospital. El listado se filtra con IdTipoServicio = 3 (hospitalización).' },
    { nombre: 'Camas', descripcion: 'Camas por servicio y estado. De aquí se derivan los servicios y la ocupación.' },
    { nombre: 'EstadosCama', descripcion: 'Estados posibles de una cama (disponible, ocupada, etc.).' },
    { nombre: 'TiposCama', descripcion: 'Tipos de cama.' },
    { nombre: 'Pacientes', descripcion: 'Datos personales de los pacientes.' },
    { nombre: 'Atenciones', descripcion: 'Cuentas de atención (cada internamiento/consulta).' },
    { nombre: 'AtencionesEstanciaHospitalaria', descripcion: 'Estancias hospitalarias: servicio y cama por atención. Base de "Pacientes Sin Cama".' },
    { nombre: 'FacturacionCuentasAtencion', descripcion: 'Estado de facturación de la cuenta de atención.' },
    { nombre: 'Especialidades', descripcion: 'Especialidades médicas; se relacionan con Servicios.' },
    { nombre: 'Medicos', descripcion: 'Médicos; se relacionan con Empleados.' },
    { nombre: 'MedicosEspecialidad', descripcion: 'Relación médico ↔ especialidad/servicio.' },
    { nombre: 'Diagnosticos', descripcion: 'Catálogo de diagnósticos.' },
    { nombre: 'SubclasificacionDiagnosticos', descripcion: 'Subclasificación de diagnósticos.' },
    { nombre: 'AtencionesDiagnosticos', descripcion: 'Diagnósticos asociados a una atención.' },
    { nombre: 'NotaEnfermeria', descripcion: 'Notas de enfermería (tabla creada por este proyecto).' },
    { nombre: 'NotaEnfermeriaSignosVitales', descripcion: 'Signos vitales por nota (tabla creada por este proyecto).' },
];

// --- Consultas a los catálogos del sistema (SQL Server) ---

const Q_TABLAS = `
    SELECT s.name AS esquema, o.name AS tabla,
           CASE o.type WHEN 'U' THEN 'tabla' WHEN 'V' THEN 'vista' ELSE o.type_desc END AS objeto
    FROM sys.objects o
    JOIN sys.schemas s ON s.schema_id = o.schema_id
    WHERE o.type IN ('U', 'V')
    ORDER BY o.type, s.name, o.name;
`;

const Q_COLUMNAS = `
    SELECT
        s.name              AS esquema,
        t.name              AS tabla,
        c.column_id         AS orden,
        c.name              AS columna,
        ty.name             AS tipo,
        c.max_length        AS longitud_max,
        c.precision         AS precision,
        c.scale             AS escala,
        c.is_nullable       AS es_nulo,
        c.is_identity       AS es_identidad,
        dc.definition       AS por_defecto
    FROM sys.objects t
    JOIN sys.schemas s ON s.schema_id = t.schema_id
    JOIN sys.columns c ON c.object_id = t.object_id
    JOIN sys.types ty ON ty.user_type_id = c.user_type_id
    LEFT JOIN sys.default_constraints dc
           ON dc.parent_object_id = t.object_id
          AND dc.parent_column_id = c.column_id
    WHERE t.type IN ('U', 'V')
    ORDER BY s.name, t.name, c.column_id;
`;

const Q_PRIMARY_KEYS = `
    SELECT s.name AS esquema, t.name AS tabla, c.name AS columna
    FROM sys.indexes i
    JOIN sys.tables t ON t.object_id = i.object_id
    JOIN sys.schemas s ON s.schema_id = t.schema_id
    JOIN sys.index_columns ic
         ON ic.object_id = i.object_id AND ic.index_id = i.index_id
    JOIN sys.columns c
         ON c.object_id = ic.object_id AND c.column_id = ic.column_id
    WHERE i.is_primary_key = 1
    ORDER BY s.name, t.name, ic.key_ordinal;
`;

const Q_FOREIGN_KEYS = `
    SELECT
        fk.name AS nombre,
        sp.name AS esquema,
        tp.name AS tabla,
        cp.name AS columna,
        sr.name AS esquema_ref,
        tr.name AS tabla_ref,
        cr.name AS columna_ref
    FROM sys.foreign_keys fk
    JOIN sys.foreign_key_columns fkc
         ON fkc.constraint_object_id = fk.object_id
    JOIN sys.tables tp ON tp.object_id = fkc.parent_object_id
    JOIN sys.schemas sp ON sp.schema_id = tp.schema_id
    JOIN sys.columns cp
         ON cp.object_id = fkc.parent_object_id
        AND cp.column_id = fkc.parent_column_id
    JOIN sys.tables tr ON tr.object_id = fkc.referenced_object_id
    JOIN sys.schemas sr ON sr.schema_id = tr.schema_id
    JOIN sys.columns cr
         ON cr.object_id = fkc.referenced_object_id
        AND cr.column_id = fkc.referenced_column_id
    ORDER BY sp.name, tp.name, fk.name;
`;

// Formatea el tipo de dato tal como se ve en SQL Server.
function formatearTipo(col) {
    const tipo = col.tipo;
    if (['varchar', 'char', 'varbinary', 'binary'].includes(tipo)) {
        const len = col.longitud_max === -1 ? 'max' : col.longitud_max;
        return `${tipo}(${len})`;
    }
    if (['nvarchar', 'nchar'].includes(tipo)) {
        const len = col.longitud_max === -1 ? 'max' : col.longitud_max / 2;
        return `${tipo}(${len})`;
    }
    if (['decimal', 'numeric'].includes(tipo)) {
        return `${tipo}(${col.precision},${col.escala})`;
    }
    return tipo;
}

function limpiarDefecto(def) {
    if (def === null || def === undefined) return '';
    return String(def).replace(/^\(|\)$/g, '').replace(/\s+/g, ' ').trim();
}

async function main() {
    const pool = await sql.connect(dbConfig);

    try {
        const [tablas, columnas, pks, fks] = await Promise.all([
            pool.request().query(Q_TABLAS),
            pool.request().query(Q_COLUMNAS),
            pool.request().query(Q_PRIMARY_KEYS),
            pool.request().query(Q_FOREIGN_KEYS),
        ]);

        const filasTablas = tablas.recordset;
        const filasColumnas = columnas.recordset;
        const filasPk = pks.recordset;
        const filasFk = fks.recordset;

        // Índices auxiliares
        const pkPorTabla = new Map();
        for (const r of filasPk) {
            const clave = `${r.esquema}.${r.tabla}`;
            if (!pkPorTabla.has(clave)) pkPorTabla.set(clave, []);
            pkPorTabla.get(clave).push(r.columna);
        }

        const fkPorTabla = new Map();
        for (const r of filasFk) {
            const clave = `${r.esquema}.${r.tabla}`;
            if (!fkPorTabla.has(clave)) fkPorTabla.set(clave, []);
            fkPorTabla.get(clave).push(r);
        }

        const columnasPorTabla = new Map();
        for (const r of filasColumnas) {
            const clave = `${r.esquema}.${r.tabla}`;
            if (!columnasPorTabla.has(clave)) columnasPorTabla.set(clave, []);
            columnasPorTabla.get(clave).push(r);
        }

        const infoPorNombre = new Map();
        for (const t of filasTablas) infoPorNombre.set(t.tabla.toLowerCase(), t);

        const lineas = [];
        lineas.push('# Esquema de la base de datos');
        lineas.push('');
        lineas.push(`> Generado automáticamente desde \`${dbConfig.server}/${dbConfig.database}\``);
        lineas.push(`> el ${new Date().toLocaleString('es-PE')}.`);
        lineas.push('>');
        lineas.push('> Regenerar con: `node backend/verEsquemaBD.js`');
        lineas.push('');
        lineas.push(`**Totales:** ${filasTablas.filter((t) => t.objeto === 'tabla').length} tablas y ${filasTablas.filter((t) => t.objeto === 'vista').length} vistas.`);
        lineas.push('');

        lineas.push('## Tablas que usa la aplicación');
        lineas.push('');
        lineas.push('Estas son las tablas y vistas que el código del proyecto consulta directamente:');
        lineas.push('');
        lineas.push('| Objeto | Tipo | Para qué se usa |');
        lineas.push('|---|---|---|');
        for (const item of TABLAS_APP) {
            const info = infoPorNombre.get(item.nombre.toLowerCase());
            const tipo = info ? info.objeto : '⚠️ no encontrada';
            const enlace = info ? `[\`${item.nombre}\`](#${item.nombre.toLowerCase()})` : `\`${item.nombre}\``;
            lineas.push(`| ${enlace} | ${tipo} | ${item.descripcion} |`);
        }
        lineas.push('');
        lineas.push('> Nota: `PacientesSinCama` y `UltimaEstancia` **no son tablas ni vistas**, sino **CTE** (`WITH ...`) definidas dentro de las consultas de `backend/src/modules/pacientes-sin-cama/repositories/pacientesSinCamaRepository.js`.');
        lineas.push('');

        lineas.push('## Índice de tablas');
        lineas.push('');
        for (const t of filasTablas) {
            const clave = `${t.esquema}.${t.tabla}`;
            const nCols = (columnasPorTabla.get(clave) || []).length;
            lineas.push(`- [\`${t.esquema}.${t.tabla}\`](#${t.tabla.toLowerCase()}) (${nCols} columnas)`);
        }
        lineas.push('');

        lineas.push('## Detalle de tablas y vistas');
        lineas.push('');

        for (const t of filasTablas) {
            const clave = `${t.esquema}.${t.tabla}`;
            const cols = columnasPorTabla.get(clave) || [];
            const pk = pkPorTabla.get(clave) || [];
            const fks = fkPorTabla.get(clave) || [];

            lineas.push(`### ${t.tabla}${t.objeto === 'vista' ? ' (vista)' : ''}`);
            lineas.push('');
            lineas.push(`Esquema: \`${t.esquema}\``);
            lineas.push('');
            lineas.push('| Columna | Tipo | Nulo | Identidad | Por defecto | Clave |');
            lineas.push('|---|---|---|---|---|---|');

            for (const c of cols) {
                const esPk = pk.includes(c.columna) ? 'PK' : '';
                lineas.push(
                    `| ${c.columna} | ${formatearTipo(c)} | ${c.es_nulo ? 'sí' : 'no'} | ${c.es_identidad ? 'sí' : ''} | ${limpiarDefecto(c.por_defecto)} | ${esPk} |`
                );
            }
            lineas.push('');

            if (fks.length > 0) {
                lineas.push('Claves foráneas:');
                lineas.push('');
                for (const fk of fks) {
                    lineas.push(
                        `- \`${fk.columna}\` → \`${fk.esquema_ref}.${fk.tabla_ref}.${fk.columna_ref}\` (${fk.nombre})`
                    );
                }
                lineas.push('');
            }
        }

        fs.mkdirSync(path.dirname(RUTA_SALIDA), { recursive: true });
        fs.writeFileSync(RUTA_SALIDA, lineas.join('\n'), 'utf8');

        // Resumen por consola
        console.log(`Base de datos: ${dbConfig.server}/${dbConfig.database}`);
        console.log(`Tablas encontradas: ${filasTablas.length}`);
        console.log(`Columnas totales: ${filasColumnas.length}`);
        console.log(`Claves foráneas: ${filasFk.length}`);
        console.log('');
        console.log('Esquema guardado en: ' + RUTA_SALIDA);
    } finally {
        await pool.close();
    }
}

main().catch((error) => {
    console.error('Error generando el esquema:', error.message);
    process.exit(1);
});
