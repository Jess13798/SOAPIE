// Tests del modulo de autenticacion (firma/verificacion de tokens y middleware).
// Se fija AUTH_SECRET ANTES de requerir auth.js para que los tokens sean
// predecibles y el test no dependa del .env real.
process.env.AUTH_SECRET = 'secreto-solo-para-tests';
process.env.DOTENV_CONFIG_QUIET = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const { firmarToken, verificarToken, requiereAuth } = require('../auth');

// Construye un token valido/vencido con el mismo algoritmo de auth.js,
// usando el secreto de test. Sirve para probar la expiracion sin esperar 8h.
function construirToken(payload, exp) {
    const cuerpo = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
    const firma = crypto
        .createHmac('sha256', 'secreto-solo-para-tests')
        .update(cuerpo)
        .digest('base64url');
    return `${cuerpo}.${firma}`;
}

function respuestaFalsa() {
    return {
        codigo: null,
        cuerpo: null,
        status(codigo) {
            this.codigo = codigo;
            return this;
        },
        json(body) {
            this.cuerpo = body;
            return this;
        },
    };
}

test('firmarToken y verificarToken hacen round-trip del payload', () => {
    const token = firmarToken({ usuario: 'ana', idEmpleado: 5 });

    const datos = verificarToken(token);

    assert.equal(datos.usuario, 'ana');
    assert.equal(datos.idEmpleado, 5);
    assert.ok(datos.exp > Date.now(), 'debe incluir una expiracion futura');
});

test('verificarToken rechaza un token manipulado', () => {
    const token = firmarToken({ usuario: 'ana' });
    const [cuerpo, firma] = token.split('.');
    const manipulado = `${cuerpo.slice(0, -2)}xx.${firma}`;

    assert.equal(verificarToken(manipulado), null);
});

test('verificarToken rechaza un token con firma invalida', () => {
    const token = firmarToken({ usuario: 'ana' });
    const [cuerpo] = token.split('.');

    assert.equal(verificarToken(`${cuerpo}.firmafalsa`), null);
});

test('verificarToken rechaza un token expirado', () => {
    const vencido = construirToken({ usuario: 'ana' }, Date.now() - 1000);

    assert.equal(verificarToken(vencido), null);
});

test('verificarToken acepta un token aun vigente', () => {
    const vigente = construirToken({ usuario: 'ana' }, Date.now() + 60_000);

    assert.equal(verificarToken(vigente).usuario, 'ana');
});

test('verificarToken tolera entradas vacias o basura', () => {
    assert.equal(verificarToken(undefined), null);
    assert.equal(verificarToken(''), null);
    assert.equal(verificarToken('sin.punto'), null);
    assert.equal(verificarToken(12345), null);
});

test('requiereAuth sin cabecera responde 401 y no llama a next', () => {
    const req = { headers: {} };
    const res = respuestaFalsa();
    let nextLlamado = false;

    requiereAuth(req, res, () => {
        nextLlamado = true;
    });

    assert.equal(res.codigo, 401);
    assert.equal(res.cuerpo.success, false);
    assert.equal(nextLlamado, false);
});

test('requiereAuth con token valido deja pasar y expone req.usuario', () => {
    const token = firmarToken({ usuario: 'ana', idEmpleado: 5 });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = respuestaFalsa();
    let siguiente = false;

    requiereAuth(req, res, () => {
        siguiente = true;
    });

    assert.equal(siguiente, true, 'debe llamar a next()');
    assert.equal(res.codigo, null, 'no debe responder error');
    assert.equal(req.usuario.usuario, 'ana');
});

test('requiereAuth rechaza un token invalido con 401', () => {
    const req = { headers: { authorization: 'Bearer token.falso' } };
    const res = respuestaFalsa();
    let siguiente = false;

    requiereAuth(req, res, () => {
        siguiente = true;
    });

    assert.equal(siguiente, false);
    assert.equal(res.codigo, 401);
});
