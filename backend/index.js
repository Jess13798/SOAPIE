const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors');

const { requiereAuth } = require('./auth');

// Routers por módulo clínico
const authRoutes = require('./src/modules/auth/routes');
const pacientesRoutes = require('./src/modules/pacientes/routes');
const notasRoutes = require('./src/modules/notas/routes');
const pacientesSinCamaRoutes = require('./src/modules/pacientes-sin-cama/routes');
const diagnosticosRoutes = require('./src/modules/diagnosticos/routes');
const medicosRoutes = require('./src/modules/medicos/routes');
const catalogosRoutes = require('./src/modules/catalogos/routes');

const { ejecutarMigracionesAlArrancar } = require('./src/core/db/migraciones');

const app = express();

// --- MIDDLEWARES ---
// CORS restringido a los orígenes permitidos (configurable con CORS_ORIGIN en .env).
const ORIGENES_PERMITIDOS = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

// Bloquea de forma explícita los orígenes no permitidos (403) antes de procesar nada.
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && !ORIGENES_PERMITIDOS.includes(origin)) {
        return res.status(403).json({ success: false, mensaje: 'Origen no permitido (CORS).' });
    }
    next();
});

app.use(cors({ origin: ORIGENES_PERMITIDOS }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

// --- RUTAS PÚBLICAS ---
// Solo /api/login. Debe ir ANTES del middleware de protección.
app.use('/api', authRoutes);

// --- PROTECCIÓN DE LA API ---
// A partir de aquí, TODAS las rutas /api requieren un token válido.
app.use('/api', requiereAuth);

// --- RUTAS PROTEGIDAS (por módulo) ---
app.use('/api', pacientesRoutes);
app.use('/api', notasRoutes);
app.use('/api', pacientesSinCamaRoutes);
app.use('/api', diagnosticosRoutes);
app.use('/api', medicosRoutes);
app.use('/api', catalogosRoutes);

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);

    // Aplica al vuelo las migraciones pendientes de `backend/sql`.
    // No bloquea el arranque ni tumba el servidor si la BD no responde.
    ejecutarMigracionesAlArrancar();
});
