// Obligatoriedad de los signos vitales por servicio.
//
// La fuente única es frontend/src/modules/notas/signosVitales.json: la usan
// tanto esta validación del servidor como la pantalla, para que nunca se
// desincronicen.
//
// Al CREAR una nota, el backend exige los campos configurados para el servicio.
// Un servicio sin configuración mantiene el comportamiento histórico: los diez
// campos son obligatorios. Los campos que no estén en la lista se siguen
// mostrando en la pantalla, pero se pueden dejar vacíos.
//
// Las claves son las mismas que viajan en `signosVitales` de /api/notas.
const config = require('../../../../frontend/src/modules/notas/signosVitales.json');

const CAMPOS = config.campos;
const POR_SERVICIO = config.porServicio;

function camposObligatorios(idServicio) {
    const id = Number(idServicio);
    if (Number.isInteger(id) && POR_SERVICIO[id]) return [...POR_SERVICIO[id]];
    return [...CAMPOS];
}

// Configuración que expone /api/notas/configuracion-signos-vitales.
function configuracion() {
    return {
        campos: [...config.campos],
        porDefecto: [...config.porDefecto],
        porServicio: Object.fromEntries(
            Object.entries(POR_SERVICIO).map(([id, campos]) => [id, [...campos]]),
        ),
    };
}

module.exports = { CAMPOS, POR_SERVICIO, camposObligatorios, configuracion };
