// Obligatoriedad y rangos de los signos vitales por servicio.
//
// La fuente única es frontend/src/modules/notas/signosVitales.json: la usan
// tanto esta validación del servidor como la pantalla, para que nunca se
// desincronicen.
//
// `porDefecto` aplica a los servicios sin configuración (comportamiento
// histórico: los diez campos son obligatorios, con los límites técnicos).
// `porServicio[id]` puede definir `obligatorios` (lista de campos) y `rangos`
// (min/max por campo). Los campos que no estén en `obligatorios` son opcionales.
//
// Las claves de los campos son las mismas que viajan en `signosVitales`
// de /api/notas. Los rangos de pediatría se basan en la hoja de funciones
// vitales (guías PALS) que está en docs/.
const config = require('../../../../frontend/src/modules/notas/signosVitales.json');

const CAMPOS = config.campos;

function configDeServicio(idServicio) {
    const id = String(idServicio ?? '').trim();
    return (id && config.porServicio && config.porServicio[id]) || config.porDefecto;
}

function camposObligatorios(idServicio) {
    return [...(configDeServicio(idServicio).obligatorios || config.porDefecto.obligatorios || CAMPOS)];
}

function rangosDe(idServicio) {
    return configDeServicio(idServicio).rangos || config.porDefecto.rangos || {};
}

function rangoDe(idServicio, campo) {
    const r = rangosDe(idServicio);
    return r && r[campo] ? r[campo] : null;
}

// Configuración que expone /api/notas/configuracion-signos-vitales.
function configuracion() {
    return {
        campos: [...config.campos],
        porDefecto: {
            obligatorios: [...config.porDefecto.obligatorios],
            rangos: config.porDefecto.rangos || {},
        },
        porServicio: Object.fromEntries(
            Object.entries(config.porServicio || {}).map(([id, c]) => [
                id,
                {
                    obligatorios: [...(c.obligatorios || [])],
                    rangos: c.rangos || {},
                },
            ]),
        ),
    };
}

module.exports = { CAMPOS, configDeServicio, camposObligatorios, rangosDe, rangoDe, configuracion };
