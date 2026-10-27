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

// Permite ademas los tuneles publicos (ngrok, cloudflare) para compartir
// la app sin desplegarla. El acceso sigue protegido por el token de login.
function esOrigenPermitido(origin) {
    if (!origin) return true;
    if (ORIGENES_PERMITIDOS.includes(origin)) return true;
    return /trycloudflare\.com$|ngrok(-free)?\.app$|ngrok\.io$|ngrok-free\.dev$/i.test(origin);
}

// Bloquea de forma explícita los orígenes no permitidos (403) antes de procesar nada.
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && !esOrigenPermitido(origin)) {
        return res.status(403).json({ success: false, mensaje: 'Origen no permitido (CORS).' });
    }
    next();
});

app.use(cors({ origin: (origin, cb) => cb(null, esOrigenPermitido(origin)) }));
app.use(express.json());

// En produccion se sirve el build del frontend (frontend/dist). En desarrollo
// el frontend corre en Vite (5173) y este static es solo respaldo.
const frontendDir = require('fs').existsSync(path.join(__dirname, '../frontend/dist'))
    ? path.join(__dirname, '../frontend/dist')
    : path.join(__dirname, '../frontend');
app.use(express.static(frontendDir));

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
