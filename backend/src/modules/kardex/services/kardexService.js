const repo = require('../repositories/kardexRepository');

const TURNOS_VALIDOS = new Set(['M', 'T', 'N']);
const ESTADOS_MEDICAMENTO = new Set(['PENDIENTE', 'ADMINISTRADO', 'NO_ADMINISTRADO']);

function errorEntrada(mensaje) {
    const error = new Error(mensaje);
    error.code = 'KARDEX_INVALID_INPUT';
    return error;
}

function textoObligatorio(valor, campo, maximo) {
    const texto = String(valor || '').trim();
    if (!texto) throw errorEntrada(`El campo ${campo} es obligatorio.`);
    if (texto.length > maximo) throw errorEntrada(`El campo ${campo} no puede superar ${maximo} caracteres.`);
    return texto;
}

function idPositivo(valor, campo, obligatorio = false) {
    if (valor === undefined || valor === null || valor === '') {
        if (obligatorio) throw errorEntrada(`El campo ${campo} es obligatorio.`);
        return null;
    }
    const id = Number(valor);
    if (!Number.isSafeInteger(id) || id <= 0) throw errorEntrada(`El campo ${campo} no es válido.`);
    return id;
}

function fechaValida(fecha) {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const parsed = new Date(`${fecha}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === fecha;
}

function horaValida(hora) {
    return typeof hora === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

function validarRegistro(input = {}) {
    const categoria = String(input.categoria || '').trim().toUpperCase();
    const turno = String(input.turno || '').trim().toUpperCase();
    const fecha = input.fecha;
    const registro = {
        idPaciente: idPositivo(input.idPaciente, 'paciente', true),
        idCuenta: idPositivo(input.idCuenta, 'atención', true),
        idServicio: idPositivo(input.idServicio, 'servicio'),
        idEmpleado: idPositivo(input.idEmpleado, 'empleado'),
        fecha,
        turno,
        categoria,
        detalle: null,
        medicamento: null,
        dosis: null,
        via: null,
        frecuencia: null,
        horaProgramada: null,
        estado: null,
        observacion: null,
        responsable: textoObligatorio(input.responsable, 'responsable', 120),
    };

    if (!fechaValida(fecha)) throw errorEntrada('La fecha debe tener el formato AAAA-MM-DD.');
    if (!TURNOS_VALIDOS.has(turno)) throw errorEntrada('El turno debe ser M, T o N.');
    if (input.observacion !== undefined && input.observacion !== null && String(input.observacion).trim()) {
        registro.observacion = textoObligatorio(input.observacion, 'observación', 1000);
    }

    if (categoria === 'CUIDADO') {
        registro.detalle = textoObligatorio(input.detalle, 'cuidado o acción', 2000);
    } else if (categoria === 'MEDICAMENTO') {
        registro.medicamento = textoObligatorio(input.medicamento, 'medicamento', 200);
        registro.dosis = textoObligatorio(input.dosis, 'dosis', 100);
        registro.via = textoObligatorio(input.via, 'vía', 100);
        registro.frecuencia = textoObligatorio(input.frecuencia, 'frecuencia', 100);
        if (!horaValida(input.horaProgramada)) throw errorEntrada('La hora programada no es válida.');
        registro.horaProgramada = input.horaProgramada;
        registro.estado = String(input.estado || '').trim().toUpperCase();
        if (!ESTADOS_MEDICAMENTO.has(registro.estado)) {
            throw errorEntrada('El estado del medicamento no es válido.');
        }
        if (registro.estado === 'NO_ADMINISTRADO' && !registro.observacion) {
            throw errorEntrada('Registra el motivo cuando el medicamento no fue administrado.');
        }
    } else {
        throw errorEntrada('La categoría debe ser CUIDADO o MEDICAMENTO.');
    }

    return registro;
}

function validarConsulta(idCuenta, fecha) {
    const cuenta = idPositivo(idCuenta, 'atención', true);
    if (fecha && !fechaValida(fecha)) throw errorEntrada('La fecha debe tener el formato AAAA-MM-DD.');
    return { idCuenta: cuenta, fecha: fecha || null };
}

async function guardarRegistro(input) {
    return repo.guardarRegistro(validarRegistro(input));
}

async function obtenerRegistros(idCuenta, fecha) {
    const consulta = validarConsulta(idCuenta, fecha);
    return repo.obtenerRegistros(consulta.idCuenta, consulta.fecha);
}

module.exports = { guardarRegistro, obtenerRegistros, validarRegistro, validarConsulta };
