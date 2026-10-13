// Rutas del módulo de notas de enfermería y signos vitales.
// Se monta en /api, por eso las rutas conservan su nombre completo.

const express = require('express');
const notasModule = require('./index');

const router = express.Router();

// Obtener todas las notas
router.get('/notas', async (req, res) => {
    try {
        const datos = await notasModule.obtenerNotas();
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/notas:', err);
        const detalle = err?.code ? `${err.code}: ${err.message}` : err.message;
        res.status(500).json({ success: false, mensaje: 'Error al cargar notas', detalle });
    }
});

// Guardar o actualizar una nota
router.post('/notas', async (req, res) => {
    try {
        const nota = req.body;
        const resultado = await notasModule.guardarNota(nota);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Eliminar una nota
router.delete('/notas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await notasModule.eliminarNota(id);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Obtener historial de signos vitales de una nota con paginación
router.get('/notas/:id/vitals', async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const datos = await notasModule.obtenerHistorialVitals(id, limit, offset);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/notas/:id/vitals:', err);
        res.status(500).json({ success: false, mensaje: 'Error al cargar historial de vitales' });
    }
});

// Obtener historial de signos vitales de una atención (cuenta) con paginación
router.get('/atenciones/:idCuenta/vitals', async (req, res) => {
    try {
        const { idCuenta } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const datos = await notasModule.obtenerHistorialVitalsPorAtencion(idCuenta, limit, offset);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/atenciones/:idCuenta/vitals:', err);
        res.status(500).json({ success: false, mensaje: 'Error al cargar historial de vitales' });
    }
});

module.exports = router;
