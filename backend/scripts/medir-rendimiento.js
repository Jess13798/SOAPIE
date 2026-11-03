// Mide el tiempo de respuesta de la API contra la base real.
// Uso (desde la raíz del proyecto, con el backend corriendo):
//   npm run server           (en otra terminal)
//   node backend/scripts/medir-rendimiento.js
//
// No modifica datos: solo hace lecturas.
require('dotenv').config({ path: 'backend/.env', quiet: true })
const { firmarToken } = require('../auth')

const token = firmarToken({ usuario: 'medicion', idEmpleado: 1 })
const H = { Authorization: 'Bearer ' + token }
const BASE = 'http://localhost:3000/api'

async function timeIt(label, url, n = 6) {
  const times = []
  let lastStatus = 0
  let last = []
  for (let i = 0; i < n; i++) {
    const t0 = performance.now()
    const res = await fetch(BASE + url, { headers: H })
    const data = await res.json()
    times.push(performance.now() - t0)
    lastStatus = res.status
    last = Array.isArray(data) ? data : (data.data || [])
  }
  times.sort((a, b) => a - b)
  const min = times[0]
  const med = times[Math.floor(n / 2)]
  const ejemplo = last[0] ? (' | ej: ' + (last[0].Paciente || last[0].Nombre || '')) : ''
  console.log(
    label.padEnd(42) +
    'min ' + min.toFixed(0).padStart(5) + ' ms | med ' + med.toFixed(0).padStart(5) + ' ms' +
    ' | ' + lastStatus + ' | ' + last.length + ' filas' + ejemplo
  )
}

async function main() {
  console.log('== Tiempos de respuesta (API local) ==\n')
  await timeIt('GET /servicios', '/servicios')
  await timeIt('GET /pacientes?servicioId=219', '/pacientes?servicioId=219')
  await timeIt('GET /pacientes-sin-cama?servicioId=219', '/pacientes-sin-cama?servicioId=219')
  await timeIt('GET /medicos?especialidadId=147', '/medicos?especialidadId=147')
  await timeIt('GET /buscar?q=KANASHIRO (nombre)', '/pacientes/buscar?q=KANASHIRO')
  await timeIt('GET /buscar?q=000255646 (DNI)', '/pacientes/buscar?q=000255646')
  await timeIt('GET /buscar?q=82531 (historia)', '/pacientes/buscar?q=82531')
  await timeIt('GET /buscar?q=595725 (cuenta)', '/pacientes/buscar?q=595725')
}
main().then(() => process.exit(0)).catch(e => { console.error('ERR', e.message); process.exit(1) })
