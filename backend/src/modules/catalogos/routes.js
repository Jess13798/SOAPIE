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

router.get('/catalogos/servicios', async (req, res) => {
    const buscar = typeof req.query.buscar === 'string' ? req.query.buscar.trim() : '';
    if (buscar.length < 2 || buscar.length > 100) {
        return res.status(400).json({
            success: false,
            mensaje: 'La búsqueda debe tener entre 2 y 100 caracteres.',
        });
    }

    const opciones = {};
    if (req.query.idPuntoCarga) opciones.idPuntoCarga = parseInt(req.query.idPuntoCarga, 10);
    if (req.query.idServicio) opciones.idServicio = parseInt(req.query.idServicio, 10);
    if (req.query.idTipoFinanciamiento) opciones.idTipoFinanciamiento = parseInt(req.query.idTipoFinanciamiento, 10);

    try {
        const datos = Object.keys(opciones).length > 0
            ? await catalogosModule.buscarServicios(buscar, opciones)
            : await catalogosModule.buscarServicios(buscar);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/catalogos/servicios:', err);
        if (err?.number === 208) {
            return res.status(503).json({
                success: false,
                mensaje: 'No está disponible la tabla dbo.FactCatalogoServicios en la base de datos.',
            });
        }
        res.status(500).json({
            success: false,
            mensaje: 'No se pudo consultar el catálogo de servicios. Revisa el registro del servidor.',
        });
    }
});

router.get('/catalogos/servicios/:idProducto/financiamiento', async (req, res) => {
    const idProducto = parseInt(req.params.idProducto, 10);
    const idTipoFinanciamiento = req.query.idTipoFinanciamiento 
        ? parseInt(req.query.idTipoFinanciamiento, 10) 
        : 2;

    if (isNaN(idProducto) || isNaN(idTipoFinanciamiento)) {
        return res.status(400).json({
            success: false,
            mensaje: 'Los identificadores de producto y financiamiento deben ser numéricos.',
        });
    }

    try {
        const datos = await catalogosModule.obtenerServicioPorFinanciamiento(idProducto, idTipoFinanciamiento);
        if (!datos) {
            return res.status(404).json({
                success: false,
                mensaje: 'No se encontró la configuración hospitalaria para el servicio y financiamiento especificados.',
            });
        }
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/catalogos/servicios/:idProducto/financiamiento:', err);
        res.status(500).json({
            success: false,
            mensaje: 'No se pudo consultar la configuración del servicio. Revisa el registro del servidor.',
        });
    }
});

const { obtenerFechaServidorSQL } = require('../../core/utils/date');

// Obtener fecha y hora oficial del servidor SQL Server
router.get('/fecha-servidor', async (req, res) => {
    try {
        const fecha = await obtenerFechaServidorSQL();
        res.json({
            success: true,
            fechaHoraSQL: fecha.toISOString(),
            fecha: fecha.toISOString().split('T')[0],
            hora: fecha.toISOString().substring(11, 16),
        });
    } catch (err) {
        console.error('Error en /api/fecha-servidor:', err);
        res.status(500).json({ success: false, mensaje: 'Error al obtener la fecha del servidor SQL.' });
    }
});

// Obtener datos del Tipo de Financiamiento (dbo.TiposFinanciamientoSeleccionarPorId)
router.get('/tipos-financiamiento/:idTipoFinanciamiento', async (req, res) => {
    const id = parseInt(req.params.idTipoFinanciamiento, 10);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, mensaje: 'El ID de financiamiento debe ser numérico.' });
    }
    try {
        const datos = await catalogosModule.obtenerTipoFinanciamientoPorId(id);
        if (!datos) {
            return res.status(404).json({ success: false, mensaje: 'Tipo de financiamiento no encontrado.' });
        }
        res.json({ success: true, datos });
    } catch (err) {
        console.error('Error en /api/tipos-financiamiento:', err);
        res.status(500).json({ success: false, mensaje: 'Error al consultar el tipo de financiamiento.' });
    }
});

module.exports = router;
