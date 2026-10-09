// Rutas del módulo de médicos.
// Se monta en /api, por eso la ruta conserva su nombre completo.

const express = require('express');
const medicosModule = require('./index');

const router = express.Router();

// Ruta para obtener médicos por especialidad
router.get('/medicos', async (req, res) => {
    try {
        const { especialidadId } = req.query || {};
        if (!especialidadId) {
            return res.status(400).json({ success: false, mensaje: 'especialidadId es requerido' });
        }
        const datos = await medicosModule.obtenerMedicosPorEspecialidad(especialidadId);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/medicos:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
