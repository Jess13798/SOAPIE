const { sql, dbConfig } = require('./database');
const bcrypt = require('bcryptjs');

const validarEmpleado = async (usuario, PasswordEnviado) => {
    try {
        let pool = await sql.connect(dbConfig);

        // 1. Buscamos al empleado SOLO por el usuario
        let result = await pool.request()
            .input('user', sql.VarChar, usuario)
            .query(`
                SELECT  IdEmpleado,
                    Usuario,
                    Password,
                    LTRIM(RTRIM(
                        ISNULL(ApellidoPaterno, '') + ' ' +
                        ISNULL(ApellidoMaterno, '') + ' ' +
                        ISNULL(Nombres, '')
                    )) AS Empledo
                FROM Empleados
                WHERE Usuario = @user
            `);

        const empleado = result.recordset[0];

        // 2. Si el usuario existe, comparamos las contrasenas
        if (empleado) {
            // bcrypt.compare(Texto_Plano, Hash_Encriptado)
            const coinciden = await bcrypt.compare(PasswordEnviado, empleado.Password);

            if (coinciden) {
                return empleado; // Las contrasenas coinciden, login exitoso
            }
        }

        // 3. Si no existe el usuario o no coinciden, retornamos null
        return null;

    } catch (err) {
        console.error('Error en validacion de hash:', err);
        throw err;
    }
};

module.exports = validarEmpleado;
