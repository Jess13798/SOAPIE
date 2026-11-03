const express = require('express');
const balanceHidricoModule = require('./index');

const router = express.Router();

// Obtener registros de balance hídrico por atención (cuenta)
router.get('/balance-hidrico', async (req, res) => {
    try {
        const { idCuenta, fecha } = req.query;
        const datos = await balanceHidricoModule.obtenerRegistros(idCuenta, fecha);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/balance-hidrico:', err);
        res.status(500).json({ success: false, mensaje: 'Error al cargar balance hídrico', detalle: err.message });
    }
});

// Guardar un registro de balance hídrico
router.post('/balance-hidrico', async (req, res) => {
    try {
        const resultado = await balanceHidricoModule.guardarRegistro(req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Eliminar un registro
router.delete('/balance-hidrico/:id', async (req, res) => {
    try {
        const resultado = await balanceHidricoModule.eliminarRegistro(req.params.id);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

module.exports = router;
