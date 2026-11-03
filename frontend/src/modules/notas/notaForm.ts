// Tipo del formulario de nota de enfermería (signos vitales + SOAPIE).
// Se comparte entre NewNoteForm y sus subcomponentes para mantener el tipado
// consistente sin acoplar la presentación.

export interface NotaFormState {
  // Signos vitales
  peso: string
  talla: string
  pCefalico: string
  pAbdominal: string
  hemoglucotest: string
  presionArterial: string
  frecuenciaCardiaca: string
  frecuenciaRespiratoria: string
  temp: string
  spo2: string

  // Secciones SOAPIE
  s: string
  o: string
  a: string
  p: string
  i: string
  e: string

  // Campos adicionales del documento
  antecedentes: string
  diagnosticos: string
  farmacia: string
  laboratorio: string
  imagen: string
}
