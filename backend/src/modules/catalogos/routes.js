// Rutas del catálogo académico NANDA/NOC/NIC.
// Se monta en /api, por eso la ruta conserva su nombre completo.
// Requiere las tablas del catálogo (backend/sql/catalogo-nanda-noc-nic.sql).

const express = require('express');
const catalogosModule = require('./index');

const router = express.Router();

router.get('/catalogos/nanda-noc-nic', async (req, res) => {
    const buscar = typeof req.query.buscar === 'string' ? req.query.buscar.trim() : '';
    if (buscar.length > 100) {
        return res.status(400).json({
            success: false,
            mensaje: 'El texto de búsqueda no puede superar 100 caracteres.',
        });
    }

    try {
        const datos = await catalogosModule.buscarNandaNocNic(buscar);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/catalogos/nanda-noc-nic:', err);
        if (err?.number === 208) {
            return res.status(503).json({
                success: false,
                mensaje: 'No están instaladas las tablas del catálogo NANDA/NOC/NIC en la base de datos.',
            });
        }
        res.status(500).json({
            success: false,
            mensaje: 'No se pudo consultar el catálogo NANDA/NOC/NIC. Revisa el registro del servidor.',
        });
    }
});

module.exports = router;
