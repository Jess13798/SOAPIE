// Modelo base para cualquier documento clínico del sistema.
// Sirve de base para SOAPIE, Kardex, balance hídrico, vitales y otros tipos.

class ClinicalDocument {
    constructor({
        id = null,
        patientId = null,
        attentionId = null,
        type = 'generic',
        section = null,
        createdBy = null,
        createdAt = null,
        signedBy = null,
        signedAt = null,
        content = {},
        metadata = {},
    } = {}) {
        this.id = id;
        this.patientId = patientId;
        this.attentionId = attentionId;
        this.type = type;
        this.section = section;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.signedBy = signedBy;
        this.signedAt = signedAt;
        this.content = content;
        this.metadata = metadata;
    }
}

module.exports = {
    ClinicalDocument,
};
