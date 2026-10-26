# Informe de avances — Sistema de Notas de Enfermería (SOAPIE)

> Fecha: 23 de octubre de 2026
> Para: Jefa de Enfermería
> De: Equipo de desarrollo del módulo SOAPIE

---

## 1. Lo que avanzó desde ayer

### 1.1 Las notas ahora se ordenan por servicio

Antes, las notas de un paciente se mezclaban aunque el paciente hubiera pasado
por varios servicios. Ahora cada nota queda ligada al **servicio donde se
escribió** (por ejemplo, Hospitalización Pediátrica, UCI, Medicina).

- Al abrir el historial de un paciente, se ven **solo las notas del servicio
  donde está ahora**. El historial completo se consulta por separado.
- Si un paciente cambia de servicio, la nota nueva se escribe en el nuevo
  servicio; la anterior queda donde corresponde.
- El servicio se detecta automáticamente por la estancia del paciente, no por
  lo que la enfermera elija a mano.

### 1.2 La pantalla de la nota quedó más ordenada

- Los datos del paciente (Paciente, Cuenta, Historia, Edad) quedan **arriba y
  siempre visibles** mientras se escribe la nota.
- Turno y enfermero/a responsable van en su propia fila.
- Se agregó el botón de historial de signos vitales en la cabecera del modal.

### 1.3 Signos vitales: obligatorios y opcionales por servicio

Antes el sistema exigía todos los signos vitales en todos los casos. Ahora se
configuró **por servicio** qué es obligatorio y qué es opcional.

Para **Hospitalización Pediátrica**:

- **Obligatorios:** temperatura, frecuencia cardiaca, frecuencia respiratoria,
  saturación de oxígeno, peso y talla.
- **Opcionales:** perímetro cefálico, perímetro abdominal, presión arterial y
  hemoglucotest.

En los demás servicios se mantienen los diez campos obligatorios (igual que
antes). Los campos opcionales se muestran en la pantalla pero se pueden
dejar vacíos. Se marcó con un `*` lo obligatorio y con "(opc.)" lo opcional,
para que no haya dudas al llenar el formulario.

### 1.4 Lo que se probó

- Se creó una nota real en Hospitalización Pediátrica con solo los seis
  signos obligatorios y se guardó correctamente.
- Se verificó que una nota en otro servicio sigue exigiendo todos los signos.
- El sistema arrancó sin errores y el historial filtró bien por servicio.

---

## 2. Lo que sigue pendiente

Sin cambios respecto al informe del 22, por orden de impacto:

1. **Imprimir / PDF** de la nota.
2. **Corregir una nota ya firmada** con rastro (quién cambió, qué decía antes,
   cuándo).
3. Decidir si los signos vitales se registran **aparte de la nota** (control
   propio cada ciertas horas) o solo dentro de ella.
4. Decidir si se **implementan o se quitan** los cinco campos que hoy no se
   usan (antecedentes, diagnósticos, farmacia, laboratorio, imagen).
5. **Endurecer SOAPIE I** (estado de cada intervención NIC).
6. Ajustar los **turnos** (día/noche, 12 horas o tres turnos).
7. **Firma digital certificada** (pendiente a propósito).
8. **Capacitación** al personal.

---

## 3. Preguntas nuevas para la jefa (de práctica de enfermería)

1. ¿Los signos vitales en pediatría que dejamos opcionales (perímetro
   cefálico, perímetro abdominal, presión arterial y hemoglucotest) son
   correctos así, o alguno de ellos **sí debería ser obligatorio** en algún
   caso? (Por ejemplo: ¿el perímetro cefálico siempre se toma en neonatos?)
2. ¿En otros servicios pediátricos (UCIN intermedio, UCI neonatología grave)
   la lista de obligatorios debería ser la misma que en hospitalización, o
   distinta?
3. ¿El orden de los campos en la fila de signos vitales les resulta natural,
   o lo preferirían agrupado de otra manera (por ejemplo: temperatura, peso,
   talla, frecuencias, saturación, presión, etc.)?

---

## 4. Lo que necesitamos del hospital

Sin cambios: lugar estable para los datos con respaldos, lista oficial de
diagnósticos NANDA/NOC/NIC si hay una propia, y permiso/horario para
capacitar.

---

## 5. Resumen

| Área | Estado |
|---|---|
| Pacientes, camas y traslados | ✅ Funcionando |
| Auditoría de camas | ✅ Funcionando |
| Nota SOAPIE (crear, guardar, firmar) | ✅ Funcionando |
| Plan de cuidados NANDA/NOC/NIC | ✅ Funcionando |
| Signos vitales dentro de la nota | ✅ Funcionando |
| Historial de notas y de signos vitales | ✅ Funcionando |
| Notas separadas por servicio | ✅ Funcionando (nuevo) |
| Signos vitales obligatorios/opcionales por servicio | ✅ Funcionando (nuevo) |
| Imprimir / PDF | ❌ Falta |
| Corrección de nota firmada con rastro | ❌ Falta |
| Signos vitales como registro aparte | ❌ Falta |
| Cinco campos (antecedentes, lab, etc.) | ⚠️ A medias: usar o quitar |
| Firma digital certificada | ⏸️ Pendiente a propósito |
| Capacitación al personal | ❌ Falta |

---

*Informe generado el 23 de octubre de 2026. Los cambios están en la rama
`JJRama` del repositorio SOAPIE.*
