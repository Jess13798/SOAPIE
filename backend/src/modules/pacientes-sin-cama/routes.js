// Rutas del módulo de pacientes sin cama y gestión de camas/traslados.
// Se monta en /api, por eso las rutas conservan su nombre completo.

const express = require('express');
const pacienteSinCamaModule = require('./index');

const router = express.Router();

// Ruta para pacientes sin cama
router.get('/pacientes-sin-cama', async (req, res) => {
    try {
        const nombreServicio = req.query.servicio;
        const datos = await pacienteSinCamaModule.obtenerPacientesSinCama(nombreServicio);
        res.json(datos);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Ruta para asignar cama a paciente sin cama
router.post('/asignar-cama', async (req, res) => {
    try {
        const { IdPaciente, IdCuentaAtencion, IdCama, IdMedicoOrdena } = req.body || {};

        if (!IdPaciente || !IdCuentaAtencion || !IdCama) {
            return res.status(400).json({
                success: false,
                mensaje: 'IdPaciente, IdCuentaAtencion e IdCama son obligatorios'
            });
        }

        // El usuario se toma del token (no del body) para que la auditoría
        // no pueda falsearse desde el cliente.
        const resultado = await pacienteSinCamaModule.asignarCama({
            IdPaciente,
            IdCuentaAtencion,
            IdCama,
            IdMedicoOrdena,
            idUsuario: req.usuario?.idEmpleado ?? null,
            usuario: req.usuario?.usuario ?? null,
        });

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Ruta para mover paciente de una cama a otra
router.post('/mover-cama', async (req, res) => {
    try {
        const { IdPaciente, IdCama, IdCuentaAtencion } = req.body || {};

        if (!IdPaciente || !IdCama || !IdCuentaAtencion) {
            return res.status(400).json({
                success: false,
                mensaje: 'IdPaciente, IdCama e IdCuentaAtencion son obligatorios'
            });
        }

        const resultado = await pacienteSinCamaModule.moverPacienteDeCama({
            IdPaciente,
            IdCama,
            IdCuentaAtencion,
            idUsuario: req.usuario?.idEmpleado ?? null,
            usuario: req.usuario?.usuario ?? null,
        });

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Ruta para consultar el rastro de auditoría de camas
router.get('/auditoria-camas', async (req, res) => {
    try {
        const { fechaDesde, fechaHasta, servicioId, accion, usuario, limit } = req.query;
        const datos = await pacienteSinCamaModule.obtenerAuditoriaCamas({
            fechaDesde,
            fechaHasta,
            servicioId,
            accion,
            usuario,
            limit,
        });
        res.json(datos);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Ruta para registrar transferencia de estancia
router.post('/transferencia-estancia', async (req, res) => {
    try {
        const { idAtencion, idMedicoOrdena, idServicio, idDiagnostico, fechaOcupacion, horaOcupacion, idProducto, idEmpleado, fechaModificacion, idPaciente } = req.body || {};
        if (!idAtencion || !idServicio || !fechaOcupacion || !horaOcupacion) {
            return res.status(400).json({ success: false, mensaje: 'idAtencion, idServicio, fechaOcupacion y horaOcupacion son obligatorios' });
        }
        const resultado = await pacienteSinCamaModule.registrarTransferenciaEstancia({
            idAtencion,
            idMedicoOrdena,
            idServicio,
            idDiagnostico,
            fechaOcupacion,
            horaOcupacion,
            idProducto,
            idEmpleado,
            fechaModificacion,
            idPaciente,
            idUsuario: req.usuario?.idEmpleado ?? null,
            usuario: req.usuario?.usuario ?? null,
        });
        res.json({ success: true, ...resultado });
    } catch (err) {
        console.error('Error en /api/transferencia-estancia:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
