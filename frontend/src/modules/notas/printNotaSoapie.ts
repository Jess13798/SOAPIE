import type { NotaEnfermeria, Patient, PlanCuidadoNota, SignosVitales } from '@/types'
import { camposObligatoriosDeServicio } from './vitalesConfig'
import { extractWongBakerScore, removeWongBakerMarker, wongBakerFace } from './wongBaker'

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function valueOrDash(value: unknown): string {
  const text = String(value ?? '').trim()
  return text ? escapeHtml(text) : '—'
}

function textBlock(text?: string): string {
  const value = String(text ?? '').trim()
  return value ? escapeHtml(value) : '<span class="empty">Sin registro</span>'
}

function renderRequiredVitals(nota: NotaEnfermeria): string {
  if (!nota.signosVitales) return ''

  const fields: Record<string, { label: string; unit: string }> = {
    peso: { label: 'Peso', unit: 'kg' },
    talla: { label: 'Talla', unit: 'cm' },
    pCefalico: { label: 'P. cef.', unit: 'cm' },
    pAbdominal: { label: 'P. abd.', unit: 'cm' },
    hemoglucotest: { label: 'HGT', unit: 'mg/dL' },
    presionArterial: { label: 'PA', unit: 'mmHg' },
    frecuenciaCardiaca: { label: 'FC', unit: 'lpm' },
    frecuenciaRespiratoria: { label: 'FR', unit: 'rpm' },
    temperatura: { label: 'T', unit: '°C' },
    saturacionOxigeno: { label: 'SpO₂', unit: '%' },
  }
  const requiredFields = camposObligatoriosDeServicio(
    nota.servicioId == null ? null : String(nota.servicioId),
  )
  const values = requiredFields
    .filter(key => fields[key] && String(nota.signosVitales?.[key as keyof SignosVitales] ?? '').trim())
    .map(key => {
      const field = fields[key]
      const value = nota.signosVitales?.[key as keyof SignosVitales]
      return `<span><strong>${field.label}:</strong> ${valueOrDash(value)} ${field.unit}</span>`
    })

  return values.length ? `<div class="vital-line"><strong>Signos vitales:</strong> ${values.join(' · ')}</div>` : ''
}

function renderWongBakerScale(plan: string): string {
  const score = extractWongBakerScore(plan)
  const selectedFace = wongBakerFace(score)
  if (!selectedFace) return ''

  return `<p class="pain-scale"><strong>Escala Wong-Baker:</strong> ${selectedFace.score}/10 — ${valueOrDash(selectedFace.meaning)}</p>`
}

function renderCarePlan(plans: PlanCuidadoNota[] | undefined, key: 'analysis' | 'plan' | 'intervention'): string {
  if (!plans?.length) return ''

  const blocks = plans.map(plan => {
    if (key === 'analysis') {
      return `<p><strong>NANDA ${valueOrDash(plan.codigoNANDA)}:</strong> ${valueOrDash(plan.diagnostico)}${plan.comentario ? `<br>${valueOrDash(plan.comentario)}` : ''}</p>`
    }

    if (key === 'plan') {
      const outcomes = (plan.noc || []).map(noc => {
        const meta = plan.nocMetas?.[noc.id]
        return `<li><strong>NOC ${valueOrDash(noc.codigo)}:</strong> ${valueOrDash(noc.resultado)}${meta ? ` — Meta: ${valueOrDash(meta)}` : ''}</li>`
      }).join('')
      return outcomes ? `<p><strong>Resultados esperados (NOC)</strong></p><ul>${outcomes}</ul>` : ''
    }

    const interventions = (plan.nic || []).map(nic => {
      const completed = plan.nicRealizadasIds?.includes(nic.id) || false
      const reason = plan.nicNoRealizadas?.[nic.id] || ''
      const status = completed ? 'Realizada' : reason ? `No realizada: ${valueOrDash(reason)}` : 'Sin registrar'
      return `<li><strong>NIC ${valueOrDash(nic.codigo)}:</strong> ${valueOrDash(nic.intervencion)} <span class="status">(${status})</span></li>`
    }).join('')
    return interventions ? `<p><strong>Intervenciones (NIC)</strong></p><ul>${interventions}</ul>` : ''
  }).filter(Boolean)

  return blocks.join('')
}

function soapRow(letter: string, content: string): string {
  return `<tr class="soap-row"><th class="soap-letter">${letter}</th><td>${content}</td></tr>`
}

export function printNotaSoapie(nota: NotaEnfermeria, patient: Patient): boolean {
  if (!nota.isFirmada) {
    throw new Error('Solo se pueden imprimir notas firmadas.')
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) return false

  const patientName = patient.nombreCompleto || `${patient.nombre} ${patient.apellido}`.trim()
  const carePlanAnalysis = renderCarePlan(nota.planCuidados, 'analysis')
  const objectiveContent = [textBlock(nota.objetivo), renderRequiredVitals(nota)].filter(Boolean).join('<br>')
  const planContent = removeWongBakerMarker(nota.plan || '')
  const painScale = renderWongBakerScale(nota.plan || '')
  const logoUrl = new URL(`${import.meta.env.BASE_URL}logo.webp`, window.location.href).href
  const html = `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <base href="${escapeHtml(new URL(import.meta.env.BASE_URL, window.location.href).href)}">
      <title></title>
      <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; }
        body { color: #172033; font: 9pt Arial, sans-serif; margin: 0; }
        .print-header { min-height: 14mm; position: relative; }
        h1 { font-size: 14pt; letter-spacing: 0.04em; margin: 0 0 2mm; padding: 2mm 35mm 0; text-align: center; }
        .logo { height: 12mm; object-fit: contain; position: absolute; right: 0; top: 0; width: 32mm; }
        .identity { border: 1px solid #334155; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 3mm; }
        .identity div { border: 1px solid #cbd5e1; min-width: 0; overflow-wrap: anywhere; padding: 1mm; }
        .label { color: #475569; display: block; font-size: 6pt; font-weight: bold; margin-bottom: 0.5mm; text-transform: uppercase; }
        .identity .patient-name { grid-column: span 2; }
        .soap { border-collapse: collapse; table-layout: fixed; width: 100%; }
        .soap tr { break-inside: avoid; }
        .soap th, .soap td { border: 1px solid #475569; padding: 2mm; vertical-align: top; }
        .soap-letter { font-size: 13pt; font-weight: normal; text-align: center; vertical-align: middle !important; width: 12mm; }
        .soap td { font-size: 8pt; line-height: 1.2; overflow-wrap: anywhere; white-space: pre-wrap; }
        .soap td ul { margin: 1mm 0 1mm 4mm; padding-left: 3mm; }
        .soap td p { margin: 1mm 0; }
        .vital-line { font-size: 7pt; margin-top: 1.5mm; white-space: nowrap; }
        .status { color: #475569; font-size: 7pt; }
        .pain-scale { margin: 1mm 0; }
        .empty { color: #64748b; font-style: italic; }
        .signature { break-inside: avoid; margin-top: 14mm; }
        .signature-info { font-size: 8pt; margin-bottom: 14mm; text-align: center; }
        .signature-lines { display: grid; gap: 20mm; grid-template-columns: 1fr 1fr; text-align: center; }
        .signature-lines div { border-top: 1px solid #334155; font-size: 8pt; padding-top: 2mm; }
        @media print { body { padding: 9mm; } }
        @media screen { body { margin: 8mm auto; max-width: 192mm; } }
      </style>
    </head>
    <body>
      <header class="print-header">
        <h1>NOTA DE ENFERMERÍA N.º ${valueOrDash(nota.id)}</h1>
        <img class="logo" src="${escapeHtml(logoUrl)}" alt="Logo">
      </header>
      <div class="identity">
        <div class="patient-name"><span class="label">Paciente</span>${valueOrDash(patientName)}</div>
        <div><span class="label">DNI / identificación</span>${valueOrDash(patient.dni)}</div>
        <div><span class="label">Historia clínica</span>${valueOrDash(patient.historiaClinica)}</div>
        <div><span class="label">Cuenta</span>${valueOrDash(patient.numCuenta)}</div>
        <div><span class="label">Edad</span>${valueOrDash(patient.edadDescripcion ? `${patient.edad} ${patient.edadDescripcion}` : `${patient.edad} años`)}</div>
        <div><span class="label">Sexo</span>${patient.genero === 'F' ? 'Femenino' : patient.genero === 'M' ? 'Masculino' : '—'}</div>
        <div><span class="label">Servicio</span>${valueOrDash(nota.servicio || patient.servicio)}</div>
      </div>
      <table class="soap">
        <tbody>
          ${soapRow('S', textBlock(nota.subjetivo))}
          ${soapRow('O', objectiveContent)}
          ${soapRow('A', `${textBlock(nota.analisis)}${carePlanAnalysis}`)}
          ${soapRow('P', `${textBlock(planContent)}${painScale}`)}
          ${soapRow('I', textBlock(nota.intervencion))}
          ${soapRow('E', textBlock(nota.evaluacion))}
        </tbody>
      </table>
      <footer class="signature">
        <p class="signature-info"><strong>Enfermero/a:</strong> ${valueOrDash(nota.enfermera)}</p>
        <div class="signature-lines">
          <div>Nombre del/de la enfermero/a</div>
          <div>Firma</div>
        </div>
      </footer>
    </body>
  </html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  const printWhenReady = () => {
    printWindow.focus()
    printWindow.print()
  }
  const logo = printWindow.document.querySelector<HTMLImageElement>('.logo')
  if (!logo || logo.complete) {
    printWindow.requestAnimationFrame(printWhenReady)
  } else {
    logo.addEventListener('load', printWhenReady, { once: true })
    logo.addEventListener('error', printWhenReady, { once: true })
  }

  return true
}
