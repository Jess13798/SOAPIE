// Rutas del módulo de pacientes y catálogo de servicios.
// Se monta en /api, por eso las rutas conservan su nombre completo.

const express = require('express');
const pacientesModule = require('./index');

const router = express.Router();

// Ruta para Pacientes (Lista de pacientes desde BD)
// Acepta parámetro opcional ?servicioId=xxx
router.get('/pacientes', async (req, res) => {
    try {
        const servicioId = req.query.servicioId;
        const datos = await pacientesModule.obtenerPacientes(servicioId);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/pacientes:', err);
        const detalle = err?.code ? `${err.code}: ${err.message}` : err.message;
        res.status(500).json({ success: false, mensaje: 'Error al cargar pacientes', detalle });
    }
});

// Ruta para obtener lista de servicios
router.get('/servicios', async (req, res) => {
    try {
        const datos = await pacientesModule.obtenerServicios();
        res.json(datos);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

module.exports = router;
