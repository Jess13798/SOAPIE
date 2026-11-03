# Informe de avances — Sistema de Notas de Enfermería (SOAPIE)

> Fecha: 22 de octubre de 2026
> Para: Jefa de Enfermería
> De: Equipo de desarrollo del módulo SOAPIE

---

## 1. Para qué sirve esto (en una frase)

Estamos construyendo una aplicación donde la enfermera registra su nota
(SOAPIE), toma los signos vitales del paciente y anota su plan de cuidados
(NANDA/NOC/NIC) desde la computadora, en lugar de hacerlo en papel.

---

## 2. Lo que YA funciona hoy

Estas cosas están hechas y probadas. Si tuviéramos la base con datos de prueba,
se podrían mostrar en pantalla ahora mismo:

### 2.1 Listado de pacientes y camas
- Se elige un **servicio** y se ven los pacientes internados en ese servicio.
- Se ve qué cama ocupa cada paciente y en qué servicio está.
- Se puede **asignar cama** a un paciente, **trasladarlo** de servicio y ver
  el **total de camas** ocupadas y libres.
- Toda asignación o traslado de cama **queda registrada con nombre y hora**
  (quién lo hizo, a qué paciente y en qué cama). Hay una pantalla de
  **"Auditoría de Camas"** para revisar ese historial.

### 2.2 Nota de enfermería (SOAPIE)
- Se crea una nota **por paciente**, con las seis secciones del SOAPIE
  (Subjetivo, Objetivo, Análisis, Plan, Intervención, Evaluación).
- Se pueden registrar los **signos vitales** en la misma pantalla: peso, talla,
  perímetro cefálico y abdominal, hemoglucotest, presión arterial, frecuencia
  cardiaca, frecuencia respiratoria, temperatura y saturación.
- La nota se puede **guardar sin firmar** (queda como borrador) o **firmar** al
  cerrarla.
- Al crear una nota nueva, el sistema **arrastra el plan de cuidados de la nota
  anterior** del mismo paciente, para no volver a escribirlo desde cero.
- La hora y el turno (día/noche) los pone la **computadora**, no la persona:
  así no hay notas con hora mal puesta.

### 2.3 Plan de cuidados NANDA / NOC / NIC
- La enfermera **busca el diagnóstico NANDA** por código o por texto.
- Del diagnóstico se muestran sus **resultados esperados (NOC)** y sus
  **intervenciones (NIC)** correspondientes.
- Por cada resultado se puede escribir la **meta** y anotar el **resultado
  observado** al final.
- Por cada intervención se marca si **se realizó** o **no se realizó**, y
  cuando no se realizó se **explica el motivo** (por ejemplo: "no había
  insumo", "el paciente rechazó el procedimiento").
- Hay una pantalla aparte para **consultar el catálogo** NANDA/NOC/NIC completo.

### 2.4 Historial
- Cada paciente tiene su **historial de notas** y su **historial de signos
  vitales**, para ver cómo evolucionó.

### 2.5 Seguridad
- Para entrar hace falta **usuario y contraseña**.
- Cada nota queda **asociada a la enfermera que la escribió**.

---

## 3. Lo que FALTA en el sistema

Ordenado por lo que más se nota al usarlo.

### 3.1 Imprimir / exportar la nota
- **Hoy no se puede imprimir ni sacar en PDF** una nota. No hay un formato
  oficial para entregar en papel o adjuntar a la historia clínica.

### 3.2 Corregir una nota ya firmada
- Hoy una nota se puede editar, pero **no queda constancia de que se corrigió**:
  no se ve qué decía antes, ni quién la cambió, ni cuándo. En un documento
  clínico eso es importante.

### 3.3 Signos vitales como registro aparte
- Ahora mismo los signos vitales van **dentro de la nota**. Si enfermería toma
  signos vitales cada ciertas horas **sin** escribir una nota completa, el
  sistema no tiene una forma clara de registrarlo como un control propio.

### 3.4 Campos que están a medias
- El formulario tiene cinco campos que **hoy no se guardan ni se usan**:
  **Antecedentes, Diagnósticos, Farmacia, Laboratorio e Imagen**. Hay que
  decidir si se implementan de verdad o se quitan, porque confunden al usuario.

### 3.5 Turnos
- El sistema maneja por ahora **día y noche**. Si el hospital trabaja con
  **turnos de 12 horas** o con tres turnos, hay que ajustarlo.

### 3.6 Firma digital
- La firma hoy es **lógica** (queda registrado quién firmó y a qué hora), pero
  no es una **firma digital certificada**. Se dejó pendiente a propósito.

### 3.7 Capacitación
- Falta **capacitar al personal** en el uso del sistema y definir un manual
  corto de uso.

---

## 4. Riesgos que conviene conocer

1. **Los datos viven en una base del hospital que se borra/reinicia sin
   avisar.** El 22 de octubre la base fue recreada y se perdieron las notas de
   prueba. Mientras no haya un lugar estable ni respaldos propios, **lo que se
   registre puede desaparecer**. Esto no se arregla desde enfermería: necesita
   coordinación con el área de sistemas del hospital.
2. **No hay un ambiente de pruebas separado**, así que se trabaja sobre la misma
   base del hospital.
3. **Pérdida de notas si se cae la conexión**: si se corta la conexión mientras
   se guarda, la nota queda solo en la sesión actual y se pierde al cerrar.
   El sistema avisa, pero no la recupera sola.

---

## 5. Preguntas para la Jefa de Enfermería

> Estas preguntas son sobre **cómo trabaja enfermería en la práctica**, para que
> el sistema refleje lo que ustedes hacen y no al revés.

### Sobre la nota y la firma
1. Cuando una enfermera termina su nota, ¿**ella misma la firma** o la revisa y
   valida después la **enfermera jefa / supervisora**?
2. Si una nota **ya firmada tiene un error**, ¿cómo lo corrigen hoy en papel?
   ¿Se tacha y se anota al costado? ¿Se hace una nota nueva de corrección? Eso
   necesitamos copiarlo en el sistema.
3. ¿La nota se hace **una por turno y por paciente**, o se agregan notas cada
   vez que pasa algo importante?
4. ¿Necesitan **imprimir la nota** para la historia clínica o para el archivo?
   ¿Qué datos y qué formato debe tener ese papel (membrete, sello, firma)?

### Sobre los turnos
5. ¿Qué turnos trabajan realmente: **día y noche**, o también **turnos de 12
   horas** o **tres turnos**? ¿A qué hora empieza y termina cada uno?

### Sobre los signos vitales
6. ¿Los signos vitales se toman **cada cuántas horas**? ¿Se toman aunque no se
   escriba una nota completa, o siempre van juntos con la nota?
7. ¿Hay **valores que son alarma** y que el sistema debería resaltar (por
   ejemplo, fiebre, presión muy alta o muy baja, saturación baja)?

### Sobre el plan de cuidados (NANDA/NOC/NIC)
8. El plan de cuidados, ¿se **hereda de la nota anterior** del paciente (como
   está ahora) o cada turno se hace **desde cero**?
9. ¿**Quién** elige los diagnósticos NANDA: cualquier enfermera o solo el
   personal con formación específica?
10. Cuando una intervención **no se pudo realizar**, ¿qué **motivos** se
    anotan normalmente? (para tener una lista en vez de escribir libre)
11. ¿Qué **catálogo** de diagnósticos (NANDA/NOC/NIC) usa oficialmente el
    servicio? ¿El que tenemos cargado es el correcto, o manejan uno propio?

### Sobre los campos que hoy no funcionan
12. ¿Enfermería **usa** alguno de estos campos en su trabajo diario:
    **antecedentes, diagnósticos, farmacia, laboratorio, imagen**? Si no los
    usan, los quitamos del formulario para que no confundan.

### Sobre el uso y la capacitación
13. ¿**Cuántas** enfermeras y técnicos usarían el sistema, y en cuántas
    computadoras? (para saber cuánta capacitación se necesita)
14. ¿En qué **momento del turno** usarían la computadora: mientras atienden,
    al final del turno, o en la entrega de guardia?
15. ¿Quién sería la **persona de contacto de enfermería** para revisar avances
    y dar observaciones conforme avancemos?

---

## 6. Lo que necesitamos de parte del hospital

No depende de enfermería, pero conviene que sepan y ayuden a gestionarlo:

- Un lugar **estable** donde guardar los datos (que no se borren), y respaldos.
- La **lista oficial** de diagnósticos NANDA/NOC/NIC si el servicio tiene uno
  propio.
- **Permiso y horario** para capacitar al personal con el sistema ya funcionando.

---

## 7. Resumen

| Área | Estado |
|---|---|
| Pacientes, camas y traslados | ✅ Funcionando |
| Auditoría de camas | ✅ Funcionando |
| Nota SOAPIE (crear, guardar, firmar) | ✅ Funcionando |
| Plan de cuidados NANDA/NOC/NIC | ✅ Funcionando |
| Signos vitales dentro de la nota | ✅ Funcionando |
| Historial de notas y de signos vitales | ✅ Funcionando |
| Imprimir / PDF | ❌ Falta |
| Corrección de nota firmada con rastro | ❌ Falta |
| Signos vitales como registro aparte | ❌ Falta |
| Cinco campos (antecedentes, lab, etc.) | ⚠️ A medias: usar o quitar |
| Firma digital certificada | ⏸️ Pendiente a propósito |
| Capacitación al personal | ❌ Falta |
