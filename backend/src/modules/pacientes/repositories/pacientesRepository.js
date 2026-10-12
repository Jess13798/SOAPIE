// Repositorio de pacientes.
// Esta capa encapsula la consulta SQL y expone una interfaz para el servicio.
// La idea es esconder los detalles de SQL Server del dominio clínico.

const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function getPacientesByServicio(servicioId = null) {
    try {
        console.log('--- Ejecutando Query de Pacientes ---', { servicioId });

        let sqlQuery = `
            SELECT *
            FROM (
                SELECT DISTINCT
                    c.IdCama,
                    s.IdProducto,
                    p.IdPaciente,
                    CASE
                        WHEN p.IdPaciente IS NULL THEN NULL
                        ELSE a.IdCuentaAtencion
                    END AS IdCuentaAtencion,
                    REPLACE(c.Codigo, ' ', '') AS Codigo,
                    ec.Descripcion AS estadoCama,
                    t.Descripcion AS TipoCama,
                    UPPER(LTRIM(RTRIM(
                        ISNULL(p.ApellidoPaterno, '') + ' ' +
                        ISNULL(p.ApellidoMaterno, '') + ' ' +
                        ISNULL(p.PrimerNombre, '') + ' ' +
                        ISNULL(p.SegundoNombre, '') + ' ' +
                        ISNULL(p.TercerNombre, '')
                    ))) AS Pacientes,
                    p.NroHistoriaClinica,
                    ed.Edad,
                    ed.TipoEdad,
                    s.IdEspecialidad,
                    s.Nombre,
                    ROW_NUMBER() OVER (
                        PARTITION BY REPLACE(c.Codigo, ' ', '')
                        ORDER BY CASE WHEN c.IdEstadoCama = 1 THEN 2 ELSE 1 END
                    ) AS rn
                FROM Camas c
                LEFT JOIN EstadosCama ec ON ec.IdEstadoCama = c.IdEstadoCama
                LEFT JOIN TiposCama t ON t.IdTipoCama = c.IdTiposCama
                LEFT JOIN Pacientes p ON p.IdPaciente = c.IdPaciente
                LEFT JOIN Servicios s ON s.IdServicio = c.IdServicioPropietario
                LEFT JOIN (
                    SELECT a.IdPaciente, MAX(a.IdAtencion) AS IdCuentaAtencion
                    FROM Atenciones a
                    WHERE a.IdTipoServicio IN (3)
                    GROUP BY a.IdPaciente
                ) a ON a.IdPaciente = c.IdPaciente
                LEFT JOIN (
                    SELECT IdPaciente, Edad, TipoEdad
                    FROM (
                        SELECT a.IdPaciente, a.Edad,
                            tp.Descripcion AS TipoEdad,
                            ROW_NUMBER() OVER (
                                PARTITION BY a.IdPaciente
                                ORDER BY a.Edad DESC
                            ) AS rn
                        FROM Atenciones a WITH (NOLOCK)
                        INNER JOIN TiposEdad tp ON tp.IdTipoEdad = a.IdTipoEdad
                        WHERE IdTipoServicio = 3
                    ) x
                    WHERE rn = 1
                ) ed ON ed.IdPaciente = p.IdPaciente
                WHERE s.IdTipoServicio = 3
        `;

        const params = [];

        if (servicioId && servicioId !== 'todos') {
            params.push({
                name: 'ServicioId',
                type: sql.Int,
                value: Number(servicioId),
            });
            sqlQuery += ' AND c.IdServicioPropietario = @ServicioId ';
        }

        sqlQuery += `
            ) x
            WHERE rn = 1
            ORDER BY Codigo
        `;

        const result = await query(sqlQuery, params);
        console.log('Resultado obtenido (filas):', result.recordset.length);
        return result.recordset || [];
    } catch (error) {
        console.error('Error en pacientesRepository.getPacientesByServicio:', error.message);
        throw error;
    }
}

async function getServicios() {
    try {
        console.log('--- Ejecutando Query de Servicios ---');

        const result = await query(`
            SELECT 
                MAX(s.IdServicio) AS IdServicio,
                CASE 
                    WHEN s.Nombre LIKE '%GINECOLOGIA Y OBSTETRIC%' THEN 'HOSPITALIZACION GINECOLOGIA Y OBSTETRICIA'
                    ELSE s.Nombre 
                END AS Nombre
            FROM Camas c
            INNER JOIN Servicios s ON s.IdServicio = c.IdServicioPropietario
            WHERE s.IdTipoServicio = 3 AND s.Nombre IS NOT NULL
            GROUP BY 
                CASE 
                    WHEN s.Nombre LIKE '%GINECOLOGIA Y OBSTETRIC%' THEN 'HOSPITALIZACION GINECOLOGIA Y OBSTETRICIA'
                    ELSE s.Nombre 
                END
            ORDER BY Nombre
        `);

        return result.recordset || [];
    } catch (error) {
        console.error('Error en pacientesRepository.getServicios:', error.message);
        throw error;
    }
}

// Búsqueda global y ágil de pacientes para el buscador del frontend.
// Coincide por nombre completo, DNI (NroDocumento), historia clínica o número de cuenta.
// Devuelve, si la hay, la atención, el servicio actual y la cama/estancia del paciente.
//
// Estrategia de rendimiento: primero se buscan los IDs candidatos con filtros
// simples (sin subconsultas correlacionadas por fila) y recién después se
// enriquece cada resultado. Así no se aplican los OUTER APPLY a toda Pacientes.
//
// Importante: el "servicio actual" se calcula igual que en la tabla
// "Pacientes Sin Cama": se prioriza la estancia pendiente (LlegoAlServicio = 0
// con facturación en estado 12) y, si no la hay, la cama ocupada.
// Devuelve los IdPaciente candidatos cuando el texto parece un número, con
// retorno temprano para ser rápido: primero DNI (columna indexada), luego
// historia clínica y por último número de cuenta.
async function candidatosPorNumero(texto) {
    const params = [{ name: 'prefijo', type: sql.VarChar, value: `${texto}%` }];

    const dni = await query(
        `SELECT TOP 20 IdPaciente
         FROM Pacientes WITH (NOLOCK)
         WHERE NroDocumento LIKE @prefijo`, params);
    if (dni.recordset.length) return dni.recordset.map(r => r.IdPaciente);

    const historia = await query(
        `SELECT TOP 20 IdPaciente
         FROM Pacientes WITH (NOLOCK)
         WHERE CAST(NroHistoriaClinica AS varchar(20)) LIKE @prefijo`, params);
    if (historia.recordset.length) return historia.recordset.map(r => r.IdPaciente);

    const cuenta = await query(
        `SELECT DISTINCT TOP 20 IdPaciente
         FROM Atenciones WITH (NOLOCK)
         WHERE CAST(IdCuentaAtencion AS varchar(20)) LIKE @prefijo`, params);
    return cuenta.recordset.map(r => r.IdPaciente);
}

// Devuelve los IdPaciente candidatos por nombre. El escaneo (LIKE con comodín
// inicial sobre ~350k pacientes) es costoso, por eso solo se usa cuando el
// texto no es numérico. La primera rama prioriza a los hospitalizados para que
// no queden fuera del TOP por orden alfabético.
async function candidatosPorNombre(texto) {
    const nombreCompleto = `
        ISNULL(p.ApellidoPaterno, '') + ' ' +
        ISNULL(p.ApellidoMaterno, '') + ' ' +
        ISNULL(p.PrimerNombre, '') + ' ' +
        ISNULL(p.SegundoNombre, '') + ' ' +
        ISNULL(p.TercerNombre, '')`;

    const result = await query(`
        WITH candidatos AS (
            SELECT TOP 20 p.IdPaciente
            FROM Pacientes p
            WHERE (${nombreCompleto}) LIKE @like
              AND (
                  EXISTS (SELECT 1 FROM Camas c WHERE c.IdPaciente = p.IdPaciente)
                  OR EXISTS (
                      SELECT 1
                      FROM AtencionesEstanciaHospitalaria e
                      INNER JOIN Atenciones a ON a.IdCuentaAtencion = e.IdAtencion
                      WHERE a.IdPaciente = p.IdPaciente
                        AND a.idEstadoAtencion = 1
                        AND e.LlegoAlServicio = 0
                  )
              )
            UNION ALL
            SELECT TOP 20 p.IdPaciente
            FROM Pacientes p
            WHERE (${nombreCompleto}) LIKE @like
        )
        SELECT DISTINCT IdPaciente FROM candidatos
    `, [{ name: 'like', type: sql.VarChar, value: `%${texto}%` }]);

    return result.recordset.map(r => r.IdPaciente);
}

// Completa los datos de los candidatos: servicio actual (estancia pendiente de
// cama o cama ocupada) y cuenta/cama, dejando a los hospitalizados primero.
async function enriquecerCandidatos(ids) {
    if (!ids.length) return [];

    const params = ids.map((id, i) => ({ name: `id${i}`, type: sql.Int, value: id }));
    const inList = ids.map((_, i) => `@id${i}`).join(', ');

    const result = await query(`
        SELECT TOP 20
            p.IdPaciente,
            LTRIM(RTRIM(
                ISNULL(p.ApellidoPaterno, '') + ' ' +
                ISNULL(p.ApellidoMaterno, '') + ' ' +
                ISNULL(p.PrimerNombre, '') + ' ' +
                ISNULL(p.SegundoNombre, '') + ' ' +
                ISNULL(p.TercerNombre, '')
            )) AS Paciente,
            p.NroDocumento AS Dni,
            p.NroHistoriaClinica AS Historia,
            COALESCE(pendiente.IdServicio, cama.IdServicioPropietario) AS IdServicio,
            COALESCE(spendiente.Nombre, scama.Nombre) AS Servicio,
            CASE WHEN pendiente.Cuenta IS NULL THEN cama.Codigo ELSE NULL END AS Cama,
            COALESCE(pendiente.Cuenta, atencion.IdCuentaAtencion) AS IdCuentaAtencion
        FROM Pacientes p
        OUTER APPLY (
            -- Estancia pendiente de cama (paciente sin cama), la misma que usa
            -- la tabla "Pacientes Sin Cama".
            SELECT TOP 1 e.IdAtencion AS Cuenta, e.IdServicio
            FROM AtencionesEstanciaHospitalaria e
            INNER JOIN Atenciones a ON a.IdCuentaAtencion = e.IdAtencion
            INNER JOIN FacturacionCuentasAtencion f ON f.IdCuentaAtencion = a.IdCuentaAtencion
            WHERE a.IdPaciente = p.IdPaciente
              AND a.idEstadoAtencion = 1
              AND e.LlegoAlServicio = 0
              AND f.IdEstado = 12
            ORDER BY e.Secuencia DESC, e.FechaOcupacion DESC
        ) pendiente
        LEFT JOIN Servicios spendiente ON spendiente.IdServicio = pendiente.IdServicio
        OUTER APPLY (
            SELECT TOP 1 c.IdCama, c.Codigo, c.IdServicioPropietario
            FROM Camas c
            WHERE c.IdPaciente = p.IdPaciente
            ORDER BY c.IdCama DESC
        ) cama
        LEFT JOIN Servicios scama ON scama.IdServicio = cama.IdServicioPropietario
        OUTER APPLY (
            SELECT TOP 1 a.IdAtencion, a.IdCuentaAtencion
            FROM Atenciones a
            WHERE a.IdPaciente = p.IdPaciente AND a.idEstadoAtencion = 1
            ORDER BY a.FechaIngreso DESC, a.IdAtencion DESC
        ) atencion
        WHERE p.IdPaciente IN (${inList})
        ORDER BY
            CASE WHEN COALESCE(pendiente.IdServicio, cama.IdServicioPropietario) IS NOT NULL THEN 0 ELSE 1 END,
            p.ApellidoPaterno, p.ApellidoMaterno, p.PrimerNombre;
    `, params);

    return result.recordset || [];
}

// Búsqueda global y ágil de pacientes para el buscador del frontend.
// Coincide por nombre completo o por DNI / historia clínica / número de cuenta
// y devuelve, si la hay, la atención, el servicio actual y la cama/estancia.
async function buscarPacientes(texto) {
    try {
        const esNumerico = /^[0-9]+$/.test(texto);
        const ids = esNumerico
            ? await candidatosPorNumero(texto)
            : await candidatosPorNombre(texto);
        return await enriquecerCandidatos(ids);
    } catch (error) {
        console.error('Error en pacientesRepository.buscarPacientes:', error.message);
        throw error;
    }
}

module.exports = {
    getPacientesByServicio,
    getServicios,
    buscarPacientes,
};
