// Rutas del módulo de facturación (despacho de servicios CPT, cuentas de atención y anulación).
// Se monta en /api, por eso la ruta conserva su nombre completo.
// Requiere los procedimientos nativos de SIGH en la base de datos sigh de GalenHos.

const express = require('express');
const facturacionModule = require('./index');

const router = express.Router();

// Registrar un CPT/insumo despachado en una orden de servicio ya creada.
router.post('/facturacion/servicio-despacho', async (req, res) => {
    const datos = req.body || {};
    const esVarianteRc = datos.variante === 'rc';

    try {
        const resultado = esVarianteRc
            ? await facturacionModule.agregarServicioDespachoRc(datos)
            : await facturacionModule.agregarServicioDespacho(datos);

        res.json({ success: true, variante: esVarianteRc ? 'rc' : 'completa', resultado });
    } catch (err) {
        console.error('Error en /api/facturacion/servicio-despacho:', err);
        const status = err?.code === 'FACTURACION_INVALID_INPUT' ? 400 : 500;
        res.status(status).json({
            success: false,
            mensaje: status === 400
                ? err.message
                : 'No se pudo registrar el despacho del servicio. Revisa el registro del servidor.',
        });
    }
});

// Consultar consumos y pagos por punto de carga de una cuenta
router.get('/facturacion/cuentas/:idCuenta/puntos-carga', async (req, res) => {
    const { idCuenta } = req.params;
    try {
        const datos = await facturacionModule.consultarCuentasAtencionPtos(idCuenta);
        res.json({ success: true, idCuenta: Number(idCuenta), datos });
    } catch (err) {
        console.error('Error en GET /api/facturacion/cuentas/:idCuenta/puntos-carga:', err);
        const status = err?.code === 'FACTURACION_INVALID_INPUT' ? 400 : 500;
        res.status(status).json({
            success: false,
            mensaje: status === 400 ? err.message : 'Error al consultar los puntos de carga de la cuenta.',
        });
    }
});

// Insertar o actualizar acumulado por punto de carga
router.post('/facturacion/cuentas/puntos-carga', async (req, res) => {
    const datos = req.body || {};
    try {
        const resultado = await facturacionModule.actualizarCuentasAtencionPtos(datos);
        res.json({ success: true, resultado });
    } catch (err) {
        console.error('Error en POST /api/facturacion/cuentas/puntos-carga:', err);
        const status = err?.code === 'FACTURACION_INVALID_INPUT' ? 400 : 500;
        res.status(status).json({
            success: false,
            mensaje: status === 400 ? err.message : 'Error al actualizar el punto de carga de la cuenta.',
        });
    }
});

// Actualizar importes globales de la cabecera de la cuenta
router.post('/facturacion/cuentas/actualiza-importes', async (req, res) => {
    const datos = req.body || {};
    try {
        const resultado = await facturacionModule.actualizarImportesCuenta(datos);
        res.json({ success: true, resultado });
    } catch (err) {
        console.error('Error en POST /api/facturacion/cuentas/actualiza-importes:', err);
        const status = err?.code === 'FACTURACION_INVALID_INPUT' ? 400 : 500;
        res.status(status).json({
            success: false,
            mensaje: status === 400 ? err.message : 'Error al actualizar importes de la cuenta.',
        });
    }
});

// Consultar comprobantes de pago de la cuenta
router.get('/facturacion/cuentas/:idCuenta/comprobantes-pago', async (req, res) => {
    const { idCuenta } = req.params;
    try {
        const datos = await facturacionModule.consultarComprobantesPagoPorCuenta(idCuenta);
        res.json({ success: true, idCuenta: Number(idCuenta), datos });
    } catch (err) {
        console.error('Error en GET /api/facturacion/cuentas/:idCuenta/comprobantes-pago:', err);
        const status = err?.code === 'FACTURACION_INVALID_INPUT' ? 400 : 500;
        res.status(status).json({
            success: false,
            mensaje: status === 400 ? err.message : 'Error al consultar los comprobantes de pago de la cuenta.',
        });
    }
});

// Consultar orden de servicio oficial de GalenHos
router.get('/facturacion/ordenes/:idOrden', async (req, res) => {
    const { idOrden } = req.params;
    try {
        const orden = await facturacionModule.obtenerOrdenServicioPorId(idOrden);
        if (!orden) {
            return res.status(404).json({ success: false, mensaje: 'Orden de servicio no encontrada.' });
        }
        res.json({ success: true, orden });
    } catch (err) {
        console.error('Error en GET /api/facturacion/ordenes/:idOrden:', err);
        const status = err?.code === 'FACTURACION_INVALID_INPUT' ? 400 : 500;
        res.status(status).json({
            success: false,
            mensaje: status === 400 ? err.message : 'Error al consultar la orden de servicio.',
        });
    }
});

// Anular orden de servicio de CPT (IdEstadoFacturacion = 9)
router.post('/facturacion/ordenes/:idOrden/anular', async (req, res) => {
    const { idOrden } = req.params;
    const { idEmpleado, observaciones } = req.body || {};
    try {
        const resultado = await facturacionModule.anularOrdenServicio({
            idOrden,
            idEmpleado,
            observaciones,
        });
        res.json(resultado);
    } catch (err) {
        console.error('Error en POST /api/facturacion/ordenes/:idOrden/anular:', err);
        const status = err?.code === 'FACTURACION_INVALID_INPUT' || err?.code === 'ORDEN_NOT_FOUND' ? 400 : 500;
        res.status(status).json({
            success: false,
            mensaje: status === 400 ? err.message : 'Error al anular la orden de servicio.',
        });
    }
});

module.exports = router;
