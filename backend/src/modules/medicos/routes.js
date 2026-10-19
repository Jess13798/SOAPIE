// Rutas del módulo de médicos.
// Se monta en /api, por eso la ruta conserva su nombre completo.

const express = require('express');
const medicosModule = require('./index');

const router = express.Router();

// Ruta para obtener médicos.
// Con `especialidadId` devuelve los de esa especialidad; sin él (por ejemplo
// con el filtro "Todos los servicios") devuelve todos los médicos del hospital.
router.get('/medicos', async (req, res) => {
    try {
        const { especialidadId } = req.query || {};
        const datos = especialidadId
            ? await medicosModule.obtenerMedicosPorEspecialidad(especialidadId)
            : await medicosModule.obtenerTodosLosMedicos();
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/medicos:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
