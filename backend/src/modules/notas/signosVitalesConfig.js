// Obligatoriedad de los signos vitales por servicio.
//
// Al CREAR una nota, el backend exige los campos que aparecen aquí. Un
// servicio sin configuración mantiene el comportamiento histórico: los diez
// campos son obligatorios. Los campos que no estén en la lista se siguen
// mostrando en la pantalla, pero se pueden dejar vacíos.
//
// Las claves son las mismas que viajan en `signosVitales` de /api/notas.
const CAMPOS = [
    'peso',
    'talla',
    'pCefalico',
    'pAbdominal',
    'hemoglucotest',
    'presionArterial',
    'frecuenciaCardiaca',
    'frecuenciaRespiratoria',
    'temperatura',
    'saturacionOxigeno',
];

// Servicio 213 = HOSPITALIZACIÓN PEDIATRICA.
// Obligatorios: peso, talla, frecuencia cardiaca, frecuencia respiratoria,
// temperatura y saturación de oxígeno.
// Opcionales: perímetro cefálico, perímetro abdominal, presión arterial y
// hemoglucotest.
const POR_SERVICIO = {
    213: [
        'peso',
        'talla',
        'frecuenciaCardiaca',
        'frecuenciaRespiratoria',
        'temperatura',
        'saturacionOxigeno',
    ],
};

function camposObligatorios(idServicio) {
    const id = Number(idServicio);
    if (Number.isInteger(id) && POR_SERVICIO[id]) return [...POR_SERVICIO[id]];
    return [...CAMPOS];
}

// Configuración que consume el frontend para marcar los campos obligatorios
// y validar antes de enviar la nota.
function configuracion() {
    return {
        campos: [...CAMPOS],
        porDefecto: [...CAMPOS],
        porServicio: Object.fromEntries(
            Object.entries(POR_SERVICIO).map(([id, campos]) => [id, [...campos]]),
        ),
    };
}

module.exports = { CAMPOS, POR_SERVICIO, camposObligatorios, configuracion };
