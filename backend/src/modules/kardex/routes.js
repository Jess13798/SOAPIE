const express = require('express');
const kardexModule = require('./index');

const router = express.Router();

router.get('/kardex', async (req, res) => {
    try {
        const datos = await kardexModule.obtenerRegistros(req.query.idCuenta, req.query.fecha);
        res.json(datos);
    } catch (error) {
        const status = error.code === 'KARDEX_INVALID_INPUT' ? 400 : 500;
        if (status === 500) console.error('Error en /api/kardex:', error);
        res.status(status).json({ success: false, mensaje: error.message });
    }
});

router.post('/kardex', async (req, res) => {
    try {
        const resultado = await kardexModule.guardarRegistro(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        const status = error.code === 'KARDEX_INVALID_INPUT' ? 400 : 500;
        if (status === 500) console.error('Error al guardar /api/kardex:', error);
        res.status(status).json({ success: false, mensaje: error.message });
    }
});

module.exports = router;
