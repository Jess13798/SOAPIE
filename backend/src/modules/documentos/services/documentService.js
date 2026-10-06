// Servicio base para todos los documentos clínicos.
// Sirve como punto de entrada para SOAPIE, Kardex, balance y otros formatos.

const { ClinicalDocument } = require('../../../core/domain/clinicalDocument');

function buildDocument(payload) {
    return new ClinicalDocument(payload);
}

module.exports = {
    buildDocument,
};
