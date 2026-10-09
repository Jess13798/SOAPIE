const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors'); // <--- 1. AGREGAR ESTO

const pacientesModule = require('./src/modules/pacientes');
const validarEmpleado = require('./login');
const notasModule = require('./notas');
const pacienteSinCamaModule = require('./src/modules/pacientes-sin-cama');
const diagnosticosModule = require('./src/modules/diagnosticos');
const medicosModule = require('./src/modules/medicos');
const catalogosModule = require('./src/modules/catalogos');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // <--- 2. AGREGAR ESTO (Permite la conexión con el frontend)
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

// --- RUTAS DE LA API ---

function sendNotasError(res, err, message) {
    console.error(message, err);
    if (err?.code === 'NOTAS_INVALID_INPUT' || err?.code === 'CARE_PLAN_RELATION_INVALID') {
        return res.status(400).json({ success: false, mensaje: err.message });
    }
    if (err?.code === 'NOTA_NOT_FOUND') {
        return res.status(404).json({ success: false, mensaje: err.message });
    }

    const detalle = err?.code ? `${err.code}: ${err.message}` : err.message;
    return res.status(500).json({ success: false, mensaje: message, detalle });
}

// Ruta para el Login (POST)
app.post('/api/login', async (req, res) => {
    const { usuario, Password } = req.body;
    try {
        const empleado = await validarEmpleado(usuario, Password);
        if (empleado) {
            // Si lo encuentra, enviamos éxito y datos del usuario
            res.json({
                success: true,
                mensaje: 'Acceso concedido',
                usuario: empleado.Usuario,
                empleado: empleado.Empledo || '',
                idEmpleado: empleado.IdEmpleado
            });
        } else {
            // Si no coincide, enviamos error 401 (No autorizado)
            res.status(401).json({ success: false, mensaje: 'Usuario o Password incorrectos' });
        }
    } catch (err) {
        // Respuesta amigable cuando el backend o la BD no esta disponibles
        console.error('Error en /api/login:', err);
        const mensajeAmigable = 'El sistema se esta actualizando, por favor espere unos minutos e intente nuevamente.';
        const esErrorDeConexion = ['ELOGIN', 'ESOCKET', 'ETIMEOUT', 'ECONNREFUSED'].includes(err?.code);
        const statusCode = esErrorDeConexion ? 503 : 500;
        res.status(statusCode).json({ success: false, mensaje: mensajeAmigable });
    }
});

// Ruta para Pacientes (Lista de pacientes desde BD)
// Acepta parámetro opcional ?servicioId=xxx
app.get('/api/pacientes', async (req, res) => {
    try {
        const servicioId = req.query.servicioId;
        const datos = await pacientesModule.obtenerPacientes(servicioId);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/pacientes:', err);
        const detalle = err?.code ? `${err.code}: ${err.message}` : err.message;
        res.status(500).json({ success: false, mensaje: 'Error al cargar pacientes', detalle });
    }
});

// Ruta para obtener lista de servicios
app.get('/api/servicios', async (req, res) => {
    try {
        const datos = await pacientesModule.obtenerServicios();
        res.json(datos);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// Catálogo de demostración NANDA con resultados NOC e intervenciones NIC.
app.get('/api/catalogos/nanda-noc-nic', async (req, res) => {
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
        res.status(500).json({
            success: false,
            mensaje: 'No se pudo consultar el catálogo de demostración.',
        });
    }
});

// Rutas para Notas de Enfermería
// Obtener todas las notas
app.get('/api/notas', async (req, res) => {
    try {
        const datos = await notasModule.obtenerNotas();
        res.json(datos);
    } catch (err) {
        sendNotasError(res, err, 'Error al cargar notas');
    }
});

// Ruta para pacientes sin cama
app.get('/api/pacientes-sin-cama', async (req, res) => {
    try {
        const nombreServicio = req.query.servicio;
        const datos = await pacienteSinCamaModule.obtenerPacientesSinCama(nombreServicio);
        res.json(datos);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Ruta para asignar cama a paciente sin cama
app.post('/api/asignar-cama', async (req, res) => {
    try {
        const { IdPaciente, IdCuentaAtencion, IdCama, IdMedicoOrdena } = req.body || {};

        if (!IdPaciente || !IdCuentaAtencion || !IdCama) {
            return res.status(400).json({
                success: false,
                mensaje: 'IdPaciente, IdCuentaAtencion e IdCama son obligatorios'
            });
        }

        const resultado = await pacienteSinCamaModule.asignarCama({
            IdPaciente,
            IdCuentaAtencion,
            IdCama,
            IdMedicoOrdena
        });

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Ruta para mover paciente de una cama a otra
app.post('/api/mover-cama', async (req, res) => {
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
            IdCuentaAtencion
        });

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error: ' + err.message });
    }
});

// Ruta para obtener diagnósticos por cuenta de atención
app.get('/api/diagnosticos', async (req, res) => {
    try {
        const { idCuentaAtencion } = req.query || {};
        if (!idCuentaAtencion) {
            return res.status(400).json({ success: false, mensaje: 'idCuentaAtencion es requerido' });
        }
        const datos = await diagnosticosModule.obtenerDiagnosticos(idCuentaAtencion);
        res.json(datos);
    } catch (err) {
        console.error('Error en /api/diagnosticos:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor: ' + err.message });
    }
});

// Ruta para obtener médicos por especialidad
app.get('/api/medicos', async (req, res) => {
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

// Ruta para registrar transferencia de estancia
app.post('/api/transferencia-estancia', async (req, res) => {
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
            idPaciente
        });
        res.json({ success: true, ...resultado });
    } catch (err) {
        console.error('Error en /api/transferencia-estancia:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor: ' + err.message });
    }
});

// Guardar o actualizar una nota
app.post('/api/notas', async (req, res) => {
    try {
        const nota = req.body;
        const resultado = await notasModule.guardarNota(nota);
        res.json(resultado);
    } catch (err) {
        sendNotasError(res, err, 'Error al guardar nota');
    }
});

// Eliminar una nota
app.delete('/api/notas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await notasModule.eliminarNota(id);
        res.json(resultado);
    } catch (err) {
        sendNotasError(res, err, 'Error al eliminar nota');
    }
});

// Obtener historial de signos vitales de una nota con paginación
app.get('/api/notas/:id/vitals', async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const datos = await notasModule.obtenerHistorialVitals(id, limit, offset);
        res.json(datos);
    } catch (err) {
        sendNotasError(res, err, 'Error al cargar historial de vitales');
    }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
