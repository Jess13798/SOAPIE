// Wrapper de compatibilidad.
// La configuración centralizada vive en src/config/db.js (arquitectura modular)
// y este archivo solo re-exporta para no romper los imports legacy.

module.exports = require('./src/config/db');
