const { sql, dbConfig } = require('./database');

const obtenerPacientes = async (servicioId = null) => {
	try {
		console.log("--- Ejecutando Query de Pacientes ---", { servicioId });
		let pool = await sql.connect(dbConfig);
		const request = pool.request();
		request.timeout = 60000; // 60s para esta consulta

		let query = `
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
					  UPPER(  LTRIM(RTRIM(
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
					 left join (   SELECT a.IdPaciente,  MAX(a.IdAtencion) AS IdCuentaAtencion
                 FROM Atenciones a
                 WHERE a.IdTipoServicio IN (3)
                 GROUP BY a.IdPaciente) a on a.IdPaciente=c.IdPaciente
				LEFT JOIN (SELECT IdPaciente, Edad, TipoEdad
					FROM (SELECT a.IdPaciente,a.Edad,
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

		// Agregar filtro por servicio si se especifica
		if (servicioId && servicioId !== 'todos') {
			request.input('ServicioId', sql.Int, Number(servicioId));
			query += ` AND c.IdServicioPropietario = @ServicioId `;
		}

		query += `
			) x
			WHERE rn = 1
			ORDER BY Codigo
		`;

		let result = await request.query(query);

		console.log("Resultado obtenido (filas):", result.recordset.length);
		return result.recordset;
	} catch (err) {
		console.error("Error en consulta pacientes.js:", err);
		throw err;
	}
};

// Nueva función para obtener lista de servicios
/*const obtenerServicios = async () => {
	try {
		console.log("--- Ejecutando Query de Servicios ---");
		let pool = await sql.connect(dbConfig);

		let result = await pool.request().query(`
			SELECT DISTINCT s.IdServicio, s.Nombre 
			FROM Camas c
			LEFT JOIN Servicios s ON s.IdServicio = c.IdServicioPropietario
			WHERE s.IdServicio IS NOT NULL AND s.Nombre IS NOT NULL and s.idtiposervicio =3
			ORDER BY s.Nombre
		`);

		console.log("Servicios obtenidos:", result.recordset.length);
		return result.recordset;
	} catch (err) {
		console.error("Error en consulta servicios:", err);
		throw err;
	}
};*/

const obtenerServicios = async () => {
	try {
		console.log("--- Ejecutando Query de Servicios ---");
		let pool = await sql.connect(dbConfig);

		let result = await pool.request().query(`
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

		return result.recordset;
	} catch (err) {
		console.error("Error en consulta servicios:", err);
		throw err;
	}
};


module.exports = { obtenerPacientes, obtenerServicios };
