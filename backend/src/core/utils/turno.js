// Utilidad para derivar el turno (día/noche) a partir de la hora.
// Se usa al iniciar sesión y al guardar la nota, para que el turno quede
// registrado automáticamente sin que el personal tenga que elegirlo a mano.
//
// Franjas (mismas que muestra NoteShiftBar.vue):
//   - Día:   07:00 - 18:59
//   - Noche: 19:00 - 06:59
// El límite es cerrado al inicio: a las 07:00 ya es día y a las 19:00 ya es noche.

const HORA_INICIO_DIA = 7;
const HORA_FIN_DIA = 19; // exclusivo

function turnoDesdeHora(fecha = new Date()) {
    const date = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(date.getTime())) return 'dia';

    const hora = date.getHours();
    return hora >= HORA_INICIO_DIA && hora < HORA_FIN_DIA ? 'dia' : 'noche';
}

module.exports = { turnoDesdeHora };
