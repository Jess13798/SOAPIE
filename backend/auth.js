// Autenticación por token firmado (HMAC-SHA256).
// Sin dependencias externas: usa el módulo crypto de Node.
//
// El token tiene el formato:  <payload_base64url>.<firma_base64url>
// y no es adivinable ni modificable sin conocer AUTH_SECRET.

const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET || 'cambiar-este-secreto-en-produccion';
const EXPIRACION_MS = 1000 * 60 * 60 * 8; // 8 horas

function firmarToken(payload) {
    const cuerpo = Buffer.from(
        JSON.stringify({ ...payload, exp: Date.now() + EXPIRACION_MS })
    ).toString('base64url');

    const firma = crypto
        .createHmac('sha256', SECRET)
        .update(cuerpo)
        .digest('base64url');

    return `${cuerpo}.${firma}`;
}

function verificarToken(token) {
    if (!token || typeof token !== 'string') return null;

    const [cuerpo, firma] = token.split('.');
    if (!cuerpo || !firma) return null;

    const firmaEsperada = crypto
        .createHmac('sha256', SECRET)
        .update(cuerpo)
        .digest('base64url');

    // Comparación en tiempo constante para evitar ataques de timing
    const a = Buffer.from(firma);
    const b = Buffer.from(firmaEsperada);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    try {
        const datos = JSON.parse(Buffer.from(cuerpo, 'base64url').toString('utf8'));
        if (!datos.exp || datos.exp < Date.now()) return null; // expirado
        return datos;
    } catch {
        return null;
    }
}

// Middleware de Express: exige un token válido en el header Authorization.
function requiereAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    const datos = verificarToken(token);
    if (!datos) {
        return res.status(401).json({
            success: false,
            mensaje: 'No autorizado. Inicie sesión nuevamente.',
        });
    }

    req.usuario = datos;
    next();
}

module.exports = { firmarToken, verificarToken, requiereAuth };
