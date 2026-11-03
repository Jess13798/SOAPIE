// Helper para normalizar y construir el payload SOAPIE que persiste en la base.
// La idea es centralizar la lógica de mapeo para que no se duplique entre alta
// y edición de notas, y mantener una estructura consistente para el frontend.

function buildSoapiePayload(nota = {}) {
    return {
        subjetivo: nota.subjetivo ?? nota.soapie?.subjetivo ?? nota.soapie?.s ?? '',
        objetivo: nota.objetivo ?? nota.soapie?.objetivo ?? nota.soapie?.o ?? '',
        analisis: nota.analisis ?? nota.soapie?.analisis ?? nota.soapie?.a ?? '',
        plan: nota.plan ?? nota.soapie?.plan ?? nota.soapie?.p ?? '',
        intervencion: nota.intervencion ?? nota.soapie?.intervencion ?? nota.soapie?.i ?? '',
        evaluacion: nota.evaluacion ?? nota.soapie?.evaluacion ?? nota.soapie?.e ?? '',
        antecedentes: nota.antecedentes ?? '',
        diagnosticos: nota.diagnosticos ?? '',
        farmacia: nota.farmacia ?? '',
        laboratorio: nota.laboratorio ?? '',
        imagen: nota.imagen ?? '',
        fechaFirmada: nota.fechaFirmada ?? null,
        horaFirmada: nota.horaFirmada ?? null,
    };
}

module.exports = {
    buildSoapiePayload,
};
