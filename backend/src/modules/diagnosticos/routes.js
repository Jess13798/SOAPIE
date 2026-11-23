// Rutas del módulo de diagnósticos.
// Se monta en /api, por eso la ruta conserva su nombre completo.

const express = require('express');
const diagnosticosModule = require('./index');

const router = express.Router();

// Ruta para obtener diagnósticos por cuenta de atención
router.get('/diagnosticos', async (req, res) => {
    try {
        const { idCuentaAtencion, codigo } = req.query || {};
        if (codigo) {
            const idDiagnostico = await diagnosticosModule.obtenerIdDiagnosticoPorCodigo(codigo);
            return res.json({ success: true, codigo, idDiagnostico });
        }
        if (!idCuentaAtencion) {
            return res.status(400).json({ success: false, mensaje: 'idCuentaAtencion o codigo es requerido' });
        }
        const datos = await diagnosticosModule.obtenerDiagnosticos(idCuentaAtencion);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/diagnosticos:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
