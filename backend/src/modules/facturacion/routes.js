// Rutas del módulo de facturación (despacho de servicios CPT).
// Se monta en /api, por eso la ruta conserva su nombre completo.
// Requiere los procedimientos dbo.FacturacionServicioDespachoAgregar y su
// variante _Rc en la base de datos sigh de GalenHos.

const express = require('express');
const facturacionModule = require('./index');

const router = express.Router();

// Registrar un CPT/insumo despachado en una orden de servicio ya creada.
// Es parte del flujo interno de guardado de la nota; se expone como POST para
// que también pueda reutilizarse desde otros módulos.
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

module.exports = router;
