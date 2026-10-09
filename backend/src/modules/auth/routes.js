// Rutas del módulo de autenticación.
// POST /api/login  -> ruta PÚBLICA (no pasa por el middleware requiereAuth).

const express = require('express');
const { firmarToken } = require('../../../auth');
const validarEmpleado = require('../../../login');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { usuario, Password } = req.body;
    try {
        const empleado = await validarEmpleado(usuario, Password);
        if (empleado) {
            // Token firmado para proteger el resto de la API
            const token = firmarToken({
                usuario: empleado.Usuario,
                idEmpleado: empleado.IdEmpleado,
            });

            // Si lo encuentra, enviamos éxito y datos del usuario
            res.json({
                success: true,
                mensaje: 'Acceso concedido',
                token,
                usuario: empleado.Usuario,
                empleado: empleado.Empledo || '',
                idEmpleado: empleado.IdEmpleado,
            });
        } else {
            // Si no coincide, enviamos error 401 (No autorizado)
            res.status(401).json({ success: false, mensaje: 'Usuario o Password incorrectos' });
        }
    } catch (err) {
        // Respuesta amigable cuando el backend o la BD no estan disponibles
        console.error('Error en /api/login:', err);
        const mensajeAmigable = 'El sistema se esta actualizando, por favor espere unos minutos e intente nuevamente.';
        const esErrorDeConexion = ['ELOGIN', 'ESOCKET', 'ETIMEOUT', 'ECONNREFUSED'].includes(err?.code);
        const statusCode = esErrorDeConexion ? 503 : 500;
        res.status(statusCode).json({ success: false, mensaje: mensajeAmigable });
    }
});

module.exports = router;
