import type { NotaEnfermeria, Patient, SignosVitales } from '@/types'

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function valueOrDash(value: unknown): string {
  const valueText = String(value ?? '').trim()
  return valueText ? escapeHtml(valueText) : '—'
}

function formatDate(value?: string | null): string {
  if (!value) return '—'
  const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return dateMatch ? `${dateMatch[3]}/${dateMatch[2]}/${dateMatch[1]}` : escapeHtml(value)
}

function renderVitals(vitals?: SignosVitales): string {
  if (!vitals) return '<p class="empty">Sin signos vitales registrados en esta nota.</p>'

  const items: Array<[string, string | undefined, string]> = [
    ['Temperatura', vitals.temperatura, '°C'],
    ['Presión arterial', vitals.presionArterial, 'mmHg'],
    ['Frec. cardiaca', vitals.frecuenciaCardiaca, 'lpm'],
    ['Frec. respiratoria', vitals.frecuenciaRespiratoria, 'rpm'],
    ['Saturación O₂', vitals.saturacionOxigeno, '%'],
    ['Peso', vitals.peso, 'kg'],
    ['Talla', vitals.talla, 'cm'],
    ['P. cefálico', vitals.pCefalico, 'cm'],
    ['P. abdominal', vitals.pAbdominal, 'cm'],
    ['Hemoglucotest', vitals.hemoglucotest || vitals.glucosa, 'mg/dL'],
    ['Hemoglobina', vitals.hemoglobina, 'g/dL'],
  ].filter(([, value]) => String(value ?? '').trim())

  if (!items.length) return '<p class="empty">Sin signos vitales registrados en esta nota.</p>'

  return `<div class="vitals">${items.map(([label, value, unit]) =>
    `<div class="vital"><span class="vital-label">${escapeHtml(label)}</span><strong>${valueOrDash(value)}</strong><span class="vital-unit">${escapeHtml(unit)}</span></div>`
  ).join('')}</div>`
}

function renderCarePlan(nota: NotaEnfermeria): string {
  if (!nota.planCuidados?.length) return '<p class="empty">Sin plan de cuidados NANDA/NOC/NIC registrado.</p>'

  return nota.planCuidados.map((plan, index) => {
    const nocRows = (plan.noc || []).map(noc => {
      const meta = plan.nocMetas?.[noc.id] || ''
      const evaluation = plan.nocEvaluaciones?.[noc.id] || ''
      return `<tr>
        <td>${valueOrDash(noc.codigo)}</td>
        <td>${valueOrDash(noc.resultado)}</td>
        <td>${valueOrDash(meta)}</td>
        <td>${valueOrDash(evaluation)}</td>
      </tr>`
    }).join('')

    const nicRows = (plan.nic || []).map(nic => {
      const completed = plan.nicRealizadasIds?.includes(nic.id) || false
      const reason = plan.nicNoRealizadas?.[nic.id] || ''
      const status = completed ? 'Realizada' : reason ? 'No realizada' : 'Sin registrar'
      return `<tr>
        <td>${valueOrDash(nic.codigo)}</td>
        <td>${valueOrDash(nic.intervencion)}</td>
        <td>${status}</td>
        <td>${valueOrDash(reason)}</td>
      </tr>`
    }).join('')

    return `<section class="care-plan">
      <h3>Diagnóstico NANDA ${index + 1}: ${valueOrDash(plan.codigoNANDA)}</h3>
      <p><strong>Diagnóstico enfermero:</strong> ${valueOrDash(plan.diagnostico)}</p>
      ${plan.comentario ? `<p><strong>Comentario:</strong> ${valueOrDash(plan.comentario)}</p>` : ''}
      <h4>Resultados NOC</h4>
      ${nocRows
        ? `<table><thead><tr><th>Código</th><th>Resultado esperado</th><th>Meta</th><th>Evaluación / observado</th></tr></thead><tbody>${nocRows}</tbody></table>`
        : '<p class="empty">Sin resultados NOC registrados.</p>'}
      <h4>Intervenciones NIC</h4>
      ${nicRows
        ? `<table><thead><tr><th>Código</th><th>Intervención</th><th>Estado</th><th>Motivo si no se realizó</th></tr></thead><tbody>${nicRows}</tbody></table>`
        : '<p class="empty">Sin intervenciones NIC registradas.</p>'}
    </section>`
  }).join('')
}

function section(title: string, content: string): string {
  return `<section class="note-section"><h2>${title}</h2><div class="section-content">${valueOrDash(content)}</div></section>`
}

export function printNota(nota: NotaEnfermeria, patient: Patient, noteNumber: number): boolean {
  if (!nota.isFirmada) {
    throw new Error('Solo se pueden imprimir notas firmadas.')
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) return false

  const patientName = patient.nombreCompleto || `${patient.nombre} ${patient.apellido}`.trim()
  const signedDate = nota.fechaFirmada || nota.fecha
  const signedTime = nota.horaFirmada || nota.hora
  const html = `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Nota de enfermería ${escapeHtml(noteNumber)}</title>
      <style>
        @page { size: A4; margin: 8mm; }
        * { box-sizing: border-box; }
        body { color: #172033; font: 9pt Arial, sans-serif; margin: 0; }
        h1 { font-size: 13pt; margin: 0 0 1mm; text-align: center; }
        .subtitle { color: #475569; font-size: 7.5pt; margin: 0 0 2mm; text-align: center; }
        .identity { border: 1px solid #334155; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 1mm; }
        .identity div { border: 1px solid #cbd5e1; min-height: 5mm; padding: 0.7mm 1mm; overflow-wrap: anywhere; font-size: 7.5pt; }
        .label { color: #475569; display: inline; font-size: 5.5pt; font-weight: bold; margin-right: 0.7mm; text-transform: uppercase; }
        .note-section, .care-plan { border: 1px solid #334155; margin: 1.5mm 0; }
        .note-section { break-inside: avoid; }
        .note-section h2 { background: #f1f5f9; border-bottom: 1px solid #334155; font-size: 8pt; margin: 0; padding: 1mm 1.5mm; text-transform: uppercase; }
        .section-content { min-height: 8mm; padding: 1.5mm; white-space: pre-wrap; overflow-wrap: anywhere; }
        h2.block-title { border-bottom: 1px solid #334155; font-size: 9pt; margin: 2mm 0 1mm; padding-bottom: 0.5mm; }
        .care-plan { padding: 1.5mm; }
        .care-plan h3 { font-size: 8pt; margin: 0 0 1mm; }
        .care-plan h4 { font-size: 7.5pt; margin: 1.5mm 0 0.5mm; }
        .care-plan p { margin: 0.5mm 0; }
        table { border-collapse: collapse; font-size: 7pt; width: 100%; }
        th, td { border: 1px solid #94a3b8; padding: 0.8mm; text-align: left; vertical-align: top; }
        th { background: #f1f5f9; }
        .vitals { display: grid; gap: 1mm; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 1mm; }
        .vital { align-items: baseline; border: 1px solid #94a3b8; display: flex; flex-wrap: wrap; gap: 0.5mm 1mm; min-width: 0; padding: 1mm; }
        .vital-label { color: #475569; font-size: 6.5pt; }
        .vital strong { font-size: 8pt; }
        .vital-unit { color: #475569; font-size: 6.5pt; }
        .empty { color: #64748b; font-size: 7.5pt; font-style: italic; margin: 1mm 0; }
        .signing { margin-top: 5mm; break-inside: avoid; }
        .signing-data { border: 1px solid #94a3b8; padding: 1mm; }
        .signature-lines { display: grid; gap: 20mm; grid-template-columns: 1fr 1fr; margin-top: 10mm; text-align: center; }
        .signature-lines div { border-top: 1px solid #334155; padding-top: 1mm; }
        .disclaimer { color: #475569; font-size: 6.5pt; margin-top: 1mm; text-align: center; }
        @media screen { body { margin: 8mm auto; max-width: 194mm; } }
      </style>
    </head>
    <body>
      <h1>REGISTRO DE ENFERMERÍA</h1>
      <p class="subtitle">Nota SOAPIE N.º ${escapeHtml(noteNumber)}</p>
      <div class="identity">
        <div><span class="label">Paciente</span>${valueOrDash(patientName)}</div>
        <div><span class="label">DNI / identificación</span>${valueOrDash(patient.dni)}</div>
        <div><span class="label">Historia clínica</span>${valueOrDash(patient.historiaClinica)}</div>
        <div><span class="label">Cuenta</span>${valueOrDash(patient.numCuenta)}</div>
        <div><span class="label">Edad</span>${valueOrDash(patient.edadDescripcion ? `${patient.edad} ${patient.edadDescripcion}` : `${patient.edad} años`)}</div>
        <div><span class="label">Sexo</span>${patient.genero === 'F' ? 'Femenino' : patient.genero === 'M' ? 'Masculino' : '—'}</div>
        <div><span class="label">Servicio</span>${valueOrDash(nota.servicio || patient.servicio)}</div>
        <div><span class="label">Diagnóstico de ingreso</span>${valueOrDash(patient.diagnostico)}</div>
        <div><span class="label">Fecha y hora de inicio</span>${formatDate(nota.fecha)} · ${valueOrDash(nota.hora)}</div>
        <div><span class="label">Turno</span>${nota.turno === 'noche' ? 'Noche' : 'Día'}</div>
        <div><span class="label">Fecha de ingreso</span>${formatDate(patient.fechaIngreso)}</div>
        <div><span class="label">Médico</span>${valueOrDash(patient.medico)}</div>
      </div>
      <h2 class="block-title">Signos vitales</h2>
      ${renderVitals(nota.signosVitales)}
      ${section('S · Datos subjetivos', nota.subjetivo)}
      ${section('O · Datos objetivos', nota.objetivo)}
      ${section('A · Análisis', nota.analisis)}
      <h2 class="block-title">Plan de cuidados NANDA / NOC / NIC</h2>
      ${renderCarePlan(nota)}
      ${section('P · Plan', nota.plan)}
      ${section('I · Intervención', nota.intervencion)}
      ${section('E · Evaluación', nota.evaluacion)}
      <div class="signing">
        <div class="signing-data"><span class="label">Registro de firma en el sistema</span>
          ${valueOrDash(nota.enfermera)} · ${formatDate(signedDate)} ${valueOrDash(signedTime)}
        </div>
        <div class="signature-lines">
          <div>Nombre de enfermero/a</div>
          <div>Firma y sello</div>
        </div>
      </div>
    </body>
  </html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.requestAnimationFrame(() => {
    printWindow.focus()
    printWindow.print()
  })

  return true
}
