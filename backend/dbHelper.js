const sql = require('mssql');
const { dbConfig } = require('./database');

// Pool compartido para toda la app.
// Esto evita abrir una nueva conexión por cada consulta y centraliza
// la configuración de tiempo de espera y errores de SQL Server.
let poolInstance = null;

async function getPool() {
    if (!poolInstance) {
        poolInstance = await sql.connect(dbConfig);
    }
    return poolInstance;
}

async function closePool() {
    if (poolInstance) {
        await poolInstance.close();
        poolInstance = null;
    }
}

// Ejecuta una consulta SQL con parámetros nombrados.
// Ejemplo de uso:
//   await query('SELECT * FROM Tabla WHERE Id = @id', [
//     { name: 'id', type: sql.Int, value: 123 }
//   ]);
async function query(sqlText, params = []) {
    try {
        const pool = await getPool();
        const request = pool.request();

        params.forEach(({ name, type, value }) => {
            if (type !== undefined) {
                request.input(name, type, value);
            }
        });

        return await request.query(sqlText);
    } catch (error) {
        console.error('dbHelper.query error:', error);
        throw error;
    }
}

// Ejecuta un procedimiento almacenado con parámetros nombrados.
async function executeProcedure(procName, params = []) {
    try {
        const pool = await getPool();
        const request = pool.request();

        params.forEach(({ name, type, value }) => {
            if (type !== undefined) {
                request.input(name, type, value);
            }
        });

        return await request.execute(procName);
    } catch (error) {
        console.error(`dbHelper.executeProcedure [${procName}] error:`, error);
        throw error;
    }
}

module.exports = {
    getPool,
    closePool,
    query,
    executeProcedure,
};
