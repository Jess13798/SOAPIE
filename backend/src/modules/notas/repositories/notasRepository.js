const SCHEMA_NOT_CONFIGURED = 'NOTAS_SCHEMA_NOT_CONFIGURED';

function schemaNotConfigured() {
    const error = new Error(
        'La persistencia de notas SOAPIE aún no está configurada para el esquema de SIGH.'
    );
    error.code = SCHEMA_NOT_CONFIGURED;
    throw error;
}

// SIGH no tiene aún un esquema de notas SOAPIE aprobado para conectar.
async function getNotasPorPaciente() {
    return schemaNotConfigured();
}

async function getAllNotas() {
    return schemaNotConfigured();
}

async function insertNota() {
    return schemaNotConfigured();
}

async function updateNota() {
    return schemaNotConfigured();
}

async function insertVitales() {
    return schemaNotConfigured();
}

async function getHistorialVitals() {
    return schemaNotConfigured();
}

async function deleteNotaById() {
    return schemaNotConfigured();
}

module.exports = {
    getNotasPorPaciente,
    getAllNotas,
    insertNota,
    updateNota,
    insertVitales,
    getHistorialVitals,
    deleteNotaById,
};
