const sql = require('mssql');
const { query } = require('./dbHelper');
const bcrypt = require('bcryptjs');

const validarEmpleado = async (usuario, PasswordEnviado) => {
    try {
        // 1. Buscamos al empleado SOLO por el usuario
        const result = await query(`
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
            `, [
            { name: 'user', type: sql.VarChar, value: usuario }
        ]);

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
